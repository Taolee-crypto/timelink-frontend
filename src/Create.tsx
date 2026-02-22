import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const WORKER_URL = 'https://timelink-api.mununglee.workers.dev'

function Create() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus('업로드 중...')

    const formData = new FormData(e.target)

    try {
      await axios.post(`${WORKER_URL}/create`, formData)
      setStatus('업로드 성공! 2초 후 홈으로 이동합니다...')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setStatus('업로드 실패: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-5xl md:text-6xl font-black text-center mb-12 bg-gradient-to-r from-violet-500 to-amber-500 bg-clip-text text-transparent">
          Create Track
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            placeholder="Track Title"
            required
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <input
            name="creator"
            placeholder="Creator Name"
            required
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <input
            type="file"
            name="file"
            accept="audio/*"
            required
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-full font-bold text-xl transition ${
              loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-amber-600 hover:from-violet-500 hover:to-amber-500'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload Track'}
          </button>
        </form>

        {status && (
          <p className={`mt-6 text-center text-xl font-medium ${status.includes('성공') ? 'text-green-400' : 'text-red-400'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  )
}

export default Create