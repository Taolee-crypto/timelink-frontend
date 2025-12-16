// Video Server Worker - 비디오 파일 변환 및 서빙
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS 헤더
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-TL-Token',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const path = url.pathname;

    // 비디오 업로드
    if (path.startsWith('/upload') && request.method === 'POST') {
      return handleVideoUpload(request, env);
    }

    // 비디오 변환
    if (path.startsWith('/convert') && request.method === 'POST') {
      return handleVideoConversion(request, env);
    }

    // HLS/DASH 스트리밍
    if (path.startsWith('/stream/') && request.method === 'GET') {
      return handleVideoStreaming(request, env, url);
    }

    // 썸네일 생성
    if (path.startsWith('/thumbnail/') && request.method === 'GET') {
      return handleThumbnail(request, env, url);
    }

    // 비디오 메타데이터
    if (path.startsWith('/metadata/') && request.method === 'GET') {
      return handleVideoMetadata(request, env, url);
    }

    return new Response('TL Video Server API', {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// 비디오 업로드 처리
async function handleVideoUpload(request, env) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video');
    const metadata = JSON.parse(formData.get('metadata') || '{}');
    
    if (!videoFile) {
      return jsonResponse({ error: 'No video file provided' }, 400);
    }

    // 비디오 형식 검증
    const allowedTypes = [
      'video/mp4', 'video/webm', 'video/ogg', 
      'video/quicktime', 'video/x-msvideo'
    ];
    
    if (!allowedTypes.includes(videoFile.type)) {
      return jsonResponse({ error: 'Unsupported video format' }, 415);
    }

    // 파일 크기 제한 (2GB)
    const maxSize = 2 * 1024 * 1024 * 1024;
    if (videoFile.size > maxSize) {
      return jsonResponse({ error: 'Video file too large' }, 413);
    }

    // 비디오 파일 ID 생성
    const videoId = `VID_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // R2에 비디오 저장
    await env.VIDEO_BUCKET.put(`temp/${videoId}`, videoFile.stream());

    // 비디오 메타데이터 추출 (FFmpeg 웹어셈블리 사용)
    const videoInfo = await extractVideoInfo(videoFile);
    
    // 메타데이터 저장
    await env.VIDEO_METADATA.put(videoId, JSON.stringify({
      ...metadata,
      ...videoInfo,
      originalName: videoFile.name,
      uploadTime: new Date().toISOString()
    }));

    return jsonResponse({
      success: true,
      videoId,
      message: 'Video uploaded successfully',
      videoInfo,
      tempUrl: `/temp/${videoId}`
    });

  } catch (error) {
    console.error('Video upload error:', error);
    return jsonResponse({ error: 'Video upload failed' }, 500);
  }
}

// 비디오 변환 (TL 비디오 포맷)
async function handleVideoConversion(request, env) {
  try {
    const { videoId, quality = '1080p', codec = 'h264', tlFormat = 'tlv3' } = await request.json();
    
    if (!videoId) {
      return jsonResponse({ error: 'Video ID required' }, 400);
    }

    // 원본 비디오 가져오기
    const originalVideo = await env.VIDEO_BUCKET.get(`temp/${videoId}`);
    if (!originalVideo) {
      return jsonResponse({ error: 'Video not found' }, 404);
    }

    // 변환 작업 ID
    const jobId = `vidconv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 변환 설정
    const conversionConfig = {
      jobId,
      videoId,
      quality,
      codec,
      tlFormat,
      status: 'queued',
      createdAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 300000).toISOString() // 5분 후
    };

    // 변환 작업 큐에 추가
    await env.VIDEO_QUEUE.send(conversionConfig);
    
    // 작업 상태 저장
    await env.CONVERSION_JOBS.put(jobId, JSON.stringify(conversionConfig));

    return jsonResponse({
      success: true,
      jobId,
      message: 'Video conversion started',
      wsEndpoint: `wss://${new URL(request.url).hostname}/ws/video-conversion/${jobId}`,
      estimatedTime: 300000
    });

  } catch (error) {
    console.error('Video conversion error:', error);
    return jsonResponse({ error: 'Video conversion failed' }, 500);
  }
}

