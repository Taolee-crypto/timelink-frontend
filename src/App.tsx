// App.tsx 맨 위에
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
