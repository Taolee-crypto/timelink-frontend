import React from 'react';
import { TLFile, GENRE_EMOJI } from '@/types/timelink.types';

interface FileCardProps {
    file: TLFile;
    onPlay: (fileId: string) => void;
    onCharge: (fileId: string) => void;
    onShare?: (fileId: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onPlay, onCharge, onShare }) => {
    const hasTL = file.token.balance > 0;

    return (
        <div className="file-card" style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            transition: 'var(--transition)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div className={`file-thumbnail ${file.fileType}`} style={{
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                color: 'rgba(255, 255, 255, 0.8)',
                position: 'relative',
                background: file.type === 'TL4'
                    ? 'linear-gradient(145deg, #ff7b00, #ff5500)'
                    : 'linear-gradient(145deg, #2a1a3a, #1e1e1e)'
            }}>
                {file.type === 'TL4' ? '🎬' : '🎵'}
                <span className="badge badge-type" style={{
                    position: 'absolute',
                    left: '16px',
                    top: '60px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 700
                }}>{file.type}</span>
                {!hasTL && (
                    <span className="badge badge-zero" style={{
                        position: 'absolute',
                        left: '16px',
                        top: '100px',
                        background: '#ff4444',
                        padding: '6px 16px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 700
                    }}>⚠️ TL 0</span>
                )}
            </div>

            <div className="file-info" style={{ padding: '24px' }}>
                <div className="file-name" style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                    color: 'white'
                }}>{file.metadata.title}</div>
                <div className="file-artist" style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    marginBottom: '20px'
                }}>{file.metadata.artist}</div>

                {/* 정보 패널 */}
                <div className={`info-panel ${!hasTL ? 'zero-panel' : 'tl-panel'}`} style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    borderLeft: !hasTL ? '4px solid #ff4444' : '4px solid var(--warning)'
                }}>
                    <strong>⏳ TL 잔액</strong><br />
                    <span style={{ fontSize: '1.4rem' }}>{file.token.balance.toLocaleString()}</span> TL
                </div>

                {/* 계약 정보 */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)'
                }}>
                    계약: {file.metadata.contract.type === '55' ? '5:5' : '7:3'} · 채굴 {file.metadata.contract.mining_allowed ? '가능' : '불가'}
                </div>

                {/* 액션 버튼 */}
                <div className="file-actions" style={{
                    display: 'grid',
                    gridTemplateColumns: onShare ? '1fr 1fr' : '1fr',
                    gap: '12px',
                    marginTop: '20px'
                }}>
                    {hasTL ? (
                        <button
                            className="btn-play"
                            onClick={() => onPlay(file.id)}
                            style={{
                                background: 'var(--success)',
                                padding: '14px',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: 'pointer',
                                color: 'white'
                            }}
                        >
                            ▶️ 재생
                        </button>
                    ) : (
                        <button
                            className="btn-play-disabled"
                            disabled
                            style={{
                                background: '#333',
                                color: '#999',
                                padding: '14px',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: 'not-allowed',
                                opacity: 0.7
                            }}
                        >
                            ⛔ TL 없음
                        </button>
                    )}
                    <button
                        className="btn-charge"
                        onClick={() => onCharge(file.id)}
                        style={{
                            background: 'var(--warning)',
                            color: 'black',
                            padding: '14px',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        💰 충전
                    </button>
                    {onShare && (
                        <button
                            className="btn-share"
                            onClick={() => onShare(file.id)}
                            style={{
                                background: 'var(--share)',
                                color: 'white',
                                padding: '14px',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: 'pointer',
                                gridColumn: 'span 2'
                            }}
                        >
                            🔗 공유
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
