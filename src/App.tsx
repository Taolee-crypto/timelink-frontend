import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-8xl font-black text-violet-500 mb-8">
        PULSE
      </h1>
      <p className="text-3xl text-amber-400 mb-12">
        이제 제대로 떴다
      </p>
      <button className="px-12 py-6 bg-amber-600 text-black text-3xl font-black rounded-2xl hover:bg-amber-500 transition">
        Boost +100 TL
      </button>
    </div>
  )
}

export default App
