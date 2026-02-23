import React, { useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { MainApp } from './pages/MainApp/MainApp';
import './assets/styles/global.css';
import './assets/styles/components.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowOnboarding(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {/* Toast Container */}
      <div id="toast" style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#333',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '999px',
        zIndex: 10000,
        display: 'none'
      }}></div>

      {/* Onboarding Popup */}
      {showOnboarding && (
        <div style={{
          display: 'flex',
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 100000,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            background: '#1e1e1e',
            padding: '40px',
            borderRadius: '28px',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <h2 className="hero-glow" style={{ color: 'white', fontSize: '2.5rem' }}>⏰ TimeLink</h2>
            <p style={{ color: '#b3b3b3', margin: '20px 0' }}>Suno AI 연동 히어로 에디션</p>
            <button
              onClick={() => setShowOnboarding(false)}
              className="suno-button"
              style={{
                background: 'var(--suno)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '16px 32px',
                fontWeight: 700,
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
                boxShadow: '0 0 20px var(--suno-glow)'
              }}
            >
              시작하기
            </button>
          </div>
        </div>
      )}

      {/* Audio Player */}
      <audio id="audioPlayer" style={{ display: 'none' }}></audio>

      {/* Main Content */}
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <MainApp onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
