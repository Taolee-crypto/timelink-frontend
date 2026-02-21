import { useState } from 'react'

function App() {
  const [liveUsers, setLiveUsers] = useState(2847)
  const [totalEarnings, setTotalEarnings] = useState(12470)

  const handleBoost = () => {
    setTotalEarnings(prev => prev + 100)
    setLiveUsers(prev => prev + 5) // 모의 증가
    alert('Boost +100 TL! (백엔드 연결 준비됨)')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-slate-800/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-black bg-gradient-to-r from-violet-500 to-amber-500 bg-clip-text text-transparent">
            Pulse
          </div>
          <div className="flex gap-6 items-center">
            <div className="text-sm">
              TL: <span className="text-amber-400 font-bold">12,847</span>
            </div>
            <button className="px-6 py-2 bg-violet-600 hover:bg-violet-500 rounded-full font-medium transition">
              Create Track
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            {liveUsers.toLocaleString()} people<br />
            feeling the <span className="text-amber-400">Pulse</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10">
            네가 듣는 1초가 누군가의 돈이 된다
          </p>
          <div className="text-2xl mb-8">
            Total Earnings: <span className="text-amber-400 font-bold">{totalEarnings.toLocaleString()} TL</span>
          </div>
          <button 
            onClick={handleBoost}
            className="px-12 py-6 bg-gradient-to-r from-amber-600 to-amber-500 text-black text-2xl font-black rounded-2xl hover:brightness-110 transition shadow-2xl shadow-amber-900/50"
          >
            Boost +100 TL
          </button>
        </div>

        <section>
          <h2 className="text-4xl font-bold mb-10 text-center">Hot Pulse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all hover:scale-[1.02]">
                <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-8xl">
                  🎵
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Track Title {i + 1}</h3>
                  <p className="text-slate-400 mb-4">@creator{i + 1}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-amber-400 font-bold text-xl">+{(i + 1) * 1200} TL</div>
                    <button className="px-8 py-3 bg-amber-600 hover:bg-amber-500 rounded-full font-bold transition">
                      Boost
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
