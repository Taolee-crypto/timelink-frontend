// API 모킹 - 경제 시스템 관련
class MockEconomicAPI {
    constructor() {
        this.wallets = new Map();
        this.tl3Tracks = new Map();
        this.spotifyVerifications = new Map();
        this.broadcasts = new Map();
    }
    
    async getWallet(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!this.wallets.has(userId)) {
                    this.wallets.set(userId, {
                        earned_tl: 0,
                        purchased_tl: 0,
                        promo_tl: 10000,
                        total: 10000
                    });
                }
                
                resolve(this.wallets.get(userId));
            }, 500);
        });
    }
    
    async updateWallet(userId, updates) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const wallet = this.wallets.get(userId) || {
                    earned_tl: 0,
                    purchased_tl: 0,
                    promo_tl: 10000,
                    total: 10000
                };
                
                Object.assign(wallet, updates);
                wallet.total = wallet.earned_tl + wallet.purchased_tl + wallet.promo_tl;
                
                this.wallets.set(userId, wallet);
                resolve(wallet);
            }, 500);
        });
    }
    
    async watchAd(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.getWallet(userId).then(wallet => {
                    const updated = {
                        purchased_tl: wallet.purchased_tl + 50,
                        total: wallet.total + 50
                    };
                    
                    this.updateWallet(userId, updated).then(resolve);
                });
            }, 500);
        });
    }
    
    async exchangeTL(userId, amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.getWallet(userId).then(wallet => {
                    if (wallet.earned_tl < amount) {
                        reject(new Error('환전 가능한 금액이 부족합니다.'));
                        return;
                    }
                    
                    const updated = {
                        earned_tl: wallet.earned_tl - amount,
                        total: wallet.total - amount
                    };
                    
                    this.updateWallet(userId, updated).then(resolve);
                });
            }, 1000);
        });
    }
    
    async checkSpotifyVerification(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    verified: this.spotifyVerifications.has(userId)
                });
            }, 500);
        });
    }
    
    async verifySpotify(userId, authCode) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.spotifyVerifications.set(userId, {
                    verified: true,
                    verifiedAt: new Date().toISOString(),
                    authCode
                });
                
                resolve({ verified: true });
            }, 1000);
        });
    }
    
    async createTL3(trackData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const track = {
                    id: `tl3_${Date.now()}`,
                    ...trackData,
                    timeCharged: 0,
                    playCount: 0,
                    cafePlayCount: 0,
                    contributionScore: 0,
                    createdAt: new Date().toISOString()
                };
                
                if (!this.tl3Tracks.has(trackData.creatorId)) {
                    this.tl3Tracks.set(trackData.creatorId, []);
                }
                
                const tracks = this.tl3Tracks.get(trackData.creatorId);
                tracks.push(track);
                
                resolve({ track });
            }, 1000);
        });
    }
    
    async getCreatorTL3(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const tracks = this.tl3Tracks.get(userId) || [];
                resolve({ tracks });
            }, 500);
        });
    }
    
    async chargeTL3Time(trackId, seconds, userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const cost = Math.ceil(seconds / 60) * 10;
                
                this.getWallet(userId).then(wallet => {
                    if (wallet.total < cost) {
                        resolve({ success: false, message: 'TL이 부족합니다.' });
                        return;
                    }
                    
                    // TL 차감
                    const updated = {
                        total: wallet.total - cost
                    };
                    
                    if (wallet.promo_tl >= cost) {
                        updated.promo_tl = wallet.promo_tl - cost;
                    } else {
                        const remaining = cost - wallet.promo_tl;
                        updated.promo_tl = 0;
                        updated.purchased_tl = wallet.purchased_tl - remaining;
                    }
                    
                    this.updateWallet(userId, updated).then(() => {
                        resolve({ 
                            success: true, 
                            wallet: this.wallets.get(userId),
                            cost 
                        });
                    });
                });
            }, 500);
        });
    }
    
    async playTL3(trackId, userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // TL 보상
                this.getWallet(userId).then(wallet => {
                    const updated = {
                        earned_tl: wallet.earned_tl + 2,
                        total: wallet.total + 2
                    };
                    
                    this.updateWallet(userId, updated).then(wallet => {
                        resolve({ 
                            success: true, 
                            wallet,
                            reward: 2 
                        });
                    });
                });
            }, 500);
        });
    }
    
    async startBroadcast(cafeId, mood) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.broadcasts.set(cafeId, {
                    mood,
                    startedAt: new Date().toISOString(),
                    isActive: true
                });
                
                resolve({ success: true });
            }, 500);
        });
    }
    
    async stopBroadcast(cafeId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.broadcasts.delete(cafeId);
                resolve({ success: true });
            }, 500);
        });
    }
    
    async continueBroadcast(cafeId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 500);
        });
    }
    
    async getRecommendedTracks() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    tracks: [
                        { 
                            id: '1', 
                            title: 'Chill Vibes #01', 
                            mood: 'Relaxed', 
                            bpm: 85, 
                            creator: 'Creator A', 
                            likes: 142,
                            length: 180
                        },
                        { 
                            id: '2', 
                            title: 'Energy Boost', 
                            mood: 'Energetic', 
                            bpm: 128, 
                            creator: 'Creator B', 
                            likes: 89,
                            length: 210
                        },
                        { 
                            id: '3', 
                            title: 'Focus Flow', 
                            mood: 'Focus', 
                            bpm: 95, 
                            creator: 'Creator C', 
                            likes: 203,
                            length: 240
                        },
                        { 
                            id: '4', 
                            title: 'Happy Day', 
                            mood: 'Happy', 
                            bpm: 110, 
                            creator: 'Creator A', 
                            likes: 156,
                            length: 195
                        }
                    ]
                });
            }, 500);
        });
    }
    
    async listenTrack(trackId, userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 500);
        });
    }
    
    async likeTrack(trackId, userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // TL 보상
                this.getWallet(userId).then(wallet => {
                    const updated = {
                        earned_tl: wallet.earned_tl + 1,
                        total: wallet.total + 1
                    };
                    
                    this.updateWallet(userId, updated).then(wallet => {
                        resolve({ 
                            success: true, 
                            wallet,
                            reward: 1 
                        });
                    });
                });
            }, 500);
        });
    }
}

// 글로벌 API 객체 생성
window.mockEconomicAPI = new MockEconomicAPI();
