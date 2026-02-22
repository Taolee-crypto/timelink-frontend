import React, { useState } from 'react';

interface ChargeModalProps {
    onClose: () => void;
    onCharge: (amount: number) => void;
    currentBalance: number;
    targetFileId?: string;
}

export const ChargeModal: React.FC<ChargeModalProps> = ({
    onClose,
    onCharge,
    currentBalance,
    targetFileId
}) => {
    const [amount, setAmount] = useState(1000);

    const handleCharge = () => {
        onCharge(amount);
        onClose();
    };

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #b983ff, #8a2be2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    💰 Charge TL
                </h2>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                        fontSize: '13px',
                        textTransform: 'uppercase'
                    }}>TL Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                        placeholder="1000"
                        min="100"
                        step="100"
                        style={{
                            width: '100%',
                            padding: '14px 18px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '15px',
                            color: 'white'
                        }}
                    />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '12px' }}>
                        Your balance: <strong style={{ color: 'white' }}>{currentBalance.toLocaleString()}</strong> TL
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        className="btn-play"
                        onClick={handleCharge}
                        style={{
                            flex: 1,
                            background: 'var(--accent)',
                            padding: '14px',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        ⚡ Charge
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
