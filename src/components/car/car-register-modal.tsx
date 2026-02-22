import React, { useState } from 'react';

interface CarRegisterModalProps {
    onClose: () => void;
    onRegister: (model: string, plate: string) => void;
    currentTl: number;
}

export const CarRegisterModal: React.FC<CarRegisterModalProps> = ({
    onClose,
    onRegister,
    currentTl
}) => {
    const [model, setModel] = useState('');
    const [plate, setPlate] = useState('');

    const handleRegister = () => {
        if (!model || !plate) return;
        onRegister(model, plate);
    };

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #00a8ff, #0097e6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    🚗 Register Car
                </h2>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '13px'
                    }}>Car Model</label>
                    <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="Tesla Model 3"
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'white'
                        }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label>License Plate</label>
                    <input
                        type="text"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        placeholder="ABC123"
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'white'
                        }}
                    />
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Registration fee: <strong>10,000 TL</strong> (one-time)
                    <br />
                    <span style={{ color: currentTl >= 10000 ? 'var(--success)' : 'var(--danger)' }}>
                        Your balance: {currentTl.toLocaleString()} TL
                    </span>
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        className="btn-play"
                        onClick={handleRegister}
                        disabled={!model || !plate || currentTl < 10000}
                        style={{
                            flex: 1,
                            background: 'var(--car)',
                            padding: '14px',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            cursor: currentTl >= 10000 ? 'pointer' : 'not-allowed',
                            color: 'white',
                            opacity: currentTl >= 10000 ? 1 : 0.5
                        }}
                    >
                        🚗 Register
                    </button>
                    <button
                        className="btn-play"
                        onClick={onClose}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            padding: '14px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
