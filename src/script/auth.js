// 인증 관련 JavaScript
const API_BASE_URL = 'https://timelink-backend.timelink-api.workers.dev';

// 이메일 인증
async function verifyEmail(email, verificationCode) {
    try {
        const response = await fetch(API_BASE_URL + '/api/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                verificationCode: verificationCode
            })
        });
        
        const data = await response.json();
        return { response, data };
        
    } catch (error) {
        console.error('이메일 인증 에러:', error);
        throw error;
    }
}

// 인증번호 재발송
async function resendVerification(email) {
    try {
        const response = await fetch(API_BASE_URL + '/api/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        const data = await response.json();
        return { response, data };
        
    } catch (error) {
        console.error('인증번호 재발송 에러:', error);
        throw error;
    }
}

// 페이지 로드 시 인증 처리
document.addEventListener('DOMContentLoaded', function() {
    // verify.html 페이지에서 실행
    if (window.location.pathname.includes('verify.html')) {
        const verifyForm = document.getElementById('verifyForm');
        if (verifyForm) {
            verifyForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = localStorage.getItem('pending_email');
                const authCode = document.getElementById('authCode').value;
                
                if (!email || !authCode) {
                    alert('이메일과 인증번호를 입력해주세요.');
                    return;
                }
                
                // 로딩 상태
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalHTML = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 인증 중...';
                
                try {
                    const { response, data } = await verifyEmail(email, authCode);
                    
                    if (response.ok && data.success) {
                        alert('이메일 인증이 완료되었습니다!');
                        localStorage.removeItem('pending_email');
                        
                        // 로그인 페이지로 이동
                        setTimeout(() => {
                            window.location.href = 'login.html?verified=true';
                        }, 1000);
                        
                    } else {
                        alert(data.error || '인증에 실패했습니다.');
                    }
                    
                } catch (error) {
                    alert('서버 연결에 실패했습니다.');
                    console.error('인증 에러:', error);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                }
            });
        }
        
        // 자동으로 테스트용 인증번호 입력 (개발 모드)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('dev') === 'true') {
            document.getElementById('authCode').value = '123456';
        }
    }
});

// 전역에 노출
window.auth = {
    verifyEmail,
    resendVerification
};
