const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// CORS 설정
app.use(cors());
app.use(express.json());

// 파일 업로드를 위한 multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB 제한
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp3|wav|mp4|avi|mov|flac|aac|m4a/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('지원하지 않는 파일 형식입니다.'));
        }
    }
});

// 변환 결과 저장 폴더
const conversionsDir = 'conversions/';
if (!fs.existsSync(conversionsDir)) {
    fs.mkdirSync(conversionsDir, { recursive: true });
}

// TL 타입별 설정
const TL_TYPES = {
    'tl3': {
        audio: { codec: 'aac', bitrate: '128k', extension: '.m4a' },
        video: { codec: 'h264', bitrate: '2000k', extension: '.mp4' }
    },
    'tl4': {
        audio: { codec: 'flac', bitrate: '320k', extension: '.flac' },
        video: { codec: 'h265', bitrate: '5000k', extension: '.mp4' }
    },
    'tl5': {
        audio: { codec: 'flac', bitrate: '1411k', extension: '.flac' },
        video: { codec: 'prores', bitrate: '10000k', extension: '.mov' }
    }
};

// 1. 파일 업로드 엔드포인트
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
        }

        const fileInfo = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            path: req.file.path,
            uploadTime: new Date().toISOString()
        };

        res.json({
            success: true,
            message: '파일 업로드 성공',
            file: fileInfo
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. 파일 변환 엔드포인트
app.post('/api/convert', async (req, res) => {
    try {
        const { filename, tlType, title, description, genre, pricePerSecond } = req.body;
        
        if (!filename || !tlType) {
            return res.status(400).json({ success: false, message: '필수 정보가 누락되었습니다.' });
        }

        const inputPath = path.join('uploads', filename);
        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ success: false, message: '업로드된 파일을 찾을 수 없습니다.' });
        }

        const tlConfig = TL_TYPES[tlType];
        if (!tlConfig) {
            return res.status(400).json({ success: false, message: '지원하지 않는 TL 타입입니다.' });
        }

        const outputFilename = `converted_${Date.now()}_${tlType}${tlConfig.audio.extension}`;
        const outputPath = path.join(conversionsDir, outputFilename);

        // FFmpeg 명령어 생성 (실제 변환 로직)
        const isAudio = path.extname(filename).match(/\.(mp3|wav|flac|aac|m4a)$/i);
        const config = isAudio ? tlConfig.audio : tlConfig.video;
        
        const ffmpegCommand = `ffmpeg -i "${inputPath}" -codec:a ${config.codec} -b:a ${config.bitrate} "${outputPath}"`;

        // 변환 실행 (비동기)
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('FFmpeg 오류:', error);
                return res.status(500).json({ 
                    success: false, 
                    message: '파일 변환 중 오류가 발생했습니다.',
                    error: error.message 
                });
            }

            const convertedFileInfo = {
                id: Date.now(),
                originalFilename: filename,
                convertedFilename: outputFilename,
                tlType: tlType,
                title: title || '변환된 파일',
                description: description || '',
                genre: genre || '',
                pricePerSecond: pricePerSecond || 1,
                fileSize: fs.statSync(outputPath).size,
                duration: 0, // 실제로는 ffprobe로 추출해야 함
                conversionTime: new Date().toISOString(),
                downloadUrl: `/api/download/${outputFilename}`,
                playTime: 100, // 기본 제공 시간
                totalTime: 100
            };

            // 메타데이터 저장
            saveMetadata(convertedFileInfo);

            res.json({
                success: true,
                message: '파일 변환이 완료되었습니다.',
                file: convertedFileInfo
            });
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. 변환된 파일 다운로드 엔드포인트
app.get('/api/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(conversionsDir, filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: '파일을 찾을 수 없습니다.' });
        }

        res.download(filePath, filename);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 4. 파일 목록 조회 엔드포인트
app.get('/api/files', (req, res) => {
    try {
        const files = getMetadata();
        res.json({ success: true, files: files });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 5. 사용자 파일 정보 조회
app.get('/api/user/files/:userId', (req, res) => {
    try {
        const userId = req.params.userId;
        const allFiles = getMetadata();
        const userFiles = allFiles.filter(file => file.uploaderId === userId);
        
        res.json({ success: true, files: userFiles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 6. 파일 재생 엔드포인트
app.get('/api/play/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(conversionsDir, filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: '파일을 찾을 수 없습니다.' });
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            // 스트리밍 지원
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 7. 변환 상태 확인
app.get('/api/conversion/status/:id', (req, res) => {
    try {
        const id = req.params.id;
        const metadata = getMetadata();
        const file = metadata.find(f => f.id == id);
        
        if (!file) {
            return res.status(404).json({ success: false, message: '변환 정보를 찾을 수 없습니다.' });
        }

        res.json({ success: true, status: 'completed', file: file });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 8. 파일 삭제 엔드포인트
app.delete('/api/file/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(conversionsDir, filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            removeMetadata(filename);
        }

        res.json({ success: true, message: '파일이 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 9. 시스템 상태 확인
app.get('/api/status', (req, res) => {
    try {
        const metadata = getMetadata();
        const uploadsDir = 'uploads/';
        const conversionsDir = 'conversions/';
        
        const stats = {
            totalFiles: metadata.length,
            tl3Files: metadata.filter(f => f.tlType === 'tl3').length,
            tl4Files: metadata.filter(f => f.tlType === 'tl4').length,
            tl5Files: metadata.filter(f => f.tlType === 'tl5').length,
            diskUsage: {
                uploads: getDirectorySize(uploadsDir),
                conversions: getDirectorySize(conversionsDir)
            },
            serverTime: new Date().toISOString(),
            uptime: process.uptime()
        };

        res.json({ success: true, stats: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 메타데이터 관리 함수들
function saveMetadata(fileInfo) {
    const metadataPath = 'conversions/metadata.json';
    let metadata = [];
    
    if (fs.existsSync(metadataPath)) {
        const data = fs.readFileSync(metadataPath, 'utf8');
        metadata = JSON.parse(data);
    }
    
    metadata.push(fileInfo);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

function getMetadata() {
    const metadataPath = 'conversions/metadata.json';
    
    if (fs.existsSync(metadataPath)) {
        const data = fs.readFileSync(metadataPath, 'utf8');
        return JSON.parse(data);
    }
    
    return [];
}

function removeMetadata(filename) {
    const metadataPath = 'conversions/metadata.json';
    
    if (fs.existsSync(metadataPath)) {
        const data = fs.readFileSync(metadataPath, 'utf8');
        let metadata = JSON.parse(data);
        
        metadata = metadata.filter(file => file.convertedFilename !== filename);
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    }
}

function getDirectorySize(dirPath) {
    if (!fs.existsSync(dirPath)) return 0;
    
    let totalSize = 0;
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile()) {
            totalSize += stat.size;
        } else if (stat.isDirectory()) {
            totalSize += getDirectorySize(filePath);
        }
    });
    
    return totalSize;
}

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.', error: err.message });
});

// 404 처리
app.use((req, res) => {
    res.status(404).json({ success: false, message: '요청한 경로를 찾을 수 없습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 TL Platform 백엔드 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📁 업로드 디렉토리: ./uploads/`);
    console.log(`📁 변환 디렉토리: ./conversions/`);
});
