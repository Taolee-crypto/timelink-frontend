import React from 'react';

interface CarTabProps {
  carMode: boolean;
  onToggleCarMode: () => void;
}

export const CarTab: React.FC<CarTabProps> = ({ carMode, onToggleCarMode }) => {
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
      }}>🚗 Car Mode</h2>

      <div className="car-header" style={{
        background: 'linear-gradient(145deg, #1e3a3a, #1a1a1a)',
        padding: '40px',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        border: carMode ? '2px solid var(--success)' : '1px solid var(--border-color)',
        marginBottom: '30px',
        transition: 'var(--transition)'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🚗</div>
        <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>
          {carMode ? 'Car Mode 활성화' : 'Car Mode 비활성화'}
        </div>
        <div style={{ fontSize: '1.5rem', color: carMode ? 'var(--success)' : 'var(--text-secondary)' }}>
          {carMode ? '2배 보상' : '일반 보상'}
        </div>
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Car Mode 혜택</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--success)' }}>✓</span> 모든 수익 2배
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--success)' }}>✓</span> TL 적립 속도 2배
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--success)' }}>✓</span> 전용 Car Mode 플레이리스트
          </li>
        </ul>
      </div>

      <button
        className="btn-car"
        onClick={onToggleCarMode}
        style={{
          background: carMode ? 'var(--danger)' : 'var(--success)',
          padding: '18px',
          width: '100%',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.2rem',
          cursor: 'pointer',
          transition: 'var(--transition)'
        }}
      >
        🚗 {carMode ? 'Car Mode 끄기' : 'Car Mode 켜기'}
      </button>
    </div>
  );
};
