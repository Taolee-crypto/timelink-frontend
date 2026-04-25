import React, { useState } from 'react';

const API_BASE = 'https://api.timelink.digital';

interface SunoConverterProps {
  onConvert: (songData: any) => void;
  authToken?: string;
  userId?: number;
  username?: string;
  userEmail?: string;
}

export const SunoConverter: React.FC<SunoConverterProps> = ({ onConvert, authToken, userId, username, userEmail }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [step, setStep] = useState<'idle'|'verifying'|'preview'|'converting'>('idle');

  const extractSunoId = (raw: string) => { const m = raw.match(/suno\.com\/song\/([a-zA-Z0-9_-]+)/); return m ? m[1] : null; };
  const formatDur = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  const handleVerify = async () => {
    setError(null); setPreview(null);
    const songId = extractSunoId(url.trim());
    if (!songId) { setError('올바른 Suno URL을 입력하세요. 예: https://suno.com/song/abc123'); return; }
    setLoading(true); setStep('verifying');
    try {
      const res = await fetch(`${API_BASE}/api/v1/suno/verify`, { method:'POST', headers:{ 'Content-Type':'application/json', ...(authToken?{'Authorization':`Bearer ${authToken}`}:{}) }, body: JSON.stringify({ song_url: url.trim(), song_id: songId }) });
      if (res.ok) {
        const data = await res.json();
        setPreview({ id:songId, title:data.title||`Track ${songId.slice(0,8)}`, artist:data.artist||username||'Suno Creator', duration:data.duration||180, genre:data.genre||'Music', cover:data.image_url||null, audioUrl:data.audio_url||null, sunoUrl:url.trim() });
        setStep('preview');
      } else {
        const metaRes = await fetch(`${API_BASE}/api/v1/suno/meta?id=${songId}`, { headers: authToken?{'Authorization':`Bearer ${authToken}`}:{} });
        if (metaRes.ok) {
          const d = await metaRes.json();
          setPreview({ id:songId, title:d.title||`Track ${songId.slice(0,8)}`, artist:d.artist||username||'Suno Creator', duration:d.duration||180, genre:d.genre||'Music', cover:d.image_url||null, audioUrl:d.audio_url||null, sunoUrl:url.trim() });
          setStep('preview');
        } else { const e = await res.json().catch(()=>({})); setError((e as any).error||`Suno 곡 확인 실패. 공개 곡인지 확인하세요.`); setStep('idle'); }
      }
    } catch(e:any) { setError('네트워크 오류: '+e.message); setStep('idle'); }
    finally { setLoading(false); }
  };

  const handleConvert = async () => {
    if (!preview) return;
    setConverting(true); setStep('converting'); setError(null);
    try {
      const shareRes = await fetch(`${API_BASE}/api/shares`, { method:'POST', headers:{ 'Content-Type':'application/json', ...(authToken?{'Authorization':`Bearer ${authToken}`}:{}) }, body: JSON.stringify({ title:preview.title, artist:preview.artist, album:'', duration:preview.duration, file_tl:Math.ceil(preview.duration*1.0)||5000, category:preview.genre||'Music', file_type:'audio/mpeg', category_type:'suno', description:`Suno AI | ${preview.sunoUrl}`, plan:'A', stream_url:preview.audioUrl||'', cover_url:preview.cover||'', preview_url:preview.audioUrl||'', country:'KR', content_lang:'ko', shared_to_shareplace:true, user_id:userId, username:username||'Creator', email:userEmail||'', price_per_sec:1.0 }) });
      if (!shareRes.ok) { const e = await shareRes.json().catch(()=>({})); throw new Error((e as any).error||`등록 실패 (${shareRes.status})`); }
      const shareData = await shareRes.json();
      await fetch(`${API_BASE}/api/files/sync`, { method:'POST', headers:{ 'Content-Type':'application/json', ...(authToken?{'Authorization':`Bearer ${authToken}`}:{}) }, body: JSON.stringify({ title:preview.title, artist:preview.artist, genre:preview.genre||'Music', stream_url:preview.audioUrl||'', cover_image:preview.cover||'', price_per_sec:1.0, shared_to_shareplace:true, auth_status:'suno_verified', icon:'🎵', user_email:userEmail||'', username:username||'Creator' }) }).catch(()=>{});
      onConvert({ ...preview, shareId:shareData.id, tl_remaining:shareData.tl_remaining, converted:true });
      setPreview(null); setUrl(''); setStep('idle');
    } catch(e:any) { setError('변환 실패: '+e.message); setStep('preview'); }
    finally { setConverting(false); }
  };

  return (
    <div style={{ background:'linear-gradient(145deg, #2a1a1a, #1a1a1a)', border:'2px solid var(--suno, #ff6b35)', borderRadius:'var(--radius-xl, 20px)', padding:'32px', marginBottom:'32px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'10px', right:'20px', fontSize:'5rem', opacity:0.07, color:'var(--suno, #ff6b35)', fontWeight:800, pointerEvents:'none', userSelect:'none' }}>🎵 SUNO AI</div>
      <h2 style={{ color:'white', marginBottom:'8px' }}>🎵 Suno AI → TL3 변환</h2>
      <p style={{ color:'var(--text-secondary, #888)', marginBottom:'24px', fontSize:'0.95rem' }}>Suno Pro/Premier 회원만 가능합니다. URL을 입력하면 곡 정보를 확인하고 TL3로 변환합니다.</p>
      {(step==='idle'||step==='verifying') && (
        <div style={{ display:'flex', gap:'12px', marginBottom:'16px', flexWrap:'wrap' }}>
          <input type="text" placeholder="https://suno.com/song/abc123..." value={url} onChange={e=>setUrl(e.target.value)} disabled={loading} onKeyDown={e=>e.key==='Enter'&&!loading&&handleVerify()} style={{ flex:1, minWidth:'200px', padding:'14px 18px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'999px', color:'white', fontSize:'1rem', outline:'none' }} />
          <button onClick={handleVerify} disabled={loading||!url.trim()} style={{ padding:'14px 24px', background:loading?'#555':'var(--suno, #ff6b35)', color:'white', border:'none', borderRadius:'999px', fontWeight:700, fontSize:'1rem', cursor:(loading||!url.trim())?'not-allowed':'pointer', whiteSpace:'nowrap' }}>
            {loading?'⏳ 확인 중...':'🔍 확인 및 가져오기'}
          </button>
        </div>
      )}
      {step==='verifying' && <div style={{ textAlign:'center', padding:'20px', color:'#aaa' }}><div style={{ fontSize:'2rem', marginBottom:'8px' }}>⏳</div><p>Suno 곡 정보 조회 중...</p></div>}
      {step==='converting' && <div style={{ textAlign:'center', padding:'20px', color:'#aaa' }}><div style={{ fontSize:'2rem', marginBottom:'8px' }}>✨</div><p>TL3로 변환 중... SharePlace에 등록하고 있어요.</p></div>}
      {preview && step==='preview' && (
        <div>
          <div style={{ display:'flex', gap:'24px', marginTop:'8px', padding:'24px', background:'rgba(0,0,0,0.3)', borderRadius:'16px', flexWrap:'wrap' }}>
            <div style={{ width:'120px', height:'120px', flexShrink:0, borderRadius:'12px', background:preview.cover?`url(${preview.cover}) center/cover`:'linear-gradient(135deg, var(--suno, #ff6b35), #c44dff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>{!preview.cover&&'🎵'}</div>
            <div style={{ flex:1, minWidth:'180px' }}>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px' }}>
                <span style={{ background:'rgba(255,107,53,0.2)', color:'var(--suno, #ff6b35)', padding:'4px 12px', borderRadius:'999px', fontSize:'0.82rem', fontWeight:700 }}>✅ Suno 확인됨</span>
                <span style={{ background:'rgba(34,197,94,0.15)', color:'#4ade80', padding:'4px 12px', borderRadius:'999px', fontSize:'0.82rem', fontWeight:700 }}>Commercial OK</span>
              </div>
              <h3 style={{ color:'white', fontSize:'1.4rem', marginBottom:'4px' }}>{preview.title}</h3>
              <p style={{ color:'#888', marginBottom:'16px' }}>{preview.artist}</p>
              <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
                <div><div style={{ color:'#666', fontSize:'0.8rem', marginBottom:'2px' }}>Duration</div><strong style={{ color:'white' }}>{formatDur(preview.duration)}</strong></div>
                <div><div style={{ color:'#666', fontSize:'0.8rem', marginBottom:'2px' }}>Genre</div><strong style={{ color:'white' }}>{preview.genre}</strong></div>
                <div><div style={{ color:'#666', fontSize:'0.8rem', marginBottom:'2px' }}>TL3 전환 시</div><strong style={{ color:'#4ade80' }}>+{preview.duration} TL</strong></div>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'12px', marginTop:'20px', justifyContent:'flex-end', flexWrap:'wrap' }}>
            <button onClick={()=>{setPreview(null);setUrl('');setError(null);setStep('idle');}} style={{ padding:'12px 24px', background:'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'#aaa', borderRadius:'999px', cursor:'pointer', fontWeight:600 }}>취소</button>
            <button onClick={handleConvert} disabled={converting} style={{ padding:'12px 28px', background:converting?'#555':'var(--suno, #ff6b35)', color:'white', border:'none', borderRadius:'999px', fontWeight:700, fontSize:'1rem', cursor:converting?'not-allowed':'pointer', boxShadow:'0 4px 16px rgba(255,107,53,0.3)' }}>{converting?'변환 중...':'✨ TL3로 변환하기'}</button>
          </div>
        </div>
      )}
      {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid #ef4444', borderRadius:'12px', padding:'16px', marginTop:'16px', color:'#fca5a5', fontSize:'0.95rem' }}>⚠️ {error}</div>}
    </div>
  );
};
