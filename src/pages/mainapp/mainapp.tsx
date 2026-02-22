import React, { useState } from 'react';
import { Header } from '@/components/common/Layout/Header';
import { Tabs } from '@/components/common/Layout/Tabs';
import { SunoConverter } from '@/components/suno/SunoConverter';
import { NowPlaying } from '@/components/timeline/NowPlaying';
import { useTimeLinkSystem } from '@/hooks/useTimeLinkSystem';
import { Dashboard } from './Dashboard';
import { CreateTab } from './CreateTab';
import { LibraryTab } from './LibraryTab';
import { SharePlaceTab } from './SharePlaceTab';
import { RadioTab } from './RadioTab';
import { CarTab } from './CarTab';

interface MainAppProps {
  onLogout: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [chargeAmount, setChargeAmount] = useState(1000);
  
  const {
    user,
    wallet,
    carMode,
    currentFile,
    files,
    playFile,
    stopPlay,
    toggleCarMode,
    addSunoFile,
    charge
  } = useTimeLinkSystem();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'create', label: 'Create', icon: '📤' },
    { id: 'library', label: 'My Files', icon: '🎵' },
    { id: 'shareplace', label: 'Share Place', icon: '🔄' },
    { id: 'radio', label: 'Radio', icon: '📻' },
    { id: 'car', label: 'Car', icon: '🚗' }
  ];

  const handleCharge = () => {
    charge(chargeAmount);
    setShowChargeModal(false);
  };

  return (
    <div className="app-container" style={{
      maxWidth: '1600px',
      margin: '0 auto',
      padding: '24px 32px',
      animation: 'fadeIn 0.4s ease'
    }}>
      {/* Header */}
      <Header
        user={null}
        wallet={wallet}
        onLogout={onLogout}
        onChargeClick={() => setShowChargeModal(true)}
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <Dashboard
          currentFile={currentFile}
          user={user}
          carMode={carMode}
          onToggleCarMode={toggleCarMode}
        />
      )}

      {activeTab === 'create' && (
        <CreateTab onSunoConvert={addSunoFile} />
      )}

      {activeTab === 'library' && (
        <LibraryTab files={files} onPlay={playFile} />
      )}

      {activeTab === 'shareplace' && (
        <SharePlaceTab />
      )}

      {activeTab === 'radio' && <RadioTab />}
      {activeTab === 'car' && <CarTab carMode={carMode} onToggleCarMode={toggleCarMode} />}

      {/* Charge Modal */}
      {showChargeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#1e1e1e',
            padding: '32px',
            borderRadius: '20px',
            width: '400px'
          }}>
            <h3 style={{ marginBottom: '20px' }}>💰 TL 충전</h3>
            <input
              type="number"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(parseInt(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#333',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                marginBottom: '20px'
              }}
            />
            <button
              onClick={handleCharge}
              className="btn-play"
              style={{
                background: 'var(--success)',
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%'
              }}
            >
              충전하기
            </button>
            <button
              onClick={() => setShowChargeModal(false)}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
