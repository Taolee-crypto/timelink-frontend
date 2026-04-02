import { useState, useEffect } from 'react'
import SunoVerify from '../components/verify/SunoVerify'
import CreatorStudio from './creator/CreatorStudio'

const API = 'https://api.timelink.digital'

export default function CreatorGate() {
  const [status, setStatus] = useState('loading') // loading | verified | unverified | expired

  useEffect(() => {
    checkVerification()
  }, [])

  const checkVerification = async () => {
    try {
      const token = localStorage.getItem('timelink_auth_token')
      const res   = await fetch(`${API}/v1/suno/verification-status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data  = await res.json()

      if (data.verified && isDateFuture(data.endDate)) {
        setStatus('verified')
      } else if (data.verified && !isDateFuture(data.endDate)) {
        setStatus('expired')
      } else {
        setStatus('unverified')
      }
    } catch {
      setStatus('unverified')
    }
  }

  const handleVerified = () => setStatus('verified')

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>확인 중...</div>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <div style={{ maxWidth: 480, margin: '60px auto', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠</div>
        <h2 style={{ fontWeight: 500 }}>Suno 플랜이 만료되었습니다</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 24 }}>
          Suno 플랜을 갱신한 후 다시 인증해 주세요.
        </p>
        <button
          onClick={() => setStatus('unverified')}
          style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#7B2FFF', color: '#fff', cursor: 'pointer', fontWeight: 500 }}
        >
          다시 인증하기
        </button>
      </div>
    )
  }

  if (status === 'unverified') {
    return <SunoVerify onVerified={handleVerified} />
  }

  // verified → 크리에이터 스튜디오 바로 진입
  return <CreatorStudio />
}

function isDateFuture(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) > new Date()
}
