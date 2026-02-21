// ... App 함수 위에
const WORKER_URL = 'https://timelink-api.mununglee.workers.dev'  // 실제 Worker URL로 바꿔

// useEffect로 트랙 목록 불러오기
useEffect(() => {
  fetch(`${WORKER_URL}/tracks`)
    .then(res => res.json())
    .then(data => setTracks(data || []))
    .catch(err => console.error('트랙 로드 실패', err))
}, [])

// Boost 함수도 Worker로
const handleBoost = async (trackId) => {
  try {
    const res = await fetch(`${WORKER_URL}/boost/${trackId}`, { method: 'POST' })
    const data = await res.json()
    if (data.success) {
      setBoosts(prev => prev + 100)
      // 트랙 새로고침
      const fresh = await fetch(`${WORKER_URL}/tracks`).then(r => r.json())
      setTracks(fresh)
    }
  } catch (err) {
    alert('Boost 실패: ' + err.message)
  }
}
