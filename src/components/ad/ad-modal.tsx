import React, { useState, useRef, useEffect } from 'react';

interface AdModalProps {
    onClose: () => void;
    onWatchAd: (type: 'video' | 'audio') => boolean;
    dailyRemaining: number;
}

export const AdModal: React.FC<AdModalProps> = ({ onClose, onWatchAd, dailyRemaining }) => {
    const [step, setStep] = useState<'initial' | 'select' | 'watching'>('initial');
    const [adType, setAdType] = useState<'video' | 'audio'>('video');
    const [timer, setTimer] = useState(30);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const reward = adType === 'video' ? 60 : 30;

    const selectType = (type: 'video' | 'audio') => {
        setAdType(type);
        setStep('watching');
    };

    const startWatching = () => {
        if (dailyRemaining <= 0) return;

        setTimer(30);
        setProgress(0);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer(prev => {
                const newTime = prev - 1;
                setProgress(((30 - newTime) / 30) * 100);
                
                if (newTime <= 0) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    const success = onWatchAd(adType);
                    if (success) {
                        onClose();
                    }
                    return 0;
                }
                return newTime;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-content" style={{ textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    📺 Watch Ad & Earn TL
                </h2>

                {step === 'initial' && (
                    <div id="adInitialSection">
                        <div style={{
                            background: 'rgba(255,215,0,0.1)',
                            padding: '24px',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '24px'
                        }}>
                            <p>🎯 광고를 시청하고 TL을 받으세요!</p>
                            <p style={{ fontSize: '14px', marginTop: '12px' }}>• 비디오 광고: 30초 시청 = 60 TL</p>
                            <p style={{ fontSize: '14px' }}>• 오디오 광고: 30초 청취 = 30 TL</p>
                            <p style={{ fontSize: '14px' }}>• 일일 최대: 600 TL (남은 보상: {dailyRemaining} TL)</p>
                        </div>
                        <button
                            className="btn-play"
                            onClick={() => setStep('select')}
                            style={{
                                width: '100%',
                                background: 'var(--ad)',
                                color: 'black',
                                padding: '16px',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            📺 Select Ad Type
                        </button>
                    </div>
                )}

                {step === 'select' && (
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div
                            className="file-type-card"
                            onClick={() => selectType('video')}
                            style={{
                                flex: 1,
                                background: 'rgba(255,215,0,0.1)',
                                padding: '24px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📹</div>
                            <h3>Video Ad</h3>
                            <div style={{ color: 'var(--ad)', fontSize: '1.2rem', fontWeight: 700 }}>30초 = 60 TL</div>
                        </div>
                        <div
                            className="file-type-card"
                            onClick={() => selectType('audio')}
                            style={{
                                flex: 1,
                                background: 'rgba(255,215,0,0.1)',
                                padding: '24px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎵</div>
                            <h3>Audio Ad</h3>
                            <div style={{ color: 'var(--ad)', fontSize: '1.2rem', fontWeight: 700 }}>30초 = 30 TL</div>
                        </div>
                    </div>
                )}

                {step === 'watching' && (
                    <div>
                        <div style={{
                            background: 'linear-gradient(145deg, #ffd700, #ffaa00)',
                            padding: '40px',
                            borderRadius: 'var(--radius-lg)',
                            margin: '20px 0'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{adType === 'video' ? '📹' : '🎵'}</div>
                            <div className="ad-timer" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ad)' }}>{timer}</div>
                            <div className="ad-progress" style={{
                                width: '100%',
                                height: '8px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: 'var(--radius-full)',
                                overflow: 'hidden',
                                margin: '16px 0'
                            }}>
                                <div className="ad-progress-fill" style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, var(--ad), #ffaa00)',
                                    transition: 'width 0.2s linear',
                                    width: `${progress}%`
                                }}></div>
                            </div>
                        </div>

                        <button
                            className="btn-play"
                            onClick={startWatching}
                            style={{
                                width: '100%',
                                background: 'var(--ad)',
                                color: 'black',
                                padding: '16px',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                marginBottom: '12px'
                            }}
                        >
                            ▶️ Start Watching
                        </button>
                    </div>
                )}

                <button
                    className="btn-play"
                    onClick={onClose}
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        cursor: 'pointer',
                        marginTop: '12px'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
