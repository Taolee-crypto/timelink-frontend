// src/App.tsx
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-black text-white flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-violet-500 to-amber-500 bg-clip-text text-transparent">
          Pulse
        </h1>
        <p className="text-2xl md:text-4xl mb-12 text-slate-300">
          Every second counts. Every listen pays.
        </p>
        <div className="text-xl mb-8">
          Live users now: <span className="text-amber-400 font-bold">2,847</span> (mock)
        </div>
        <button 
          className="px-10 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-2xl font-bold hover:brightness-110 transition shadow-2xl shadow-violet-900/50"
          onClick={() => setCount(count + 1)}
        >
          Boost Pulse {count}
        </button>
      </div>
    </div>
  )
}

export default App
