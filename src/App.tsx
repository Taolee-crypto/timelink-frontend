import { useState } from 'react'

function App() {
  const [boosts, setBoosts] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 md:p-12">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-violet-500 to-amber-500 bg-clip-text text-transparent">
          Pulse
        </h1>
        <div className="flex gap-6 items-center">
          <div className="text-lg">
            Live: <span className="text-amber-400 font-bold">{2847 + boosts}</span>
          </div>
          <button className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-full font-bold transition">
            Create Track
          </button>
        </div>
      </header>

      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-7xl font-black mb-6">
          Feel the Pulse
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 mb-10">
          네가 듣는 1초가 누군가의 돈이 된다
        </p>
        <button 
          onClick={() => setBoosts(boosts + 100)}
          className="px-12 py-6 bg-gradient-to-r from-amber-600 to-amber-500 text-black text-2xl font-black rounded-2xl hover:brightness-110 transition shadow-2xl shadow-amber-900/50"
        >
          Boost +100 TL ({boosts})
        </button>
      </div>

      <section className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-center">Hot Pulse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all hover:scale-105">
              <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-8xl">
                🎵
              </div>
              <div className="p-6">
                <h4 className="text-2xl font-bold mb-2">Track {i+1}</h4>
                <p className="text-slate-400 mb-4">@creator</p>
                <div className="flex justify-between items-center">
                  <div className="text-amber-400 font-bold text-xl">+{(i+1)*1200} TL</div>
                  <button className="px-6 py-2 bg-amber-600 hover:bg-amber-500 rounded-full font-bold transition">
                    Boost
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
