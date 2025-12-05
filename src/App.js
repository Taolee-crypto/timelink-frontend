// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 페이지 임포트
import Home from './pages/Home';
import Studio from './pages/Studio';
import Watch from './pages/Watch';
import Wallet from './pages/Wallet';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
