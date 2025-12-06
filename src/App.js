// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Studio from './pages/Studio/Studio';
// ... 다른 페이지 임포트

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studio" element={<Studio />} />
        {/* ... 다른 라우트 */}
      </Routes>
    </Router>
  );
}
