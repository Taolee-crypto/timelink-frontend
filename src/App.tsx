import { useState } from 'react'

function App() {
  const [boosts, setBoosts] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 md:p-12 font-sans">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-slate-800/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-violet-500 to-amber-500 bg-clip-text text-transparent">
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
        </div>
      </header>

      {/* Hero */}
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
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

        {/* Hot Pulse */}
        <section>
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
      </main>
    </div>
  )
}

export default App// App.tsx 맨 위에
import axios from 'axios'

// ... App 함수 안 어딘가에 버튼 예시 추가
<button 
  onClick={async () => {
    try {
      const res = await axios.get('http://localhost:8000/tracks')
      alert('백엔드 연결 성공! 트랙 개수: ' + res.data.length)
    } catch (e) {
      alert('연결 실패: ' + e.message)
    }
  }}
  className="px-8 py-4 bg-green-600 text-white rounded-xl"
>
  백엔드 연결 테스트
</button>
export default function App() {
  return (
    <div style={{
      height: '100vh',
      background: '#000',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '5rem',
      fontWeight: 'bold'
    }}>
      PULSE 여기 떴다 새끼야!!!
    </div>
  )
}
