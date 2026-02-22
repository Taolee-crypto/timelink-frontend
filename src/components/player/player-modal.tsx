import React, { useEffect } from 'react';
import { TLFile } from '@/types/timelink.types';

interface PlayerModalProps {
    file: TLFile | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    walletTl: number;
    carMode: boolean;
    onTogglePlayPause: () => void;
    onStop: () => void;
    onCharge: () => void;
    onAutoRechargeToggle: (enabled: boolean) => void;
    autoRechargeEnabled: boolean;
    autoRechargeThreshold: number;
    autoRechargeAmount: number;
    onAutoRechargeChange: (threshold: number, amount: number) => void;
    formatTime: (seconds: number) => string;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
    file,
    isPlaying,
    currentTime,
    duration,
    walletTl,
    carMode,
    onTogglePlayPause,
    onStop,
    onCharge,
    onAutoRechargeToggle,
    autoRechargeEnabled,
    autoRechargeThreshold,
    autoRechargeAmount,
    onAutoRechargeChange,
    formatTime
}) => {
    if (!file) return null;

    const rate = file.tlPerSecond * (carMode ? 2 : 1);
    const progress = duration ? (currentTime / duration) * 100 : 0;
    const timeRemaining = Math.floor(file.token.balance / rate);

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-content player-content" style={{
                maxWidth: '700px',
                background: 'var(--bg-modal)',
                borderRadius: 'var(--radius-xl)',
                padding: '40px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
                animation: 'slideUp 0.4s ease',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div className="player-title" style={{
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '8px'
                }}>{file.metadata.title}</div>
                <div className="player-artist" style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    marginBottom: '24px'
                }}>{file.metadata.artist}</div>

                <div style={{ marginBottom: '16px' }}>
                    <span className="badge" style={{
                        background: 'var(--success)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px'
                    }}>{file.type}</span>
                    <span className="badge" style={{
                        background: 'var(--warning)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        marginLeft: '8px'
                    }}>{rate}TL/초</span>
                </div>

                {/* 저작권 패널 */}
                <div className="player-panel" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    borderLeft: '6px solid #8b5cf6'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 700, color: '#8b5cf6' }}>📋 Copyright</span>
                        <span style={{ background: '#8b5cf6', color: 'white', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '11px' }}>Blockchain</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><span style={{ color: 'var(--text-secondary)' }}>Owner</span><br /><strong>{file.metadata.copyright.owner_name}</strong></div>
                        <div><span style={{ color: 'var(--text-secondary)' }}>Reg. No.</span><br /><strong>{file.metadata.copyright.registration_number}</strong></div>
                    </div>
                </div>

                {/* 수익 분배 패널 */}
                <div className="player-panel" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    borderLeft: '6px solid var(--accent)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>📊 Revenue Share</span>
                        <span style={{ background: 'var(--accent)', color: 'white', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '11px' }}>
                            {file.metadata.contract.type === '55' ? '5:5 Contract' : '7:3 Contract'}
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><span style={{ color: 'var(--text-secondary)' }}>Creator</span><br /><strong>{file.metadata.contract.type === '55' ? '50%' : '70%'}</strong></div>
                        <div><span style={{ color: 'var(--text-secondary)' }}>Platform</span><br /><strong>{file.metadata.contract.type === '55' ? '50%' : '30%'}</strong></div>
                    </div>
                </div>

                {/* TL 잔액 패널 */}
                <div className="player-panel" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    borderLeft: '6px solid var(--warning)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--warning)' }}>⏳ TL Balance</span>
                        <span style={{ background: 'var(--warning)', color: 'black', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '11px' }}>1s = {rate}TL</span>
                    </div>
                    <div className="player-tl-amount" style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
                        {file.token.balance.toLocaleString()} TL
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>≈ {Math.floor(timeRemaining / 60)}분 {timeRemaining % 60}초 남음</div>
                </div>

                {/* 진행 바 */}
                <div className="player-progress" style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    margin: '24px 0'
                }}>
                    <div className="player-progress-fill" style={{
                        height: '100%',
                        background: 'var(--success)',
                        transition: 'width 0.2s linear',
                        width: `${progress}%`
                    }}></div>
                </div>

                {/* 시간 표시 */}
                <div className="player-time" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: 'var(--text-tertiary)',
                    fontSize: '13px',
                    marginBottom: '24px'
                }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                {/* 자동 충전 설정 */}
                <div className="player-panel" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    borderLeft: '6px solid var(--success)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--success)' }}>⚡ Auto-Recharge</span>
                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input
                                type="checkbox"
                                checked={autoRechargeEnabled}
                                onChange={(e) => onAutoRechargeToggle(e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span className="slider" style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: autoRechargeEnabled ? 'var(--success)' : '#ccc',
                                transition: '.4s',
                                borderRadius: '34px'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    content: '""',
                                    height: '20px',
                                    width: '20px',
                                    left: autoRechargeEnabled ? '28px' : '2px',
                                    bottom: '2px',
                                    backgroundColor: 'white',
                                    transition: '.4s',
                                    borderRadius: '50%'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    <div style={{ opacity: autoRechargeEnabled ? 1 : 0.5 }}>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Threshold (TL)</label>
                                <select
                                    value={autoRechargeThreshold}
                                    onChange={(e) => onAutoRechargeChange(parseInt(e.target.value), autoRechargeAmount)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'white'
                                    }}
                                >
                                    <option value="60">60 TL (1 min)</option>
                                    <option value="300">300 TL (5 min)</option>
                                    <option value="600">600 TL (10 min)</option>
                                    <option value="1800">1,800 TL (30 min)</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Amount (TL)</label>
                                <select
                                    value={autoRechargeAmount}
                                    onChange={(e) => onAutoRechargeChange(autoRechargeThreshold, parseInt(e.target.value))}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'white'
                                    }}
                                >
                                    <option value="600">600 TL (10 min)</option>
                                    <option value="1800">1,800 TL (30 min)</option>
                                    <option value="3600">3,600 TL (1 hour)</option>
                                    <option value="10800">10,800 TL (3 hours)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Wallet: </span>
                            <strong style={{ color: 'white' }}>{walletTl.toLocaleString()} TL</strong>
                        </div>
                    </div>
                </div>

                {/* 컨트롤 버튼 */}
                <div className="player-controls" style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    marginTop: '16px'
                }}>
                    <button
                        className="btn-play"
                        onClick={onTogglePlayPause}
                        style={{
                            flex: 1,
                            background: 'var(--success)',
                            padding: '14px 10px',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            fontSize: '14px',
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                    </button>
                    <button
                        className="btn-play"
                        onClick={onStop}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            padding: '14px 10px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            fontSize: '14px',
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        ⏹️ Stop
                    </button>
                    <button
                        className="btn-play"
                        onClick={onCharge}
                        style={{
                            flex: 1,
                            background: 'var(--warning)',
                            color: 'black',
                            padding: '14px 10px',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        💰 Charge
                    </button>
                </div>
            </div>
        </div>
    );
};
