// 음악 장르 타입
export type Genre = 'pop' | 'rock' | 'hiphop' | 'jazz' | 'classic' | 'edm' | 'rnb' | 'country';

export const GENRES: Genre[] = ['pop', 'rock', 'hiphop', 'jazz', 'classic', 'edm', 'rnb', 'country'];
export const GENRE_NAMES: Record<Genre, string> = {
    pop: 'Pop', rock: 'Rock', hiphop: 'Hip-Hop', jazz: 'Jazz',
    classic: 'Classic', edm: 'EDM', rnb: 'R&B', country: 'Country'
};
export const GENRE_EMOJI: Record<Genre, string> = {
    pop: '🎤', rock: '🎸', hiphop: '🎧', jazz: '🎺',
    classic: '🎻', edm: '💿', rnb: '🎹', country: '🤠'
};

// TL3/TL4 파일 인터페이스
export interface TLFile {
    id: string;
    type: 'TL3' | 'TL4';
    fileType: 'audio' | 'video';
    tlPerSecond: number;
    metadata: {
        title: string;
        artist: string;
        genre: Genre;
        copyright: {
            owner_name: string;
            registration_number: string;
        };
        contract: {
            type: '55' | '73';
            mining_allowed: boolean;
        };
    };
    token: {
        balance: number;
        total_charged: number;
        total_consumed: number;
    };
    audio: {
        url: string;
    };
    creatorId: string;
    creatorName: string;
    isShared: boolean;
    sharedAt: string | null;
    createdAt: string;
}

// 음악 데이터베이스 항목
export interface MusicDBItem {
    title: string;
    artist: string;
    genre: Genre;
    duration: number;
    url: string;
}

// 지갑 인터페이스
export interface Wallet {
    tl: number;
    tlc: number;
}

// 자동 충전 설정
export interface AutoRechargeSettings {
    enabled: boolean;
    threshold: number;
    amount: number;
}

// 사용자 인터페이스
export interface User {
    name: string;
    avatar: string;
    status: string;
}
