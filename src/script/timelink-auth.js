// timelink-auth.js
class TimelinkAuth {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.renderAuthButtons();
    }

    loadUserFromStorage() {
        const userData = localStorage.getItem('timelink_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            console.log('사용자 로드됨:', this.currentUser);
        }
    }

    saveUserToStorage(user) {
        localStorage.setItem('timelink_user', JSON.stringify(user));
        this.currentUser = user;
        console.log('사용자 저장됨:', user);
    }

    logout() {
        localStorage.removeItem('timelink_user');
        this.currentUser = null;
        this.renderAuthButtons();
        console.log('로그아웃됨');
        window.location.reload();
    }

    async login(email, password) {
        // 더미 데이터로 로그인 처리
        const dummyUsers = [
            {
                id: 1,
                name: '테스트 사용자',
                email: 'test@example.com',
                password: '1234',
                balance: 10000,
                isCreator: true,
                joinDate: '2024-01-01'
            }
        ];

        const user = dummyUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // 민감한 정보 제거
            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                isCreator: user.isCreator,
                joinDate: user.joinDate
            };
            
            this.saveUserToStorage(userData);
            this.renderAuthButtons();
            
            console.log('로그인 성공:', userData);
            alert(`${userData.name}님, 환영합니다!`);
            return true;
        } else {
            console.log('로그인 실패');
            alert('이메일 또는 비밀번호가 올바르지 않습니다.');
            return false;
        }
    }

    async register(name, email, password, isCreator = false) {
        // 간단한 유효성 검사
        if (!name || !email || !password) {
            alert('모든 필드를 입력해주세요.');
            return false;
        }

        if (password.length < 4) {
            alert('비밀번호는 4자 이상이어야 합니다.');
            return false;
        }

        // 이메일 중복 체크 (더미)
        const existingUser = this.getUserByEmail(email);
        if (existingUser) {
            alert('이미 사용 중인 이메일입니다.');
            return false;
        }

        // 새 사용자 생성
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password, // 실제로는 해싱해야 함
            balance: 10000, // 회원가입 보너스 10,000 TL
            isCreator: isCreator,
            joinDate: new Date().toISOString().split('T')[0],
            profileImage: null
        };

        this.saveUserToStorage(newUser);
        this.renderAuthButtons();
        
        console.log('회원가입 성공:', newUser);
        alert(`${newUser.name}님, 가입을 환영합니다!\n보너스 10,000 TL이 지급되었습니다.`);
        return true;
    }

    getUserByEmail(email) {
        const userData = localStorage.getItem('timelink_user');
        if (userData) {
            const user = JSON.parse(userData);
            return user.email === email ? user : null;
        }
        return null;
    }

    updateBalance(amount) {
        if (this.currentUser) {
            this.currentUser.balance += amount;
            if (this.currentUser.balance < 0) {
                this.currentUser.balance = 0;
            }
            this.saveUserToStorage(this.currentUser);
            this.renderAuthButtons();
            return this.currentUser.balance;
        }
        return 0;
    }

    renderAuthButtons() {
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) return;

        if (this.currentUser) {
            // 로그인 상태
            authButtons.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(255, 107, 0, 0.1); border-radius: 10px; border: 1px solid rgba(255, 107, 0, 0.3);">
                        <i class="fas fa-coins" style="color: #FFA500;"></i>
                        <span style="font-weight: 600; color: #FFA500;" id="balanceAmount">${this.currentUser.balance.toLocaleString()} TL</span>
                    </div>
                    <div style="position: relative;">
                        <button id="userMenuBtn" style="background: linear-gradient(135deg, #FF6B00, #FFA500); border: none; border-radius: 10px; padding: 0.5rem 1rem; color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease;">
                            <i class="fas fa-user"></i>
                            ${this.currentUser.name}
                            <i class="fas fa-chevron-down" style="font-size: 0.8rem;"></i>
                        </button>
                        <div id="userMenu" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 0.5rem; background: #1A2342; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 0.5rem; min-width: 180px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); z-index: 1000;">
                            <div style="padding: 0.75rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                <div style="font-weight: 600;">${this.currentUser.name}</div>
                                <div style="font-size: 0.8rem; color: #94a3b8;">${this.currentUser.email}</div>
                            </div>
                            <a href="studio.html" style="display: block; padding: 0.75rem; color: white; text-decoration: none; border-radius: 5px; transition: background 0.3s ease;">
                                <i class="fas fa-sliders-h"></i> 스튜디오
                            </a>
                            <a href="tlmusic.html" style="display: block; padding: 0.75rem; color: white; text-decoration: none; border-radius: 5px; transition: background 0.3s ease;">
                                <i class="fas fa-music"></i> TLMUSIC
                            </a>
                            <a href="#" style="display: block; padding: 0.75rem; color: white; text-decoration: none; border-radius: 5px; transition: background 0.3s ease;">
                                <i class="fas fa-wallet"></i> TL 충전
                            </a>
                            <button onclick="window.timelinkAuth.logout()" style="width: 100%; padding: 0.75rem; background: rgba(255, 107, 0, 0.2); border: 1px solid rgba(255, 107, 0, 0.3); border-radius: 5px; color: #FF6B00; font-weight: 600; cursor: pointer; margin-top: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fas fa-sign-out-alt"></i>
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // 사용자 메뉴 토글
            const userMenuBtn = document.getElementById('userMenuBtn');
            const userMenu = document.getElementById('userMenu');
            
            if (userMenuBtn && userMenu) {
                userMenuBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    userMenu.style.display = userMenu.style.display === 'none' ? 'block' : 'none';
                });

                // 문서 클릭 시 메뉴 닫기
                document.addEventListener('click', () => {
                    userMenu.style.display = 'none';
                });

                // 메뉴 내부 클릭 시 버블링 방지
                userMenu.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        } else {
            // 로그아웃 상태
            authButtons.innerHTML = `
                <div style="display: flex; gap: 0.75rem;">
                    <button id="loginBtn" style="padding: 0.5rem 1.5rem; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; color: white; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                        로그인
                    </button>
                    <button id="registerBtn" style="padding: 0.5rem 1.5rem; background: linear-gradient(135deg, #FF6B00, #FFA500); border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                        회원가입
                    </button>
                </div>
            `;

            // 로그인/회원가입 버튼 이벤트
            document.getElementById('loginBtn')?.addEventListener('click', () => this.showLoginModal());
            document.getElementById('registerBtn')?.addEventListener('click', () => this.showRegisterModal());
        }
    }

    showLoginModal() {
        // 기존 모달 제거
        this.removeExistingModal();

        const modalHTML = `
            <div id="loginModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 2000;">
                <div style="background: #1A2342; border-radius: 20px; padding: 2.5rem; width: 90%; max-width: 400px; border: 1px solid rgba(255, 107, 0, 0.3); position: relative;">
                    <button id="closeLoginModal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <h2 style="font-size: 1.8rem; margin-bottom: 2rem; color: white; text-align: center;">
                        <i class="fas fa-sign-in-alt" style="color: #FF6B00;"></i>
                        로그인
                    </h2>
                    
                    <form id="loginForm">
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: #94a3b8;">이메일</label>
                            <input type="email" id="loginEmail" required 
                                   style="width: 100%; padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: white;"
                                   placeholder="이메일을 입력하세요">
                        </div>
                        
                        <div style="margin-bottom: 2rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: #94a3b8;">비밀번호</label>
                            <input type="password" id="loginPassword" required 
                                   style="width: 100%; padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: white;"
                                   placeholder="비밀번호를 입력하세요">
                        </div>
                        
                        <button type="submit" 
                                style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #FF6B00, #FFA500); border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; margin-bottom: 1rem;">
                            로그인
                        </button>
                        
                        <div style="text-align: center; color: #94a3b8; font-size: 0.9rem;">
                            아직 계정이 없으신가요? 
                            <a href="#" id="switchToRegister" style="color: #FF6B00; text-decoration: none; font-weight: 600;">회원가입</a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 이벤트 리스너 추가
        document.getElementById('closeLoginModal').addEventListener('click', () => {
            document.getElementById('loginModal').remove();
        });

        document.getElementById('switchToRegister').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginModal').remove();
            this.showRegisterModal();
        });

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const success = await this.login(email, password);
            if (success) {
                document.getElementById('loginModal').remove();
            }
        });

        // 모달 외부 클릭 시 닫기
        document.getElementById('loginModal').addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') {
                document.getElementById('loginModal').remove();
            }
        });
    }

    showRegisterModal() {
        // 기존 모달 제거
        this.removeExistingModal();

        const modalHTML = `
            <div id="registerModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 2000;">
                <div style="background: #1A2342; border-radius: 20px; padding: 2.5rem; width: 90%; max-width: 400px; border: 1px solid rgba(255, 107, 0, 0.3); position: relative;">
                    <button id="closeRegisterModal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <h2 style="font-size: 1.8rem; margin-bottom: 2rem; color: white; text-align: center;">
                        <i class="fas fa-user-plus" style="color: #FF6B00;"></i>
                        회원가입
                    </h2>
                    
                    <form id="registerForm">
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: #94a3b8;">이름</label>
                            <input type="text" id="registerName" required 
                                   style="width: 100%; padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: white;"
                                   placeholder="이름을 입력하세요">
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: #94a3b8;">이메일</label>
                            <input type="email" id="registerEmail" required 
                                   style="width: 100%; padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: white;"
                                   placeholder="이메일을 입력하세요">
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: #94a3b8;">비밀번호</label>
                            <input type="password" id="registerPassword" required 
                                   style="width: 100%; padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: white;"
                                   placeholder="비밀번호를 입력하세요">
                        </div>
                        
                        <div style="margin-bottom: 2rem;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: #94a3b8;">
                                <input type="checkbox" id="isCreator" style="width: auto;">
                                창작자로 가입하기
                            </label>
                            <small style="display: block; margin-top: 0.5rem; color: #94a3b8; font-size: 0.8rem;">
                                ✔️ 가입 즉시 10,000 TL 보너스 지급
                            </small>
                            <small style="display: block; margin-top: 0.25rem; color: #94a3b8; font-size: 0.8rem;">
                                ✔️ 음악 업로드 및 TL3 파일 생성 가능
                            </small>
                        </div>
                        
                        <button type="submit" 
                                style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #FF6B00, #FFA500); border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; margin-bottom: 1rem;">
                            회원가입
                        </button>
                        
                        <div style="text-align: center; color: #94a3b8; font-size: 0.9rem;">
                            이미 계정이 있으신가요? 
                            <a href="#" id="switchToLogin" style="color: #FF6B00; text-decoration: none; font-weight: 600;">로그인</a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 이벤트 리스너 추가
        document.getElementById('closeRegisterModal').addEventListener('click', () => {
            document.getElementById('registerModal').remove();
        });

        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerModal').remove();
            this.showLoginModal();
        });

        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const isCreator = document.getElementById('isCreator').checked;
            
            const success = await this.register(name, email, password, isCreator);
            if (success) {
                document.getElementById('registerModal').remove();
            }
        });

        // 모달 외부 클릭 시 닫기
        document.getElementById('registerModal').addEventListener('click', (e) => {
            if (e.target.id === 'registerModal') {
                document.getElementById('registerModal').remove();
            }
        });
    }

    removeExistingModal() {
        const existingModal = document.querySelector('#loginModal, #registerModal');
        if (existingModal) {
            existingModal.remove();
        }
    }

    // TL 잔액 업데이트
    updateTLDisplay() {
        if (this.currentUser) {
            const balanceElements = document.querySelectorAll('#balanceAmount, .mobile-tl-balance span');
            balanceElements.forEach(element => {
                element.textContent = `${this.currentUser.balance.toLocaleString()} TL`;
            });
        }
    }

    // 테스트 계정 생성
    createTestAccount() {
        const testUser = {
            id: 999,
            name: '테스트 사용자',
            email: 'test@example.com',
            balance: 10000,
            isCreator: true,
            joinDate: '2024-01-01'
        };
        
        this.saveUserToStorage(testUser);
        this.renderAuthButtons();
        console.log('테스트 계정 생성 완료:', testUser);
    }
}

// 전역 객체로 사용할 수 있도록 설정
window.timelinkAuth = new TimelinkAuth();

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 페이지별 추가 설정
    if (window.location.pathname.includes('studio.html')) {
        // 스튜디오 페이지에서만 실행할 코드
        console.log('스튜디오 페이지 로드됨');
    }
    
    // 테스트 계정 자동 생성 (개발용)
    if (!localStorage.getItem('timelink_user')) {
        console.log('테스트 계정 자동 생성 중...');
        window.timelinkAuth.createTestAccount();
    }
});
