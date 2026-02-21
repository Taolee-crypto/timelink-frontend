import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Create() {
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !creator || !file) {
      setStatus('모든 필드를 채워주세요')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('creator', creator)
    formData.append('file', file)

    try {
      const res = await axios.post('http://localhost:8000/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setStatus('업로드 성공! Pulse로 이동합니다...')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setStatus('업로드 실패: ' + (err.response?.data?.detail || err.message))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex flex-col items-center p-8">
      <h1 className="text-5xl md:text-7xl font-black mb-12 bg-gradient-to-r from-violet-500 to-amber-500 bg-clip-text text-transparent">
        Create Track
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-8">
        <div>
          <label className="block text-xl mb-3">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white text-xl focus:border-violet-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xl mb-3">Creator</label>
          <input
            type="text"
            value={creator}
            onChange={e => setCreator(e.target.value)}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white text-xl focus:border-violet-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xl mb-3">Audio/Video File</label>
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-500"
            required
          />
        </div>

        <button type="submit" className="w-full py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-2xl text-2xl font-bold transition shadow-2xl shadow-violet-900/50">
          Upload to Pulse
        </button>

        {status && <p className="text-center text-xl mt-6 text-amber-400">{status}</p>}
      </form>
    </div>
  )
}

export default Create
