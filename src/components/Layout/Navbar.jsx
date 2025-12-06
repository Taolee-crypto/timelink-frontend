import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, Music, ShoppingCart, Tv, Edit, Megaphone } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { path: '/studio', label: 'TL STUDIO', icon: <Music size={18} /> },
    { path: '/markets', label: 'TL MARKETS', icon: <ShoppingCart size={18} /> },
    { path: '/tltube', label: 'TLTUBE', icon: <Tv size={18} /> },
    { path: '/editor', label: 'TL EDITOR', icon: <Edit size={18} /> },
    { path: '/ads', label: 'ADS PLATFORM', icon: <Megaphone size={18} /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-wrapper">
            <span className="logo-icon">⏰</span>
            <span className="logo-text">TimeLink</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="콘텐츠, 아티스트, 장르 검색..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Main Navigation */}
        <div className="nav-main">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              {item.icon}
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="nav-actions">
          {/* TL Balance */}
          <div className="tl-balance">
            <span className="tl-icon">⏰</span>
            <span className="tl-amount">1,250 TL</span>
          </div>

          {/* Notifications */}
          <button className="action-btn notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {/* User Menu */}
          <div className="user-menu-container">
            <button
              className="user-btn"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="user-avatar">
                <User size={20} />
              </div>
              <ChevronDown size={16} />
            </button>

            {userMenuOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-name">김타임</div>
                  <div className="user-email">time@timelink.com</div>
                </div>
                <div className="dropdown-divider" />
                <Link to="/profile" className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  프로필
                </Link>
                <Link to="/wallet" className="dropdown-item">
                  <span className="dropdown-icon">💰</span>
                  TL 지갑
                </Link>
                <Link to="/uploads" className="dropdown-item">
                  <span className="dropdown-icon">📤</span>
                  업로드 내역
                </Link>
                <Link to="/purchases" className="dropdown-item">
                  <span className="dropdown-icon">🛍️</span>
                  구매 내역
                </Link>
                <div className="dropdown-divider" />
                <Link to="/settings" className="dropdown-item">
                  <span className="dropdown-icon">⚙️</span>
                  설정
                </Link>
                <button className="dropdown-item logout-btn">
                  <span className="dropdown-icon">🚪</span>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
