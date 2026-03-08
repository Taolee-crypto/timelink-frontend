import React from 'react';
import { SunoConverter } from '@/components/suno/sunoconverter';

interface CreateTabProps {
  onSunoConvert: (songData: any) => void;
}

export const CreateTab: React.FC<CreateTabProps> = ({ onSunoConvert }) => {
  return (
    <div>
      {/* Suno AI 연동 섹션 */}
      <SunoConverter onConvert={onSunoConvert} />

      {/* 기존 Create 섹션 (TL3/TL4 업로드) */}
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
        }}>📤 직접 업로드</h2>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div className="file-type-card" style={{
            flex: 1,
            background: 'rgba(29,185,84,0.1)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            🎵 TL3 Audio
          </div>
          <div className="file-type-card" style={{
            flex: 1,
            background: 'rgba(255,85,0,0.1)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            🎬 TL4 Video
          </div>
        </div>

        <div
          className="upload-zone"
          onClick={() => alert('파일 선택 (데모)')}
          style={{
            border: '2px dashed var(--accent)',
            padding: '60px',
            textAlign: 'center',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          <div className="icon" style={{ fontSize: '4rem' }}>📂</div>
          <h3>Click to select file</h3>
          <p>MP3, WAV, FLAC, MP4</p>
        </div>
      </div>
    </div>
  );
};
