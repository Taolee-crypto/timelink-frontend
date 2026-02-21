import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const WORKER_URL = 'https://timelink-api.mununglee.workers.dev'

function Create() {
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !creator || !file) {
      setStatus('모든 필드 채워')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('creator', creator)
    formData.append('file', file)

    try {
      const res = await axios.post(`${WORKER_URL}/create`, formData)
      setStatus('업로드 성공! Pulse로 이동...')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setStatus('실패: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <h1 className="text-5xl font-black mb-12 text-center text-violet-500">Create Track</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white"
            required
          />
          <input
            type="text"
            placeholder="Creator"
            value={creator}
            onChange={e => setCreator(e.target.value)}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white"
            required
          />
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={e => setFile(e.target.files[0])}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white"
            required
          />
          <button type="submit" className="w-full py-4 bg-violet-600 hover:bg-violet-500 rounded-xl text-xl font-bold">
            Upload
          </button>
          {status && <p className="text-center mt-4 text-amber-400">{status}</p>}
        </form>
      </div>
    </div>
  )
}

export default Create
