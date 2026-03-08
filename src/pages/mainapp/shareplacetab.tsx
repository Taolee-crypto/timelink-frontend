import React from 'react';

export const SharePlaceTab: React.FC = () => {
  // 샘플 공유 음악 데이터
  const sharedMusic = [
    { id: 's1', title: 'Midnight Vibe', artist: 'Synthwave', downloads: 1234 },
    { id: 's2', title: 'Electric Dreams', artist: 'Neon', downloads: 892 },
    { id: 's3', title: 'Sunset Flow', artist: 'Chill', downloads: 2341 }
  ];

  return (
    <div className="card" style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-xl)',
      padding: '32px',
      marginBottom: '32px',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: 700,
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #fff, #e0e0e0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>🔄 Share Place</h2>
      
      <div className="file-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {sharedMusic.map(music => (
          <div key={music.id} className="file-card" style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            border: '1px solid var(--border-color)'
          }}>
            <div className="file-name" style={{ fontWeight: 600, marginBottom: '8px' }}>
              {music.title}
            </div>
            <div className="file-artist" style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {music.artist}
            </div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '16px' }}>
              다운로드: {music.downloads.toLocaleString()}회
            </div>
            <button
              className="btn-play"
              onClick={() => alert('다운로드 데모')}
              style={{
                background: 'var(--info)',
                padding: '10px',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition)',
                width: '100%'
              }}
            >
              📥 다운로드
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
