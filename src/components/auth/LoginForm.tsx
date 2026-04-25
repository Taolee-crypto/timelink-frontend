import React, { useState, useEffect } from 'react';

const API_BASE = 'https://api.timelink.digital';

interface LoginFormProps {
  onLogin: (userData?: any) => void;
}

declare global {
  interface Window {
    tonConnectUI?: any;
  }
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tonLoading, setTonLoading] = useState(false);
  const [tonAddress, setTonAddress] = useState('');
  const [tonConnected, setTonConnected] = useState(false);

  useEffect(() => {
    if (document.getElementById('ton-connect-script')) return;
    const script = document.createElement('script');
    script.id = 'ton-connect-script';
    script.src = 'https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js';
    script.async = true;
    script.onload = () => {
      try {
        const TonConnectUI = (window as any).TON_CONNECT_UI?.TonConnectUI || (window as any).TonConnectUI;
        if (!TonConnectUI) return;
        window.tonConnectUI = new TonConnectUI({ manifestUrl: 'https://timelink.digital/tonconnect-manifest.json' });
        window.tonConnectUI.onStatusChange((wallet: any) => {
          if (wallet) { setTonAddress(wallet.account?.address || ''); setTonConnected(true); }
          else { setTonAddress(''); setTonConnected(false); }
        });
      } catch (e) { console.warn('TON Connect init failed:', e); }
    };
    document.head.appendChild(script);
  }, []);

  const handleTonConnect = async () => {
    setTonLoading(true); setError('');
    try {
      if (window.tonConnectUI) {
        if (tonConnected) { await window.tonConnectUI.disconnect(); setTonConnected(false); setTonAddress(''); setTonLoading(false); return; }
        const wallet = await window.tonConnectUI.connectWallet();
        const addr = wallet?.account?.address || '';
        if (addr) { setTonAddress(addr); setTonConnected(true); onLogin({ ton_address: addr, token: 'ton_' + addr.slice(0,16) + '_' + Date.now(), loginMethod: 'ton' }); }
      } else {
        const addr = window.prompt('TON 지갑 주소를 입력하세요 (UQ... 또는 EQ...로 시작하는 48자)', '') || '';
        if (!addr) { setTonLoading(false); return; }
        if (!/^[0EU]Q[A-Za-z0-9_-]{46}$/.test(addr.trim())) { setError('유효하지 않은 TON 주소입니다.'); setTonLoading(false); return; }
        setTonAddress(addr.trim()); setTonConnected(true);
        onLogin({ ton_address: addr.trim(), token: 'ton_' + addr.slice(0,16) + '_' + Date.now(), loginMethod: 'ton' });
      }
    } catch (e: any) {
      if (e?.message?.includes('User rejected')) setError('TON 지갑 연결이 거부되었습니다.');
      else { const addr = window.prompt('TON 지갑 주소를 직접 입력하세요', '') || ''; if (addr && /^[0EU]Q[A-Za-z0-9_-]{46}$/.test(addr.trim())) { setTonAddress(addr.trim()); setTonConnected(true); onLogin({ ton_address: addr.trim(), token: 'ton_' + addr.slice(0,16) + '_' + Date.now(), loginMethod: 'ton' }); } }
    } finally { setTonLoading(false); }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) { setError('이메일과 비밀번호를 입력하세요.'); return; }
    if (isSignup && !username) { setError('닉네임을 입력하세요.'); return; }
    setLoading(true); setError('');
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const body: any = { email, password };
      if (isSignup) body.username = username;
      const res = await fetch(API_BASE + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok || !data.ok) { setError(data.error || '로그인 실패'); return; }
      if (tonAddress && data.token) { await fetch(API_BASE + '/api/ton/connect', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${data.token}` }, body: JSON.stringify({ ton_address: tonAddress }) }).catch(() => {}); }
      onLogin({ ...data.user, token: data.token, loginMethod: 'email' });
    } catch (e: any) { setError('네트워크 오류: ' + e.message); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' };
  const shortAddr = tonAddress ? `${tonAddress.slice(0,6)}...${tonAddress.slice(-4)}` : '';

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'20px', background:'radial-gradient(circle at 20% 30%, #1a0b2e, #0a0a0a 80%)', position:'relative', overflow:'hidden' }}>
      <div style={{ background:'rgba(26,26,26,0.95)', backdropFilter:'blur(20px)', padding:'48px 40px', borderRadius:'24px', boxShadow:'0 24px 80px rgba(0,0,0,0.6)', maxWidth:'480px', width:'100%', border:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <h1 style={{ fontSize:'3rem', fontWeight:800, background:'linear-gradient(135deg, #b983ff, #8a2be2)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-1px', marginBottom:'8px' }}>⏰ TimeLink</h1>
          <p style={{ color:'#666', fontSize:'0.9rem' }}>Suno AI 연동 · 유료 회원 전용</p>
        </div>
        <div style={{ background:'rgba(255,123,0,0.15)', border:'1px solid rgba(255,123,0,0.3)', padding:'10px 16px', borderRadius:'999px', marginBottom:'28px', textAlign:'center', color:'#ffaa44', fontSize:'0.9rem', fontWeight:600 }}>
          ✨ Suno Pro/Premier 회원만 TL3 생성 가능
        </div>
        <button onClick={handleTonConnect} disabled={tonLoading} style={{ width:'100%', padding:'16px 24px', background: tonConnected ? 'linear-gradient(135deg, #0098ea, #0066cc)' : 'rgba(0,152,234,0.1)', border:`2px solid ${tonConnected ? '#0098ea' : 'rgba(0,152,234,0.5)'}`, borderRadius:'999px', color: tonConnected ? 'white' : '#0098ea', fontWeight:700, fontSize:'1rem', cursor: tonLoading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', transition:'all 0.25s', marginBottom:'12px', boxShadow: tonConnected ? '0 4px 20px rgba(0,152,234,0.4)' : 'none' }}>
          <svg width="22" height="22" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="28" fill="#0098EA"/><path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 43.2496C27.0345 44.5793 28.9644 44.5793 29.7345 43.2496L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5603 15.6277Z" fill="white"/><path d="M37.5603 15.6277H28V44.5793C28.3951 44.5793 28.7902 44.3963 29.0133 44.0278L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5603 15.6277Z" fill="rgba(255,255,255,0.6)"/></svg>
          {tonLoading ? '연결 중...' : tonConnected ? `✓ TON 연결됨 ${shortAddr}` : 'TON Wallet 연결'}
        </button>
        {tonConnected && <p style={{ textAlign:'center', color:'#4ade80', fontSize:'0.82rem', marginBottom:'16px' }}>✅ TON 지갑 연결 완료 — 이메일 로그인 후 TLC 출금 가능</p>}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'20px 0', color:'#444' }}>
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize:'0.8rem' }}>또는 이메일로 {isSignup ? '가입' : '로그인'}</span>
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {isSignup && <input type="text" placeholder="닉네임" value={username} onChange={e => setUsername(e.target.value)} style={inp} />}
          <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==='Enter' && handleEmailLogin()} style={inp} />
          <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==='Enter' && handleEmailLogin()} style={inp} />
        </div>
        {error && <div style={{ marginTop:'12px', padding:'10px 16px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'12px', color:'#fca5a5', fontSize:'0.88rem' }}>{error}</div>}
        <button onClick={handleEmailLogin} disabled={loading} style={{ width:'100%', background: loading ? '#555' : 'linear-gradient(135deg, #8a2be2, #b983ff)', color:'white', padding:'16px 24px', borderRadius:'999px', fontWeight:700, fontSize:'1rem', border:'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop:'16px', boxShadow:'0 8px 24px rgba(138,43,226,0.4)', transition:'all 0.2s' }}>
          {loading ? '처리 중...' : isSignup ? '🚀 가입하기' : '⏰ 시간 계좌 개설'}
        </button>
        <p style={{ textAlign:'center', marginTop:'20px', color:'#666', fontSize:'0.9rem' }}>
          {isSignup ? '이미 계정이 있으신가요? ' : '처음이신가요? '}
          <span onClick={() => { setIsSignup(!isSignup); setError(''); }} style={{ color:'#b983ff', cursor:'pointer', fontWeight:600 }}>
            {isSignup ? '로그인' : '무료 가입'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
