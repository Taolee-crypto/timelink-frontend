import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [tracks, setTracks] = useState([])
  const [liveUsers, setLiveUsers] = useState(2847)
  const [totalEarnings, setTotalEarnings] = useState(12470)

  // 백엔드에서 트랙 목록 가져오기 (로컬 8000번 포트)
  useEffect(() => {
    axios.get('http://localhost:8000/tracks')
      .then(res => setTracks(res.data))
      .catch(err => console.error('트랙 로드 실패', err))
  }, [])

  const handleBoost = async (trackId) => {
    try {
      const res = await axios.post(`http://localhost:8000/boost/${trackId}`)
      setTotalEarnings(prev => prev + 100)
      setLiveUsers(prev => prev + 5)
      alert(`Boost 성공! ${res.data.message}`)
    } catch (e) {
      alert('Boost 실패: ' + e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white font-sans">
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-slate-800/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-black bg-gradient-to-r from-violet-500 to-amber-500 bg-clip-text text-transparent">
            Pulse
          </div>
          <div className="flex gap-6 items-center">
            <div className="text-sm">
              TL: <span className="text-amber-400 font-bold">12,847</span>
            </div>
            <a href="/create" className="px-6 py-2 bg-violet-600 hover:bg-violet-500 rounded-full font-medium transition">
              Create Track
            </a>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            {liveUsers.toLocaleString()} people<br />
            feeling the <span className="text-amber-400">Pulse</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            네가 듣는 1초가 누군가의 돈이 된다
          </p>
          <div className="text-2xl mb-10">
            Total Earnings: <span className="text-amber-400 font-bold">{totalEarnings.toLocaleString()} TL</span>
          </div>
        </div>

        <section>
          <h2 className="text-4xl font-bold mb-10 text-center">Hot Pulse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.length === 0 ? (
              <div className="col-span-full text-center text-slate-400 py-20">
                아직 업로드된 트랙이 없습니다
              </div>
            ) : (
              tracks.map(track => (
                <div key={track.id} className="bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all hover:scale-[1.02]">
                  <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-8xl">
                    🎵
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{track.title}</h3>
                    <p className="text-slate-400 mb-4">{track.creator_handle}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-amber-400 font-bold text-xl">+{track.earnings} TL</div>
                      <button 
                        onClick={() => handleBoost(track.id)}
                        className="px-8 py-3 bg-amber-600 hover:bg-amber-500 rounded-full font-bold transition"
                      >
                        Boost
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
