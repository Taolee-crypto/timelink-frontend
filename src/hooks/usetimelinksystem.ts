import { useState, useEffect, useCallback, useRef } from 'react';
import { TLFile, MusicDBItem, Wallet, AutoRechargeSettings, User, Genre, GENRES } from '@/types/timelink.types';

// 샘플 음악 데이터
const MUSIC_DB: MusicDBItem[] = [
    { title: 'Dynamite', artist: 'BTS', genre: 'pop', duration: 210, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'Butter', artist: 'BTS', genre: 'pop', duration: 200, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'rock', duration: 355, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { title: 'Stairway to Heaven', artist: 'Led Zeppelin', genre: 'rock', duration: 480, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { title: 'Savage', artist: 'aespa', genre: 'hiphop', duration: 210, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { title: 'Fly Me To The Moon', artist: 'Frank Sinatra', genre: 'jazz', duration: 150, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { title: 'Fur Elise', artist: 'Beethoven', genre: 'classic', duration: 180, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { title: 'Strobe', artist: 'deadmau5', genre: 'edm', duration: 600, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { title: 'Blame It', artist: 'Jamie Foxx', genre: 'rnb', duration: 240, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
    { title: 'Jolene', artist: 'Dolly Parton', genre: 'country', duration: 150, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' }
];

// TL3/TL4 파일 클래스
export class TL3File implements TLFile {
    id: string;
    type: 'TL3' = 'TL3';
    fileType: 'audio' = 'audio';
    tlPerSecond = 1;
    metadata: {
        title: string;
        artist: string;
        genre: Genre;
        copyright: { owner_name: string; registration_number: string; };
        contract: { type: '55' | '73'; mining_allowed: boolean; };
    };
    token: { balance: number; total_charged: number; total_consumed: number; };
    audio: { url: string; };
    creatorId: string;
    creatorName: string;
    isShared = false;
    sharedAt: string | null = null;
    createdAt: string;

    constructor(data: any) {
        this.id = 'tl3_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
        this.metadata = {
            title: data.title,
            artist: data.artist,
            genre: data.genre || 'pop',
            copyright: data.copyright,
            contract: data.contract
        };
        this.token = {
            balance: data.initialBalance || 0,
            total_charged: data.initialBalance || 0,
            total_consumed: 0
        };
        this.audio = { url: data.audioUrl };
        this.creatorId = data.creatorId;
        this.creatorName = data.creatorName;
        this.createdAt = new Date().toISOString();
    }
}

export class TL4File extends TL3File implements TLFile {
    type: 'TL4' = 'TL4';
    fileType: 'video' = 'video';
    tlPerSecond = 2;

    constructor(data: any) {
        super(data);
        this.type = 'TL4';
        this.fileType = 'video';
        this.tlPerSecond = 2;
    }
}

export const useTimeLinkSystem = () => {
    const [files, setFiles] = useState<TLFile[]>([]);
    const [wallet, setWallet] = useState<Wallet>({ tl: 25000, tlc: 1250.75 });
    const [user] = useState<User>({ name: 'Global Investor', avatar: 'G', status: '🏢 Business' });
    const [carMode, setCarMode] = useState(false);
    const [autoRecharge, setAutoRecharge] = useState<AutoRechargeSettings>({
        enabled: false,
        threshold: 300,
        amount: 3600
    });
    const [adDailyRemaining, setAdDailyRemaining] = useState(600);
    const [playingFile, setPlayingFile] = useState<TLFile | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const playerUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // 초기 샘플 파일 로드
    useEffect(() => {
        if (files.length === 0) {
            const newFiles: TLFile[] = [];
            MUSIC_DB.forEach((song, index) => {
                const file = new TL3File({
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    audioUrl: song.url,
                    creatorId: 'user_1',
                    creatorName: 'Global Investor',
                    copyright: { owner_name: song.artist, registration_number: `CR-${1234 + index}` },
                    contract: { type: index % 2 === 0 ? '55' : '73', mining_allowed: index % 2 === 0 },
                    initialBalance: index === 0 ? 5000 : 0
                });
                newFiles.push(file);
            });
            // 비디오 샘플
            const videoFile = new TL4File({
                title: 'Big Buck Bunny',
                artist: 'Blender Foundation',
                genre: 'pop',
                audioUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                creatorId: 'user_1',
                creatorName: 'Global Investor',
                copyright: { owner_name: 'Blender', registration_number: 'CR-1236' },
                contract: { type: '55', mining_allowed: true },
                initialBalance: 10000
            });
            newFiles.push(videoFile);
            setFiles(newFiles);
        }

        // 온보딩 체크
        const onboardingDone = localStorage.getItem('timelink_onboarding');
        if (!onboardingDone) {
            setTimeout(() => setShowOnboarding(true), 1000);
        }
    }, []);

    // 재생 정리
    const stopPlay = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        if (playerUpdateIntervalRef.current) clearInterval(playerUpdateIntervalRef.current);
        setPlayingFile(null);
        setIsPlaying(false);
        setCurrentTime(0);
    }, []);

    // 파일 재생
    const playFile = useCallback((fileId: string) => {
        const file = files.find(f => f.id === fileId);
        if (!file) return;
        if (file.token.balance <= 0) {
            // TL 부족 토스트
            return;
        }

        stopPlay();
        setPlayingFile(file);
        
        const rate = file.tlPerSecond * (carMode ? 2 : 1);
        const player = file.type === 'TL4' ? videoRef.current : audioRef.current;
        if (!player) return;

        player.src = file.audio.url;
        player.play().catch(e => console.error('Play error:', e));
        setIsPlaying(true);

        // 재생 종료 핸들러
        player.onended = () => stopPlay();

        // 메타데이터 로드시 duration 설정
        player.onloadedmetadata = () => {
            setDuration(player.duration);
        };

        // 시간 업데이트
        player.ontimeupdate = () => {
            setCurrentTime(player.currentTime);
        };

        // TL 차감 인터벌
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        playIntervalRef.current = setInterval(() => {
            if (!playingFile || !player || player.paused) return;

            setFiles(prevFiles => {
                return prevFiles.map(f => {
                    if (f.id === fileId) {
                        const newBalance = f.token.balance - rate;
                        if (newBalance <= 0) {
                            stopPlay();
                            // 토스트 표시
                        }
                        return {
                            ...f,
                            token: {
                                ...f.token,
                                balance: Math.max(0, newBalance),
                                total_consumed: f.token.total_consumed + rate
                            }
                        };
                    }
                    return f;
                });
            });

            // 자동 충전 체크
            autoRechargeCheck(fileId);
        }, 1000);

        // 모달 업데이트 인터벌
        if (file.type !== 'TL4') {
            if (playerUpdateIntervalRef.current) clearInterval(playerUpdateIntervalRef.current);
            playerUpdateIntervalRef.current = setInterval(() => {
                // 모달 업데이트 (별도로 구현)
            }, 500);
        }
    }, [files, carMode, playingFile, stopPlay]);

    // 자동 충전 체크
    const autoRechargeCheck = useCallback((fileId: string) => {
        if (!autoRecharge.enabled) return;
        const file = files.find(f => f.id === fileId);
        if (!file) return;

        if (file.token.balance < autoRecharge.threshold) {
            const needed = autoRecharge.amount;
            if (wallet.tl >= needed) {
                setWallet(prev => ({ ...prev, tl: prev.tl - needed }));
                setFiles(prev => prev.map(f => {
                    if (f.id === fileId) {
                        return {
                            ...f,
                            token: {
                                ...f.token,
                                balance: f.token.balance + needed,
                                total_charged: f.token.total_charged + needed
                            }
                        };
                    }
                    return f;
                }));
                // 토스트 표시
            } else {
                // 잔액 부족 토스트
            }
        }
    }, [autoRecharge, files, wallet.tl]);

    // TL 충전
    const chargeWallet = useCallback((amount: number) => {
        setWallet(prev => ({ ...prev, tl: prev.tl + amount }));
    }, []);

    // 파일에 TL 충전
    const chargeFile = useCallback((fileId: string, amount: number) => {
        if (wallet.tl < amount) return false;
        
        setWallet(prev => ({ ...prev, tl: prev.tl - amount }));
        setFiles(prev => prev.map(f => {
            if (f.id === fileId) {
                return {
                    ...f,
                    token: {
                        ...f.token,
                        balance: f.token.balance + amount,
                        total_charged: f.token.total_charged + amount
                    }
                };
            }
            return f;
        }));
        return true;
    }, [wallet.tl]);

    // Car Mode 토글
    const toggleCarMode = useCallback(() => {
        setCarMode(prev => !prev);
    }, []);

    // 자동 충전 설정 업데이트
    const updateAutoRecharge = useCallback((settings: Partial<AutoRechargeSettings>) => {
        setAutoRecharge(prev => ({ ...prev, ...settings }));
    }, []);

    // 광고 시청
    const watchAd = useCallback((type: 'video' | 'audio') => {
        if (adDailyRemaining <= 0) return false;
        
        const reward = type === 'video' ? 60 : 30;
        setWallet(prev => ({ ...prev, tl: prev.tl + reward }));
        setAdDailyRemaining(prev => prev - reward);
        return true;
    }, [adDailyRemaining]);

    // 채굴
    const mine = useCallback(() => {
        const index = Math.random() * 5; // 0~5배
        const reward = index * 10;
        setWallet(prev => ({ ...prev, tlc: prev.tlc + reward }));
        return { reward, index };
    }, []);

    // 파일 공유
    const shareFile = useCallback((fileId: string) => {
        setFiles(prev => prev.map(f => {
            if (f.id === fileId) {
                return {
                    ...f,
                    isShared: true,
                    sharedAt: new Date().toISOString()
                };
            }
            return f;
        }));
    }, []);

    // 새 파일 생성
    const createFile = useCallback((fileData: any, type: 'audio' | 'video') => {
        const newFile = type === 'audio' 
            ? new TL3File(fileData)
            : new TL4File(fileData);
        setFiles(prev => [...prev, newFile]);
        return newFile;
    }, []);

    // 시간 포맷
    const formatTime = useCallback((seconds: number): string => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, []);

    // 온보딩 완료
    const completeOnboarding = useCallback(() => {
        setShowOnboarding(false);
        localStorage.setItem('timelink_onboarding', 'done');
    }, []);

    // 온보딩 스킵
    const skipOnboarding = useCallback(() => {
        setShowOnboarding(false);
        localStorage.setItem('timelink_onboarding', 'done');
    }, []);

    return {
        files,
        wallet,
        user,
        carMode,
        autoRecharge,
        adDailyRemaining,
        playingFile,
        isPlaying,
        currentTime,
        duration,
        activeTab,
        showOnboarding,
        audioRef,
        videoRef,
        musicDB: MUSIC_DB,
        setActiveTab,
        playFile,
        stopPlay,
        toggleCarMode,
        chargeWallet,
        chargeFile,
        updateAutoRecharge,
        watchAd,
        mine,
        shareFile,
        createFile,
        formatTime,
        completeOnboarding,
        skipOnboarding,
        togglePlayPause: useCallback(() => {
            const player = playingFile?.type === 'TL4' ? videoRef.current : audioRef.current;
            if (!player) return;
            if (player.paused) {
                player.play();
                setIsPlaying(true);
            } else {
                player.pause();
                setIsPlaying(false);
            }
        }, [playingFile])
    };
};
