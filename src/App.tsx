import { useState, useEffect } from 'react'
import axios from 'axios'

const WORKER_URL = 'https://timelink-backend.mununglee.workers.dev'

function App() {
  const [tracks, setTracks] = useState([])
  const [boosts, setBoosts] = useState(0)

  const loadTracks = async () => {
    try {
      const res = await axios.get(`${WORKER_URL}/tracks`)
      setTracks(res.data || [])
    } catch (err) {
      console.error('트랙 로드 실패', err)
    }
  }

  useEffect(() => {
    loadTracks()
  }, [])

  const handleBoost = async (trackId) => {
    try {
      await axios.post(`${WORKER_URL}/boost/${trackId}`)
      setBoosts(prev => prev + 100)
      loadTracks()
    } catch (err) {
      alert('Boost 실패')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 md:p-12">
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-slate-800/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-violet-500 to-amber-500 bg-clip-text text-transparent">
            Pulse
          </h1>
          <div className="flex gap-6 items-center">
            <div className="text-lg">
              Live: <span className="text-amber-400 font-bold">{2847 + boosts}</span>
            </div>
            <a href="/create" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-full font-bold transition">
              Create Track
            </a>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            Feel the Pulse
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-10">
            네가 듣는 1초가 누군가의 돈이 된다
          </p>
        </div>

        <section>
          <h3 className="text-3xl font-bold mb-8 text-center">Hot Pulse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.length === 0 ? (
              <p className="col-span-full text-center text-slate-400 py-20">
                아직 트랙이 없습니다. Create Track으로 추가하세요!
              </p>
            ) : (
              tracks.map(track => (
                <div key={track.id} className="bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all hover:scale-105">
                  <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-8xl">
                    🎵
                  </div>
                  <div className="p-6">
                    <h4 className="text-2xl font-bold mb-2">{track.title}</h4>
                    <p className="text-slate-400 mb-4">{track.creator_handle}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-amber-400 font-bold text-xl">+{track.earnings} TL</div>
                      <button 
                        onClick={() => handleBoost(track.id)}
                        className="px-6 py-2 bg-amber-600 hover:bg-amber-500 rounded-full font-bold transition"
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
