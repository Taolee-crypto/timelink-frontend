import React from 'react';
import { User } from '@/types/common.types';

interface HeaderProps {
  user: User | null;
  wallet: {
    available: number;
    locked: number;
  };
  onLogout: () => void;
  onChargeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  wallet,
  onLogout,
  onChargeClick
}) => {
  return (
    <div className="app-header" style={{
      background: 'rgba(17, 17, 17, 0.85)',
      backdropFilter: 'blur(20px)',
      padding: '20px 32px',
      borderRadius: 'var(--radius-xl)',
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: '20px',
      zIndex: 100
    }}>
      <div className="header-left">
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #b983ff, #8a2be2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          ⏰ TimeLink Global
          <span className="demo-badge" style={{
            background: 'var(--warning)',
            color: 'black',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 700,
            display: 'inline-block',
            marginLeft: '12px',
            textTransform: 'uppercase'
          }}>Suno 연동</span>
        </h1>
      </div>
      
      <div className="header-right" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div className="balance-cards" style={{ display: 'flex', gap: '16px' }}>
          <div
            className="balance-card"
            onClick={onChargeClick}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '12px 20px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(8px)',
              transition: 'var(--transition)',
              minWidth: '130px',
              cursor: 'pointer'
            }}
          >
            <div className="label" style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>💰 TL</div>
            <div className="amount" style={{ fontSize: '22px', fontWeight: 800, color: 'white', lineHeight: 1.2 }} id="walletBalance">
              {wallet.available.toLocaleString()}
            </div>
          </div>
          
          <div className="balance-card" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(8px)',
            transition: 'var(--transition)',
            minWidth: '130px'
          }}>
            <div className="label" style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>🔒 Locked</div>
            <div className="amount" style={{ fontSize: '22px', fontWeight: 800, color: 'white', lineHeight: 1.2 }} id="lockedBalance">
              {wallet.locked.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="user-profile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px 8px 12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)'
        }}>
          <div className="avatar-circle" style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8a2be2, #6b21a5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '18px'
          }}>
            {user?.username?.[0] || 'G'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.username || 'Global Investor'}</div>
            <div className="user-status" id="trustDisplay">Trust 1.00</div>
          </div>
        </div>

        <button
          className="btn-logout"
          onClick={onLogout}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-secondary)',
            padding: '10px 20px',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
