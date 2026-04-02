import { useState, useRef } from 'react'

// Tesseract.js CDN — 브라우저에서 직접 OCR 실행
// index.html에 추가 필요:
// <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>

const ALLOWED_PLANS = ['pro plan', 'premier plan']
const API = 'https://api.timelink.digital'

export default function SunoVerify({ onVerified }) {
  const [file,    setFile]    = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [result,  setResult]  = useState(null)
  const inputRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setResult(null)
    setProgress('')
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(f)
  }

  const handleVerify = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)

    try {
      // ── 1. Tesseract.js OCR (브라우저에서 직접 실행) ──
      setProgress('이미지에서 텍스트 읽는 중...')
      const { data: { text } } = await window.Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(`분석 중... ${Math.round(m.progress * 100)}%`)
          }
        }
      })

      setProgress('플랜 정보 확인 중...')
      const lower = text.toLowerCase()

      // ── 2. 텍스트에서 플랜 정보 추출 ─────────────────
      // Suno 화면 키워드 확인
      const isSunoPage = lower.includes('suno') ||
                         lower.includes('current plan') ||
                         lower.includes('billing period') ||
                         lower.includes('plan end date') ||
                         lower.includes('credits remaining')

      if (!isSunoPage) {
        setResult({
          ok: false,
          reason: 'Suno 계정 화면이 감지되지 않습니다. Suno 플랜 관리 화면을 캡처해 주세요.',
        })
        setLoading(false)
        return
      }

      // 플랜 추출
      const planMatch = text.match(/(?:current\s+plan[\s:]*)?([A-Za-z]+\s+plan)/i)
      const detectedPlan = planMatch?.[1]?.trim() ?? ''

      // 만료일 추출 (Mar 11, 2026 형태)
      const dateMatch = text.match(/(?:plan end date[\s:]*)?([A-Za-z]{3,9}\s+\d{1,2},?\s+20\d{2})/i)
      const detectedDate = dateMatch?.[1]?.trim() ?? ''

      // 크레딧 추출
      const creditMatch = text.match(/(\d{3,5})\s*(?:credits?)?/i)
      const detectedCredits = creditMatch?.[1] ?? ''

      // ── 3. 검증 로직 ────────────────────────────────
      const planLower = detectedPlan.toLowerCase()
      const isAllowed = ALLOWED_PLANS.some(p => planLower.includes(p))
      const isNotExpired = detectedDate
        ? new Date(detectedDate) > new Date()
        : false

      let verifyResult

      if (!isAllowed) {
        verifyResult = {
          ok: false,
          plan: detectedPlan || '감지 안 됨',
          endDate: detectedDate,
          credits: detectedCredits,
          reason: detectedPlan
            ? `${detectedPlan}은 업로드 권한이 없습니다. Pro 또는 Premier 플랜이 필요합니다.`
            : '플랜 정보를 읽을 수 없습니다. 화면이 잘 보이도록 다시 캡처해 주세요.',
        }
      } else if (detectedDate && !isNotExpired) {
        verifyResult = {
          ok: false,
          plan: detectedPlan,
          endDate: detectedDate,
          credits: detectedCredits,
          reason: `플랜이 만료되었습니다 (${detectedDate}). Suno 플랜을 갱신 후 다시 인증해 주세요.`,
        }
      } else {
        verifyResult = {
          ok: true,
          plan: detectedPlan,
          endDate: detectedDate,
          credits: detectedCredits,
          reason: '인증 완료',
        }
      }

      setResult(verifyResult)

      // ── 4. 인증 성공 시 백엔드에 저장 ───────────────
      if (verifyResult.ok) {
        const token = localStorage.getItem('timelink_auth_token')
        await fetch(`${API}/v1/suno/save-verification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan:    verifyResult.plan,
            endDate: verifyResult.endDate,
            credits: verifyResult.credits,
          }),
        })
        onVerified?.(verifyResult)
      }

    } catch (e) {
      setResult({ ok: false, reason: 'OCR 오류: ' + e.message })
    } finally {
      setLoading(false)
      setProgress('')
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>

      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>♪</div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}>
          Suno 플랜 인증
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, margin: 0 }}>
          Pro 이상 플랜 회원만 음악을 업로드할 수 있습니다.
        </p>
      </div>

      {/* 캡처 가이드 */}
      <div style={{
        background: 'var(--color-background-secondary)',
        borderRadius: 10, padding: '14px 18px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>캡처 방법</div>
        <ol style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: 2.2 }}>
          <li>suno.com → 로그인</li>
          <li>우측 상단 프로필 → <b>Manage Plan</b></li>
          <li>아래 화면처럼 상단 바가 보이게 캡처</li>
        </ol>
        {/* 예시 이미지 힌트 */}
        <div style={{
          marginTop: 12, background: '#1a1a1a', borderRadius: 6, padding: '8px 12px',
          fontSize: 11, color: '#888', fontFamily: 'monospace',
          display: 'flex', gap: 16,
        }}>
          <span>Current Plan<br/><b style={{color:'#fff'}}>Pro Plan</b></span>
          <span>Plan End Date<br/><b style={{color:'#fff'}}>Mar 11, 2026</b></span>
          <span>Credits Remaining<br/><b style={{color:'#fff'}}>1812</b></span>
        </div>
      </div>

      {/* 업로드 */}
      <div
        onClick={() => !loading && inputRef.current?.click()}
        style={{
          border: '2px dashed var(--color-border-secondary)',
          borderRadius: 12, minHeight: 140, marginBottom: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: loading ? 'default' : 'pointer',
          overflow: 'hidden', background: 'var(--color-background-secondary)',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }}/>
        {preview ? (
          <img src={preview} alt="" style={{ width: '100%', display: 'block' }}/>
        ) : (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>↑</div>
            <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>스크린샷 업로드</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>PNG · JPG</div>
          </div>
        )}
      </div>

      {/* 진행 상태 */}
      {progress && (
        <div style={{
          fontSize: 13, color: 'var(--color-text-secondary)',
          textAlign: 'center', marginBottom: 12,
        }}>
          ⏳ {progress}
        </div>
      )}

      {/* 검증 버튼 */}
      <button
        onClick={handleVerify}
        disabled={!file || loading}
        style={{
          width: '100%', padding: 14, borderRadius: 10, border: 'none',
          background: file && !loading ? '#7B2FFF' : 'var(--color-border-secondary)',
          color: '#fff', fontWeight: 500, fontSize: 15,
          cursor: file && !loading ? 'pointer' : 'not-allowed', marginBottom: 16,
        }}
      >
        {loading ? '분석 중...' : '플랜 자동 인증'}
      </button>

      {/* 결과 */}
      {result && (
        <div style={{
          borderRadius: 10, padding: '18px 20px',
          background: result.ok ? '#00D4FF11' : '#FF444411',
          border: `1px solid ${result.ok ? '#00D4FF55' : '#FF444455'}`,
        }}>
          {result.ok ? (
            <>
              <div style={{ fontWeight: 500, color: '#00D4FF', marginBottom: 12 }}>✓ 인증 완료!</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                {[
                  ['플랜',    result.plan],
                  ['만료일',  result.endDate || '확인 필요'],
                  ['크레딧',  result.credits ? result.credits + ' 크레딧' : '-'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--color-text-secondary)', minWidth: 52 }}>{k}</span>
                    <span style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 14, padding: '10px 14px', borderRadius: 8,
                background: '#7B2FFF22', color: '#7B2FFF', fontSize: 13, fontWeight: 500,
              }}>
                ★ 크리에이터 스튜디오 접근 권한 부여됨
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 500, color: '#FF4444', marginBottom: 8 }}>✗ 인증 실패</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{result.reason}</div>
              {result.plan && (
                <div style={{ fontSize: 13, marginTop: 8 }}>
                  감지된 플랜: <b>{result.plan}</b>
                </div>
              )}
              <a href="https://suno.com/pricing" target="_blank" rel="noopener"
                style={{ display: 'inline-block', marginTop: 10, fontSize: 13, color: '#7B2FFF' }}>
                Suno 업그레이드 →
              </a>
            </>
          )}
        </div>
      )}
    </div>
  )
}
