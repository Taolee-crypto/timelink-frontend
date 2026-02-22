import React from 'react';
import { NowPlaying } from '@/components/timeline/nowplaying';

interface DashboardProps {
  currentFile: any;
  user: {
    trust: number;
    lvs: number;
  };
  carMode: boolean;
  onToggleCarMode: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentFile,
  user,
  carMode,
  onToggleCarMode
}) => {
  // 임시 진행 상태 (실제로는 오디오 재생 상태에서 가져와야 함)
  const progress = 45;
  const currentTime = 135;
  const duration = 270;

  return (
    <div>
      {currentFile && (
        <NowPlaying
          currentFile={currentFile}
          progress={progress}
          currentTime={currentTime}
          duration={duration}
        />
      )}

      <div className="home-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <div className="info-card" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '20px' }}>🔮 신뢰 점수</h3>
          <div className="trust-circle" style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `conic-gradient(var(--success) 0deg, var(--success) ${(user.trust / 1.2) * 360}deg, #333 ${(user.trust / 1.2) * 360}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <div className="trust-circle-inner" style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem'
            }}>
              {user.trust.toFixed(2)}
            </div>
          </div>
          <p style={{ marginTop: '12px' }}>
            Listening Validity: <strong>{user.lvs.toFixed(2)}</strong>
          </p>
        </div>

        <div className="info-card" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>⚡ 현재 보상률</h3>
          <div style={{ fontSize: '2rem' }} id="currentRate">
            {(carMode ? 2.0 : 1.0).toFixed(1)}x
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Car Mode: <span>{carMode ? 'On' : 'Off'}</span>
              <button
                className="btn-play"
                onClick={onToggleCarMode}
                style={{
                  background: carMode ? 'var(--success)' : 'var(--info)',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🚗 {carMode ? '비활성화' : '활성화'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
