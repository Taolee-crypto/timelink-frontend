import React from 'react';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  return (
    <div className="auth-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'radial-gradient(circle at 20% 30%, #1a0b2e, #0a0a0a 80%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="auth-box" style={{
        background: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '48px 40px',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '480px',
        width: '100%',
        border: '1px solid var(--border-color)',
        animation: 'fadeUp 0.6s ease'
      }}>
        <div className="logo" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #b983ff, #8a2be2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px',
            marginBottom: '8px'
          }}>⏰ TimeLink</h1>
          <p>Suno AI 연동 · 유료 회원 전용</p>
        </div>
        
        <div style={{
          background: 'rgba(255,123,0,0.2)',
          padding: '10px',
          borderRadius: '999px',
          marginBottom: '20px'
        }}>
          ✨ Suno Pro/Premier 회원만 TL3 생성 가능
        </div>
        
        <button
          className="google-login-btn"
          onClick={onLogin}
          style={{
            background: '#4285F4',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '1.1rem',
            fontWeight: 600,
            padding: '18px 24px',
            borderRadius: 'var(--radius-full)',
            margin: '30px 0',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            transition: 'var(--transition)',
            boxShadow: '0 8px 20px rgba(66, 133, 244, 0.3)'
          }}
        >
          <i className="fab fa-google"></i> 시간 계좌 개설
        </button>
      </div>
    </div>
  );
};
