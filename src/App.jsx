import React, { useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { MainApp } from './pages/mainapp/mainapp';
import './assets/styles/global.css';
import './assets/styles/components.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogin = (data) => {
    if (data) setUserData(data);
    setIsLoggedIn(true);
    setShowOnboarding(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <>
      <div id="toast" style={{ position:'fixed', top:'20px', right:'20px', background:'#333', color:'white', padding:'12px 24px', borderRadius:'999px', zIndex:10000, display:'none' }}></div>

      {showOnboarding && (
        <div style={{ display:'flex', position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', backdropFilter:'blur(10px)', zIndex:100000, justifyContent:'center', alignItems:'center' }}>
          <div style={{ background:'#1e1e1e', padding:'40px', borderRadius:'28px', maxWidth:'500px', textAlign:'center' }}>
            <h2 style={{ color:'white', fontSize:'2.5rem' }}>⏰ TimeLink</h2>
            <p style={{ color:'#b3b3b3', margin:'20px 0' }}>Suno AI 연동 히어로 에디션</p>
            <button onClick={() => setShowOnboarding(false)} style={{ background:'var(--suno, #ff6b35)', color:'white', border:'none', borderRadius:'999px', padding:'16px 32px', fontWeight:700, fontSize:'1.1rem', cursor:'pointer' }}>
              시작하기
            </button>
          </div>
        </div>
      )}

      <audio id="audioPlayer" style={{ display:'none' }}></audio>

      {!isLoggedIn
        ? <LoginForm onLogin={handleLogin} />
        : <MainApp onLogout={handleLogout} user={userData} />
      }
    </>
  );
}

export default App;
