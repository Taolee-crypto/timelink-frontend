import { useState, useEffect, useCallback } from 'react';

export interface MusicFile {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  tlPerSec: number;
  genre: string;
  cover?: string;
  token?: {
    balance: number;
  };
  source?: string;
  metadata?: any;
}

export const useTimeLinkSystem = () => {
  const [user, setUser] = useState({
    trust: 1.0,
    lvs: 1.0,
    totalListened: 0
  });

  const [wallet, setWallet] = useState({
    available: 10000,
    locked: 0
  });

  const [carMode, setCarMode] = useState(false);
  const [currentFile, setCurrentFile] = useState<MusicFile | null>(null);
  const [files, setFiles] = useState<MusicFile[]>([]);
  const [autoRecharge] = useState({
    enabled: true,
    threshold: 2000,
    amount: 5000
  });

  // 샘플 음악 라이브러리
  const musicLibrary: MusicFile[] = [
    {
      id: 'm1',
      title: 'Midnight Vibe',
      artist: 'Synthwave',
      duration: 225,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      tlPerSec: 1,
      genre: 'pop',
      cover: '🎵'
    },
    {
      id: 'm2',
      title: 'Electric Dreams',
      artist: 'Neon',
      duration: 252,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      tlPerSec: 1,
      genre: 'electronic'
    },
    {
      id: 'm3',
      title: 'Sunset Flow',
      artist: 'Chill',
      duration: 200,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      tlPerSec: 1,
      genre: 'chill'
    }
  ];

  useEffect(() => {
    // 초기 파일 로드
    const initialFiles = musicLibrary.map((f, i) => ({
      ...f,
      id: 'file' + i,
      token: { balance: i === 0 ? 5000 : 0 },
      source: 'timelink'
    }));
    setFiles(initialFiles);

    // Locked TL 해제 (10초마다 10 TL)
    const interval = setInterval(() => {
      setWallet(prev => {
        if (prev.locked > 0) {
          const release = Math.min(10, prev.locked);
          return {
            available: prev.available + release,
            locked: prev.locked - release
          };
        }
        return prev;
      });
    }, 10000);

    // Trust/LVS 랜덤 변동
    const trustInterval = setInterval(() => {
      setUser(prev => ({
        trust: Math.min(1.2, Math.max(0.8, prev.trust + (Math.random() - 0.5) * 0.1)),
        lvs: Math.min(1.0, Math.max(0.5, prev.lvs + (Math.random() - 0.5) * 0.1)),
        totalListened: prev.totalListened
      }));
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(trustInterval);
    };
  }, []);

  const playFile = useCallback((file: MusicFile) => {
    setCurrentFile(file);
    // 실제 오디오 재생 로직은 별도 구현
  }, []);

  const stopPlay = useCallback(() => {
    setCurrentFile(null);
  }, []);

  const toggleCarMode = useCallback(() => {
    setCarMode(prev => !prev);
  }, []);

  const addSunoFile = useCallback((songData: any) => {
    const newFile: MusicFile = {
      id: 'tl3_' + Date.now(),
      title: songData.title,
      artist: songData.artist,
      duration: songData.duration,
      url: songData.url,
      tlPerSec: 1,
      genre: songData.genre,
      cover: songData.cover,
      token: { balance: 1000 },
      source: 'suno',
      metadata: {
        verifiedAt: new Date().toISOString(),
        license: 'Commercial Use Granted'
      }
    };
    
    setFiles(prev => [...prev, newFile]);
    return newFile;
  }, []);

  const charge = useCallback((amount: number) => {
    setWallet(prev => ({
      ...prev,
      available: prev.available + amount
    }));
  }, []);

  return {
    user,
    wallet,
    carMode,
    currentFile,
    files,
    autoRecharge,
    musicLibrary,
    playFile,
    stopPlay,
    toggleCarMode,
    addSunoFile,
    charge
  };
};
