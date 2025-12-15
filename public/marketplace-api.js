// P2P 마켓플레이스 API
class MarketplaceAPI {
    constructor() {
        this.baseUrl = window.TIMELINK_API?.BASE_URL || 'https://timelink.digital/api';
    }
    
    // P2P 목록 가져오기
    async getP2PListings(type = 'music') {
        try {
            const response = await fetch(`${this.baseUrl}/marketplace/p2p-listings?type=${type}`);
            return await response.json();
        } catch (error) {
            console.error('P2P 목록 조회 오류:', error);
            return { listings: [] };
        }
    }
    
    // 콘텐츠 구매
    async buyContent(contentId, price) {
        try {
            const response = await fetch(`${this.baseUrl}/marketplace/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentId, price })
            });
            return await response.json();
        } catch (error) {
            console.error('구매 오류:', error);
            throw error;
        }
    }
    
    // 콘텐츠 업로드 (P2P 등록)
    async uploadToP2P(contentData) {
        try {
            const response = await fetch(`${this.baseUrl}/content/upload-p2p`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contentData)
            });
            return await response.json();
        } catch (error) {
            console.error('P2P 업로드 오류:', error);
            throw error;
        }
    }
}

// 글로벌로 내보내기
window.marketplaceAPI = new MarketplaceAPI();
