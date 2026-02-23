import React, { useState } from 'react';

interface SunoConverterProps {
  onConvert: (songData: any) => void;
}

export const SunoConverter: React.FC<SunoConverterProps> = ({ onConvert }) => {
  const [url, setUrl] = useState('https://suno.com/song/abc123');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = () => {
    setLoading(true);
    setError(null);
    
    // API 호출 시뮬레이션
    setTimeout(() => {
      const songData = {
        title: 'Midnight Vibes',
        artist: 'Synthwave Producer',
        duration: 225,
        genre: 'Synthwave',
        cover: '🎵',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        id: 'suno_' + Date.now()
      };
      
      setPreview(songData);
      setLoading(false);
    }, 2000);
  };

  const handleConvert = () => {
    if (preview) {
      onConvert(preview);
      setPreview(null);
      setUrl('');
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setUrl('');
    setError(null);
  };

  return (
    <div className="suno-section" style={{
      background: 'linear-gradient(145deg, #2a1a1a, #1a1a1a)',
      border: '2px solid var(--suno)',
      borderRadius: 'var(--radius-xl)',
      padding: '32px',
      marginBottom: '32px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        content: '""',
        position: 'absolute',
        top: '10px',
        right: '20px',
        fontSize: '5rem',
        opacity: 0.1,
        color: 'var(--suno)',
        fontWeight: 800,
        pointerEvents: 'none'
      }}>🎵 SUNO AI</div>

      <h2 style={{ color: 'white', marginBottom: '16px' }}>🎵 Suno AI → TL3 변환</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Suno Pro/Premier 회원만 가능합니다. URL을 입력하면 구독 상태를 확인하고 음원을 TL3로 변환합니다.
      </p>

      {/* URL 입력 폼 */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input
          type="text"
          className="suno-input"
          placeholder="https://suno.com/song/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button
          className="suno-button"
          onClick={handleVerify}
          disabled={loading}
          id="sunoVerifyBtn"
        >
          {loading ? '확인 중...' : '🔍 확인 및 가져오기'}
        </button>
      </div>

      {/* 로딩 표시 */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem', animation: 'pulse 1s infinite' }}>⏳</div>
          <p>Suno API 확인 중... (쿠키 기반 인증)</p>
        </div>
      )}

      {/* 확인 결과 / 미리보기 */}
      {preview && (
        <div>
          <div className="suno-preview" style={{
            display: 'flex',
            gap: '24px',
            marginTop: '24px',
            padding: '24px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div className="suno-cover" style={{
              width: '120px',
              height: '120px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--suno), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              {preview.cover}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <span className="suno-badge"><i className="fas fa-check-circle"></i> Pro verified</span>
                <span className="suno-badge" style={{ background: 'var(--success)' }}>Commercial use OK</span>
              </div>
              <h3 style={{ fontSize: '1.8rem' }}>{preview.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>{preview.artist}</p>
              <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                <div>
                  <span className="label">Duration</span><br />
                  <strong>{Math.floor(preview.duration / 60)}:{(preview.duration % 60).toString().padStart(2, '0')}</strong>
                </div>
                <div>
                  <span className="label">Genre</span><br />
                  <strong>{preview.genre}</strong>
                </div>
                <div>
                  <span className="label">TL3 전환 시</span><br />
                  <strong style={{ color: 'var(--success)' }}>+1,000 TL</strong>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button
              className="btn-play"
              onClick={handleCancel}
              style={{ background: 'transparent', border: '1px solid var(--border-color)' }}
            >
              취소
            </button>
            <button
              className="suno-button"
              onClick={handleConvert}
              id="sunoConvertBtn"
            >
              ✨ TL3로 변환하기
            </button>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--danger)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginTop: '20px'
        }}>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
        </div>
      )}
    </div>
  );
};
