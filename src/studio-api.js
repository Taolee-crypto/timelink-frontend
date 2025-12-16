// TL Studio API 통신 모듈
class TLStudioAPI {
    constructor() {
        this.baseUrl = window.TIMELINK_API?.BASE_URL || 'https://timelink.digital/api';
    }
    
    // 파일 업로드 및 변환
    async convertFile(file, metadata) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(metadata));
        
        try {
            const response = await fetch(`${this.baseUrl}/studio/convert`, {
                method: 'POST',
                body: formData
            });
            
            return await response.json();
        } catch (error) {
            console.error('변환 오류:', error);
            throw error;
        }
    }
    
    // 내 라이브러리 가져오기
    async getMyLibrary() {
        try {
            const response = await fetch(`${this.baseUrl}/studio/my-library`);
            return await response.json();
        } catch (error) {
            console.error('라이브러리 조회 오류:', error);
            return { contents: [] };
        }
    }
    
    // TL 잔액 조회
    async getBalance() {
        try {
            const response = await fetch(`${this.baseUrl}/wallet/balance`);
            return await response.json();
        } catch (error) {
            console.error('잔액 조회 오류:', error);
            return { balance: 0 };
        }
    }
    
    // TL 충전
    async chargeTL(amount) {
        try {
            const response = await fetch(`${this.baseUrl}/wallet/charge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });
            return await response.json();
        } catch (error) {
            console.error('충전 오류:', error);
            throw error;
        }
    }
}

// 글로벌로 내보내기
window.tlStudioAPI = new TLStudioAPI();
