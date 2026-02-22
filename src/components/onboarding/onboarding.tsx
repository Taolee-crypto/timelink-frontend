import React, { useState } from 'react';
import styles from './onboarding.module.css';

interface OnboardingProps {
    onComplete: () => void;
    onSkip: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip }) => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const totalSlides = 4;

    const goToSlide = (slide: number) => {
        setCurrentSlide(slide);
    };

    const nextSlide = () => {
        if (currentSlide < totalSlides) {
            setCurrentSlide(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 1) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    return (
        <div className="onboarding-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 100000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeIn 0.5s ease'
        }}>
            <div className="onboarding-popup" style={{
                background: 'var(--bg-modal)',
                borderRadius: 'var(--radius-xl)',
                maxWidth: '900px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
                animation: 'slideUp 0.5s ease'
            }}>
                <div className="onboarding-header" style={{
                    padding: '40px 40px 20px',
                    textAlign: 'center',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <div className="onboarding-logo" style={{
                        fontSize: '5rem',
                        marginBottom: '20px',
                        animation: 'pulse 2s infinite'
                    }}>⏰🎵</div>
                    <h1 className="onboarding-title" style={{
                        fontSize: '2.8rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #b983ff, #8a2be2, #1db954, #00a8ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '16px'
                    }}>TimeLink Global</h1>
                    <p className="onboarding-subtitle" style={{
                        fontSize: '1.3rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}>시간을 저축하고 소비하는 음악 경제 플랫폼</p>
                </div>

                <div className="onboarding-content" style={{ padding: '40px' }}>
                    {/* 슬라이드 1: 핵심 가치 */}
                    {currentSlide === 1 && (
                        <div className="onboarding-section">
                            <div className="section-title" style={{
                                fontSize: '1.8rem',
                                fontWeight: 700,
                                marginBottom: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'linear-gradient(135deg, #fff, #e0e0e0)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>🎯 한 마디로 정의하면?</div>

                            <div className="quote-box" style={{
                                background: 'linear-gradient(145deg, #1e1e2a, #15151f)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '40px',
                                margin: '30px 0',
                                borderLeft: '6px solid var(--accent)',
                                textAlign: 'center'
                            }}>
                                <div className="quote-text" style={{
                                    fontSize: '2rem',
                                    fontStyle: 'italic',
                                    color: 'white',
                                    marginBottom: '20px',
                                    lineHeight: 1.4
                                }}>"1초 듣기 = 1TL 소모, 창작자에게 공정한 수익, 운전하면 2배 보상"</div>
                                <div className="quote-sub" style={{
                                    fontSize: '1.3rem',
                                    color: 'var(--text-secondary)'
                                }}>- TimeLink 핵심 가치</div>
                            </div>

                            <div className="feature-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '24px',
                                marginBottom: '30px'
                            }}>
                                <div className="feature-card" style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '28px',
                                    border: '1px solid var(--border-color)',
                                    transition: 'var(--transition)'
                                }}>
                                    <div className="feature-icon" style={{ fontSize: '3rem', marginBottom: '20px' }}>⏰</div>
                                    <div className="feature-title" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'white' }}>시간 기반 경제</div>
                                    <div className="feature-desc" style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>1초 = 1TL (Time Token). 듣는 만큼 TL 소모, 창작자는 듣는 만큼 수익을 얻습니다.</div>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">💰</div>
                                    <div className="feature-title">공정한 수익 분배</div>
                                    <div className="feature-desc">5:5 계약: Spotify의 1.8배, 7:3 계약: Spotify의 2.5배 높은 수익을 창작자에게 돌려드립니다.</div>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">🚗</div>
                                    <div className="feature-title">스마트 보상 시스템</div>
                                    <div className="feature-desc">운전 시 2배 보상 (자동 감지), 광고 시청으로 TL 벌기, 차량 등록 시 추가 혜택</div>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">🤖</div>
                                    <div className="feature-title">AI 기반 최적화</div>
                                    <div className="feature-desc">실시간 기여도 지수로 채굴 최대 5배, 장르별 연속 재생, 피크/오프피크 자동 분석</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 슬라이드 2: 경제 시스템 */}
                    {currentSlide === 2 && (
                        <div className="onboarding-section">
                            <div className="section-title">💹 TimeLink 경제 시스템</div>

                            <div className="economy-table" style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                margin: '30px 0'
                            }}>
                                <div className="economy-row" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '18px 28px',
                                    borderBottom: '1px solid var(--border-color)'
                                }}>
                                    <div className="economy-label"><span style={{ fontSize: '1.5rem' }}>🎵</span> 1초 재생 (TL3)</div>
                                    <div className="economy-value" style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1.2rem' }}>1 TL 소모</div>
                                </div>
                                <div className="economy-row">
                                    <div className="economy-label"><span style={{ fontSize: '1.5rem' }}>🎬</span> 1초 재생 (TL4)</div>
                                    <div className="economy-value">2 TL 소모</div>
                                </div>
                                <div className="economy-row">
                                    <div className="economy-label"><span style={{ fontSize: '1.5rem' }}>💰</span> 1 TL 가격</div>
                                    <div className="economy-value">0.1원 (10 TL = 1원)</div>
                                </div>
                                <div className="economy-row">
                                    <div className="economy-label"><span style={{ fontSize: '1.5rem' }}>⏱️</span> 1시간 청취</div>
                                    <div className="economy-value">3,600 TL = 360원</div>
                                </div>
                                <div className="economy-row">
                                    <div className="economy-label"><span style={{ fontSize: '1.5rem' }}>📺</span> 30초 광고 시청</div>
                                    <div className="economy-value highlight" style={{ color: 'var(--car)', fontSize: '1.4rem' }}>+30~60 TL</div>
                                </div>
                                <div className="economy-row">
                                    <div className="economy-label"><span style={{ fontSize: '1.5rem' }}>🚗</span> 운전 시 1분 청취</div>
                                    <div className="economy-value highlight">+6 TL (2배 보상)</div>
                                </div>
                            </div>

                            <div className="comparison-box" style={{
                                display: 'flex',
                                gap: '24px',
                                margin: '30px 0'
                            }}>
                                <div className="comparison-item" style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '28px',
                                    borderRadius: 'var(--radius-lg)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '2rem' }}>🎵 5:5 계약</div>
                                    <div className="comparison-value" style={{ fontSize: '2.5rem', fontWeight: 800, margin: '15px 0' }}>9.00 TL</div>
                                    <div className="spotify-badge" style={{
                                        background: 'var(--success)',
                                        color: 'white',
                                        padding: '6px 16px',
                                        borderRadius: 'var(--radius-full)',
                                        display: 'inline-block',
                                        fontSize: '0.9rem'
                                    }}>Spotify의 1.8배</div>
                                    <div style={{ marginTop: '15px', color: 'var(--text-secondary)' }}>3분 곡 기준</div>
                                </div>
                                <div className="comparison-item">
                                    <div style={{ fontSize: '2rem' }}>🎵 7:3 계약</div>
                                    <div className="comparison-value">12.60 TL</div>
                                    <div className="spotify-badge">Spotify의 2.5배</div>
                                    <div style={{ marginTop: '15px', color: 'var(--text-secondary)' }}>3분 곡 기준</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 슬라이드 3: 주요 기능 */}
                    {currentSlide === 3 && (
                        <div className="onboarding-section">
                            <div className="section-title">⚡ TimeLink 주요 기능</div>

                            <div className="functions-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '20px',
                                margin: '30px 0'
                            }}>
                                <div className="function-item" style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '24px',
                                    borderRadius: 'var(--radius-lg)',
                                    textAlign: 'center',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div className="function-icon" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎵</div>
                                    <div className="function-name" style={{ fontWeight: 700, marginBottom: '8px' }}>TL3 Audio</div>
                                    <div className="function-desc" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>MP3, WAV, FLAC<br />1초 = 1TL</div>
                                </div>
                                <div className="function-item">
                                    <div className="function-icon">🎬</div>
                                    <div className="function-name">TL4 Video</div>
                                    <div className="function-desc">MP4, MOV, AVI<br />1초 = 2TL</div>
                                </div>
                                <div className="function-item">
                                    <div className="function-icon">🔄</div>
                                    <div className="function-name">Share Place</div>
                                    <div className="function-desc">모든 공유 곡 모음<br />다운로드 가능</div>
                                </div>
                                <div className="function-item">
                                    <div className="function-icon">📻</div>
                                    <div className="function-name">Radio</div>
                                    <div className="function-desc">24/7 스트리밍<br />0.5TL/초 평균</div>
                                </div>
                                <div className="function-item">
                                    <div className="function-icon">📺</div>
                                    <div className="function-name">Commercial</div>
                                    <div className="function-desc">소상공인 혜택<br />0.3TL/초</div>
                                </div>
                                <div className="function-item">
                                    <div className="function-icon">🚗</div>
                                    <div className="function-name">Car</div>
                                    <div className="function-desc">2배 보상<br />자동 감지 시스템</div>
                                </div>
                                <div className="function-item">
                                    <div className="function-icon">⛏️</div>
                                    <div className="function-name">Mining</div>
                                    <div className="function-desc">TLC 채굴<br />AI 지수 적용</div>
                                </div>
                                <div className="function-item">
                                    <div className="function-icon">📚</div>
                                    <div className="function-name">Lecture</div>
                                    <div className="function-desc">강의 마켓<br />창작자 70%</div>
                                </div>
                            </div>

                            <div className="section-title" style={{ fontSize: '1.5rem', marginTop: '40px' }}>🎤 장르별 음악 분류</div>
                            <div className="genre-badge-container" style={{
                                display: 'flex',
                                gap: '12px',
                                flexWrap: 'wrap',
                                margin: '20px 0'
                            }}>
                                <span className="genre-badge pop" style={{
                                    padding: '8px 20px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.95rem',
                                    background: 'var(--genre-pop)',
                                    color: 'white'
                                }}>🎤 Pop</span>
                                <span className="genre-badge rock" style={{ background: 'var(--genre-rock)' }}>🎸 Rock</span>
                                <span className="genre-badge hiphop" style={{ background: 'var(--genre-hiphop)', color: 'black' }}>🎧 Hip-Hop</span>
                                <span className="genre-badge jazz" style={{ background: 'var(--genre-jazz)', color: 'black' }}>🎺 Jazz</span>
                                <span className="genre-badge classic" style={{ background: 'var(--genre-classic)' }}>🎻 Classic</span>
                                <span className="genre-badge edm" style={{ background: 'var(--genre-edm)' }}>💿 EDM</span>
                                <span className="genre-badge rnb" style={{ background: 'var(--genre-rnb)' }}>🎹 R&B</span>
                                <span className="genre-badge country" style={{ background: 'var(--genre-country)' }}>🤠 Country</span>
                            </div>
                        </div>
                    )}

                    {/* 슬라이드 4: 슬로건 및 비전 */}
                    {currentSlide === 4 && (
                        <div className="onboarding-section">
                            <div className="section-title">🌟 TimeLink의 약속</div>

                            <div className="quote-box" style={{ borderLeftColor: 'var(--car)' }}>
                                <div className="quote-text">"TimeLink - 당신의 청취가 자산이 되는 순간"</div>
                                <div className="quote-text" style={{ fontSize: '1.5rem', marginTop: '20px' }}>"Listen, Earn, and Own Your Time"</div>
                            </div>

                            <div style={{ textAlign: 'center', margin: '50px 0' }}>
                                <div style={{ fontSize: '6rem', marginBottom: '30px' }}>⏰ → 🎵 → 💰</div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>시간을 음악으로, 음악을 자산으로</p>
                            </div>

                            <div className="feature-grid">
                                <div className="feature-card">
                                    <div className="feature-icon">🎯</div>
                                    <div className="feature-title">비전</div>
                                    <div className="feature-desc">음악 스트리밍의 패러다임 전환. 단순한 소비가 아닌 경제 활동으로의 진화.</div>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">💎</div>
                                    <div className="feature-title">핵심 가치</div>
                                    <div className="feature-desc">1초의 가치를 창출하다. 모든 청취가 크리에이터와 플랫폼에 공정한 수익으로.</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="step-indicator" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                    margin: '30px 0 20px'
                }}>
                    {[1, 2, 3, 4].map(i => (
                        <span
                            key={i}
                            className={`step-dot ${currentSlide === i ? 'active' : ''}`}
                            onClick={() => goToSlide(i)}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: currentSlide === i ? 'var(--accent)' : 'var(--text-tertiary)',
                                cursor: 'pointer',
                                transition: 'var(--transition)',
                                transform: currentSlide === i ? 'scale(1.3)' : 'scale(1)',
                                boxShadow: currentSlide === i ? '0 0 20px var(--accent-glow)' : 'none'
                            }}
                        />
                    ))}
                </div>

                <div className="onboarding-footer" style={{
                    padding: '20px 40px 40px',
                    textAlign: 'center',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <button
                        className="btn-start"
                        onClick={nextSlide}
                        style={{
                            background: 'linear-gradient(135deg, var(--accent), var(--success))',
                            color: 'white',
                            border: 'none',
                            padding: '18px 60px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 700,
                            fontSize: '1.3rem',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            boxShadow: '0 8px 20px rgba(138, 43, 226, 0.3)'
                        }}
                    >
                        {currentSlide === 4 ? '🚀 TimeLink 시작하기' : '다음'}
                    </button>
                    <button
                        className="btn-skip"
                        onClick={onSkip}
                        style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-color)',
                            padding: '14px 40px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 600,
                            marginTop: '20px',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            fontSize: '1.1rem'
                        }}
                    >
                        {currentSlide === 4 ? '나중에 둘러보기' : '건너뛰기'}
                    </button>
                </div>
            </div>
        </div>
    );
};
