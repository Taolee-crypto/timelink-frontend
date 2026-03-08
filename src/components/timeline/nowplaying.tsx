import React, { useEffect, useState } from 'react';

interface NowPlayingProps {
  currentFile: any;
  progress: number;
  currentTime: number;
  duration: number;
}

export const NowPlaying: React.FC<NowPlayingProps> = ({
  currentFile,
  progress,
  currentTime,
  duration
}) => {
  const formatTime = (sec: number) => {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentFile) return null;

  return (
    <div className="now-playing-row" style={{
      background: 'linear-gradient(145deg, #1e1e2a, #15151f)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      marginBottom: '24px',
      border: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Now Playing</span>
        <span style={{ color: 'white' }} id="nowPlayingTitle">
          {currentFile.title} - {currentFile.artist}
        </span>
      </div>
      
      <div className="progress-bar" style={{
        width: '100%',
        height: '6px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-full)',
        margin: '12px 0',
        overflow: 'hidden'
      }}>
        <div
          className="progress-fill"
          style={{
            height: '100%',
            background: 'var(--success)',
            transition: 'width 0.2s',
            width: `${progress}%`
          }}
        ></div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span id="nowCurrent">{formatTime(currentTime)}</span>
        <span id="nowTotal">{formatTime(duration)}</span>
      </div>
    </div>
  );
};
