<script>
// TL Platform 초기화
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 TL Platform 초기화 시작...');
    
    // 언어 설정 적용 (함수가 로드되었는지 확인)
    if (typeof applyLanguage === 'function') {
        const savedLang = localStorage.getItem('tl_language') || 'ko';
        applyLanguage(savedLang);
    } else {
        console.warn('applyLanguage 함수를 찾을 수 없습니다.');
        // language.js가 로드되지 않았을 경우 직접 로드
        const script = document.createElement('script');
        script.src = 'js/language.js';
        script.onload = function() {
            const savedLang = localStorage.getItem('tl_language') || 'ko';
            applyLanguage(savedLang);
        };
        document.head.appendChild(script);
    }
    
    // API 초기화
    if (typeof TLAPI !== 'undefined') {
        const api = await TLAPI.init();
        
        if (api.healthy) {
            console.log('✅ 시스템 정상 작동 중');
            document.body.dataset.connected = "true";
            
            // 기존 토큰 확인
            const token = localStorage.getItem('tl_token');
            if (token) {
                console.log('기존 로그인 토큰 발견');
            }
        } else {
            console.warn('⚠️ 오프라인 모드');
            document.body.dataset.connected = "false";
            
            // 오프라인 알림
            if (typeof showNotification === 'function') {
                showNotification('백엔드 서버에 연결할 수 없습니다. 오프라인 데모 모드로 실행됩니다.', 'warning');
            }
        }
    } else {
        console.error('TLAPI가 정의되지 않았습니다.');
    }
});
</script>
