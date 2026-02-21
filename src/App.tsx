function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f0c29, #302b63, #24243e)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '6rem',
        fontWeight: '900',
        marginBottom: '1rem',
        background: 'linear-gradient(to right, #a78bfa, #fbbf24)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        PULSE
      </h1>
      
      <p style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fbbf24' }}>
        이제 제대로 떴다 🔥
      </p>
      
      <button style={{
        padding: '1rem 3rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #fbbf24, #d97706)',
        color: 'black',
        border: 'none',
        borderRadius: '9999px',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(251, 191, 36, 0.4)'
      }}>
        Boost +100 TL
      </button>
    </div>
  )
}

export default App
