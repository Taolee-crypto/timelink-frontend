// src/pages/Home/Home.jsx
import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            TimeLink Studio
            <span className="title-highlight">⏰</span>
          </h1>
          <p className="hero-subtitle">
            시간 기반 동적 가중치 콘텐츠 경제 플랫폼
          </p>
          <p className="hero-description">
            음원과 영상을 TL3/TL4 포맷으로 변환하고,<br />
            인기에 따라 가중치가 적용된 새로운 콘텐츠 경제를 경험하세요.
          </p>
          <div className="hero-buttons">
            <Link to="/studio" className="btn btn-primary">
              스튜디오 시작하기
            </Link>
            <Link to="/watch" className="btn btn-secondary">
              콘텐츠 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* 특허 설명 */}
      <section className="patent-section">
        <div className="container">
          <h2 className="section-title">
            <span className="icon">💡</span>
            특허 아이디어
          </h2>
          <div className="patent-grid">
            <div className="patent-card">
              <div className="patent-icon">⏰</div>
              <h3>시간 기반 과금</h3>
              <p>콘텐츠 길이에 따라 기본 가격 결정</p>
            </div>
            <div className="patent-card">
              <div className="patent-icon">📈</div>
              <h3>인기 가중치</h3>
              <p>재생률, 좋아요, 공유에 따라 동적 가중치 적용</p>
            </div>
            <div className="patent-card">
              <div className="patent-icon">🤝</div>
              <h3>자동 수익 분배</h3>
              <p>35-35-30 고정분배 + AI 기여도 분석</p>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">
            <span className="icon">🚀</span>
            주요 기능
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>TL3/TL4 변환</h3>
              <p>오디오(TL3)와 비디오(TL4)를 암호화된 포맷으로 변환</p>
              <ul>
                <li>CRYSTALS-Dilithium 암호화</li>
                <li>저작권 정보 내장</li>
                <li>실시간 재생 제어</li>
              </ul>
            </div>
            <div className="feature-card">
              <h3>콘텐츠 마켓</h3>
              <p>음악과 영상을 조합하여 새로운 콘텐츠 창작</p>
              <ul>
                <li>웹 기반 편집기</li>
                <li>실시간 미리보기</li>
                <li>자동 싱크 맞춤</li>
              </ul>
            </div>
            <div className="feature-card">
              <h3>수익 시스템</h3>
              <p>공정한 수익 분배와 투명한 정산</p>
              <ul>
                <li>35-35-30 분배 모델</li>
                <li>실시간 정산 대시보드</li>
                <li>TL(TimeLink) 토큰 경제</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">지금 바로 시작하세요</h2>
          <p className="cta-description">
            무료로 콘텐츠를 변환하고, TL 경제에 참여하세요.
          </p>
          <Link to="/studio" className="btn btn-large btn-primary">
            무료 회원가입
          </Link>
          <p className="cta-note">
            회원가입 후 즉시 100 TL 보너스 지급!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span>⏰</span> TimeLink Studio
            </div>
            <div className="footer-links">
              <Link to="/about">소개</Link>
              <Link to="/terms">이용약관</Link>
              <Link to="/privacy">개인정보처리방침</Link>
              <Link to="/contact">문의</Link>
            </div>
            <div className="footer-copyright">
              © 2024 TimeLink. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
