import React from 'react';
import { MusicFile } from '@/hooks/usetimelinksystem';

interface LibraryTabProps {
  files: MusicFile[];
  onPlay: (file: MusicFile) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({ files, onPlay }) => {
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
      }}>🎵 My Files (TL3/TL4)</h2>
      
      <div className="file-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {files.map(file => (
          <div key={file.id} className="file-card" style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div className="file-name" style={{ fontWeight: 600 }}>{file.title}</div>
              {file.source === 'suno' && (
                <span className="suno-badge" style={{
                  background: 'var(--suno)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Suno
                </span>
              )}
            </div>
            <div className="file-artist" style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {file.artist}
            </div>
            <div style={{ margin: '16px 0', fontSize: '1.5rem' }}>
              TL {file.token?.balance || 0}
            </div>
            <button
              className="btn-play"
              onClick={() => onPlay(file)}
              style={{
                background: 'var(--success)',
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
              ▶️ 재생
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
