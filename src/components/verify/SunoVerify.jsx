import { useState, useRef } from 'react'

const API = 'https://api.timelink.digital'

// Pro 이상 플랜 목록
const ALLOWED_PLANS = ['pro plan', 'premier plan', 'pro', 'premier']

export default function SunoVerify({ onVerified }) {
  const [file,     setFile]     = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState(null) // { ok, plan, endDate, credits, reason }
  const inputRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setResult(null)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(f)
  }

  const handleVerify = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    try {
      const token = localStorage.getItem('timelink_auth_token')
      const form  = new FormData()
      form.append('screenshot', file)

      const res = await fetch(`${API}/v1/suno/verify-plan`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      setResult(data)
      if (data.ok) onVerified?.(data)
    } catch (e) {
      setResult({ ok: false, reason: '서버 오류: ' + e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>

      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>♪</div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}>
          Suno 플랜 인증
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, margin: 0 }}>
          Suno Pro 이상 플랜 회원만 음악을 업로드할 수 있습니다.<br/>
          Suno 계정 화면 스크린샷을 업로드해 주세요.
        </p>
      </div>

      {/* 가이드 */}
      <div style={{
        background: 'var(--color-background-secondary)',
        borderRadius: 10, padding: '14px 16px', marginBottom: 24, fontSize: 13,
      }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>스크린샷 찍는 방법</div>
        <ol style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-secondary)', lineHeight: 2 }}>
          <li>suno.com 접속 → 로그인</li>
          <li>우측 상단 프로필 → <b>Manage Plan</b> 클릭</li>
          <li>Current Plan, Plan End Date가 보이는 화면 캡처</li>
          <li>아래에 업로드</li>
        </ol>
      </div>

      {/* 업로드 영역 */}
      <div
        onClick={() => !loading && inputRef.current?.click()}
        style={{
          border: `2px dashed ${preview ? 'var(--color-border-secondary)' : 'var(--color-border-secondary)'}`,
          borderRadius: 12, overflow: 'hidden',
          cursor: loading ? 'default' : 'pointer',
          marginBottom: 16, minHeight: 140,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--color-background-secondary)',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }}/>
        {preview ? (
          <img src={preview} alt="preview" style={{ width: '100%', display: 'block' }}/>
        ) : (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>↑</div>
            <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
              클릭하여 스크린샷 업로드
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              PNG, JPG 지원
            </div>
          </div>
        )}
      </div>

      {/* 검증 버튼 */}
      <button
        onClick={handleVerify}
        disabled={!file || loading}
        style={{
          width: '100%', padding: '13px', borderRadius: 10, border: 'none',
          background: file && !loading ? '#7B2FFF' : 'var(--color-border-secondary)',
          color: '#fff', fontWeight: 500, fontSize: 15,
          cursor: file && !loading ? 'pointer' : 'not-allowed',
          marginBottom: 16,
        }}
      >
        {loading ? '🔍 AI가 플랜 확인 중...' : 'Suno 플랜 자동 인증'}
      </button>

      {/* 결과 */}
      {result && (
        <div style={{
          borderRadius: 10, padding: '16px 20px',
          background: result.ok ? '#00D4FF11' : '#FF444411',
          border: `1px solid ${result.ok ? '#00D4FF44' : '#FF444444'}`,
        }}>
          {result.ok ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 10, color: '#00D4FF' }}>
                ✓ 인증 완료!
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                <Row k="플랜"     v={result.plan} highlight />
                <Row k="만료일"   v={result.endDate} />
                <Row k="크레딧"   v={`${result.credits} 크레딧 남음`} />
              </div>
              <div style={{
                marginTop: 14, padding: '10px 14px', borderRadius: 8,
                background: '#7B2FFF22', fontSize: 13, color: '#7B2FFF', fontWeight: 500,
              }}>
                ★ 크리에이터 스튜디오 접근 권한이 부여되었습니다!
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: '#FF4444' }}>
                ✗ 인증 실패
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                {result.reason}
              </div>
              {result.plan && (
                <div style={{ fontSize: 13, marginTop: 8 }}>
                  감지된 플랜: <b>{result.plan}</b>
                  {' '}— Pro 또는 Premier 플랜이 필요합니다.
                </div>
              )}
              <a
                href="https://suno.com/pricing"
                target="_blank"
                rel="noopener"
                style={{
                  display: 'inline-block', marginTop: 12,
                  fontSize: 13, color: '#7B2FFF',
                }}
              >
                Suno 플랜 업그레이드 →
              </a>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ k, v, highlight }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <span style={{ color: 'var(--color-text-secondary)', minWidth: 56 }}>{k}</span>
      <span style={{ fontWeight: highlight ? 500 : 400, color: highlight ? '#00D4FF' : 'inherit' }}>{v}</span>
    </div>
  )
}
