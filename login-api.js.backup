// login.html 및 register.html에 추가할 스크립트
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const messageDiv = document.getElementById('message') || createMessageDiv();

  // 이미 로그인되어 있는지 확인
  if (TimeLinkAPI.isAuthenticated && TimeLinkAPI.isAuthenticated()) {
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('register.html')) {
      window.location.href = '/index.html';
    }
    return;
  }

  // 로그인 폼 처리
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email')?.value;
      const password = document.getElementById('password')?.value;
      
      if (!email || !password) {
        showMessage('이메일과 비밀번호를 입력해주세요.', 'error');
        return;
      }
      
      showMessage('로그인 중...', 'info');
      
      try {
        const result = await TimeLinkAPI.login(email, password);
        
        if (result && result.success) {
          showMessage('로그인 성공! 메인 페이지로 이동합니다...', 'success');
          setTimeout(() => {
            window.location.href = '/index.html';
          }, 1500);
        } else {
          showMessage(`로그인 실패: ${result?.error || '알 수 없는 오류'}`, 'error');
        }
      } catch (error) {
        showMessage(`오류 발생: ${error.message}`, 'error');
        console.error('로그인 에러:', error);
      }
    });
  }

  // 회원가입 폼 처리
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email')?.value;
      const password = document.getElementById('password')?.value;
      const username = document.getElementById('username')?.value;
      const confirmPassword = document.getElementById('confirmPassword')?.value;
      
      if (!email || !password || !username) {
        showMessage('모든 필드를 입력해주세요.', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showMessage('비밀번호가 일치하지 않습니다.', 'error');
        return;
      }
      
      if (password.length < 6) {
        showMessage('비밀번호는 최소 6자 이상이어야 합니다.', 'error');
        return;
      }
      
      showMessage('회원가입 처리 중...', 'info');
      
      try {
        const result = await TimeLinkAPI.register(email, password, username);
        
        if (result && result.success) {
          showMessage('회원가입 성공! 로그인 페이지로 이동합니다...', 'success');
          setTimeout(() => {
            window.location.href = '/login.html';
          }, 2000);
        } else {
          showMessage(`회원가입 실패: ${result?.error || '알 수 없는 오류'}`, 'error');
        }
      } catch (error) {
        showMessage(`오류 발생: ${error.message}`, 'error');
        console.error('회원가입 에러:', error);
      }
    });
  }

  // 메시지 표시 함수
  function showMessage(text, type) {
    messageDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
  }

  // 메시지 div 생성 함수
  function createMessageDiv() {
    const div = document.createElement('div');
    div.id = 'message';
    const form = document.querySelector('form');
    if (form && form.parentNode) {
      form.parentNode.insertBefore(div, form);
    }
    return div;
  }
});
