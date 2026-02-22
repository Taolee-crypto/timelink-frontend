import React from 'react';

export const RadioTab: React.FC = () => {
  const channels = [
    { id: 'pop', name: 'Pop', icon: '🎵', color: '#ff6b6b' },
    { id: 'rock', name: 'Rock', icon: '🎸', color: '#4ecdc4' },
    { id: 'jazz', name: 'Jazz', icon: '🎷', color: '#ffe66d' },
    { id: 'classical', name: 'Classical', icon: '🎻', color: '#c77dff' }
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
      }}>📻 Radio</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {channels.map(channel => (
          <div
            key={channel.id}
            className="radio-channel-card"
            onClick={() => alert(`${channel.name} 채널 재생 (데모)`)}
            style={{
              background: `linear-gradient(135deg, ${channel.color}20, var(--bg-card-hover))`,
              padding: '32px 24px',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{channel.icon}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{channel.name}</div>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              fontSize: '0.8rem',
              color: 'var(--text-tertiary)'
            }}>
              ▶️ Live
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