// 비디오 스트리밍 (HLS/DASH)
async function handleVideoStreaming(request, env, url) {
  try {
    const videoId = url.pathname.split('/').pop();
    const format = url.searchParams.get('format') || 'hls';
    const quality = url.searchParams.get('quality') || '720p';
    
    if (!videoId) {
      return jsonResponse({ error: 'Video ID required' }, 400);
    }

    // 변환된 비디오 확인
    const videoKey = `converted/${videoId}/${quality}/master.${format === 'hls' ? 'm3u8' : 'mpd'}`;
    const manifest = await env.VIDEO_BUCKET.get(videoKey);
    
    if (!manifest) {
      return jsonResponse({ error: 'Video not available in requested format' }, 404);
    }

    const manifestText = await manifest.text();
    
    // HLS/DASH 매니페스트 반환
    const contentType = format === 'hls' ? 'application/vnd.apple.mpegurl' : 'application/dash+xml';
    
    return new Response(manifestText, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Video streaming error:', error);
    return jsonResponse({ error: 'Streaming failed' }, 500);
  }
}

// 비디오 썸네일 생성
async function handleThumbnail(request, env, url) {
  try {
    const videoId = url.pathname.split('/').pop();
    const time = url.searchParams.get('time') || '00:00:01';
    
    if (!videoId) {
      return jsonResponse({ error: 'Video ID required' }, 400);
    }

    // 썸네일 캐시 확인
    const cacheKey = `thumbnail:${videoId}:${time}`;
    const cached = await env.THUMBNAIL_CACHE.get(cacheKey);
    
    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=604800'
        }
      });
    }

    // 비디오에서 썸네일 생성 (FFmpeg 웹어셈블리)
    const videoData = await env.VIDEO_BUCKET.get(`temp/${videoId}`);
    if (!videoData) {
      return jsonResponse({ error: 'Video not found' }, 404);
    }

    // 썸네일 생성 (실제 구현은 FFmpeg.wasm 사용)
    const thumbnailBuffer = await generateThumbnailFromVideo(videoData, time);
    
    // 캐시에 저장
    await env.THUMBNAIL_CACHE.put(cacheKey, thumbnailBuffer, {
      expirationTtl: 604800 // 7일
    });

    return new Response(thumbnailBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=604800'
      }
    });

  } catch (error) {
    console.error('Thumbnail error:', error);
    return jsonResponse({ error: 'Thumbnail generation failed' }, 500);
  }
}

// 비디오 메타데이터 조회
async function handleVideoMetadata(request, env, url) {
  try {
    const videoId = url.pathname.split('/').pop();
    
    if (!videoId) {
      return jsonResponse({ error: 'Video ID required' }, 400);
    }

    const metadata = await env.VIDEO_METADATA.get(videoId, { type: 'json' });
    
    if (!metadata) {
      return jsonResponse({ error: 'Video metadata not found' }, 404);
    }

    // 변환 상태 확인
    const conversions = await getVideoConversions(videoId, env);
    
    return jsonResponse({
      success: true,
      metadata: {
        ...metadata,
        availableConversions: conversions
      }
    });

  } catch (error) {
    console.error('Video metadata error:', error);
    return jsonResponse({ error: 'Failed to get video metadata' }, 500);
  }
}

// 헬퍼 함수들
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

async function extractVideoInfo(videoFile) {
  // FFmpeg.wasm을 사용한 비디오 정보 추출
  // 실제 구현에서는 FFmpeg 웹어셈블리 사용
  
  return {
    duration: 120, // 예제 값
    width: 1920,
    height: 1080,
    codec: 'h264',
    bitrate: 5000000,
    frameRate: 30
  };
}

async function generateThumbnailFromVideo(videoData, time) {
  // FFmpeg.wasm을 사용한 썸네일 생성
  // 실제 구현에서는 FFmpeg 웹어셈블리 사용
  
  // 예제: 기본 썸네일 이미지
  const placeholderThumbnail = `data:image/svg+xml;base64,${btoa(`
    <svg width="320" height="180" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#4a1e8a"/>
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-family="Arial" font-size="16">
        Thumbnail: ${time}
      </text>
    </svg>
  `)}`;
  
  return Buffer.from(placeholderThumbnail.split(',')[1], 'base64');
}

async function getVideoConversions(videoId, env) {
  const conversions = [];
  
  // 변환 작업 목록 조회
  const jobs = await env.CONVERSION_JOBS.list({ prefix: videoId });
  
  for (const job of jobs.keys) {
    const jobData = await env.CONVERSION_JOBS.get(job.name, { type: 'json' });
    if (jobData) {
      conversions.push({
        quality: jobData.quality,
        format: jobData.tlFormat,
        status: jobData.status,
        createdAt: jobData.createdAt
      });
    }
  }
  
  return conversions;
}
