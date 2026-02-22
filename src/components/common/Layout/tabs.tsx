import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="tabs-container" style={{
      position: 'sticky',
      top: '100px',
      zIndex: 90,
      marginBottom: '32px',
      background: 'rgba(17, 17, 17, 0.7)',
      backdropFilter: 'blur(20px)',
      borderRadius: 'var(--radius-full)',
      padding: '6px',
      border: '1px solid var(--border-color)',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      display: 'flex'
    }}>
      <div className="tabs" style={{ display: 'flex', gap: '4px', width: '100%' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '14px',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              transition: 'var(--transition)',
              cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              border: 'none',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(138, 43, 226, 0.4)' : 'none'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
