import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home/Home';
import Studio from './pages/Studio/Studio';
import Markets from './pages/Markets/Markets';
import TLTube from './pages/TLTube/TLTube';
import Editor from './pages/Editor/Editor';
import AdsPlatform from './pages/AdsPlatform/AdsPlatform';
import Wallet from './pages/Wallet/Wallet';
import Profile from './pages/Profile/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/tltube" element={<TLTube />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/ads" element={<AdsPlatform />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
