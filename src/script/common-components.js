// common-components.js
class CommonComponents {
    constructor() {
        this.init();
    }

    init() {
        this.renderTLBalance();
        this.setupMobileMenu();
        this.setupEventListeners();
    }

    renderTLBalance() {
        // 모든 페이지에서 TL 잔액 표시를 위한 공통 함수
        const user = JSON.parse(localStorage.getItem('timelink_user'));
        if (user && user.balance) {
            // 헤더의 TL 잔액 업데이트
            const balanceElements = document.querySelectorAll('#balanceAmount, .mobile-tl-balance span');
            balanceElements.forEach(element => {
                element.textContent = `${user.balance.toLocaleString()} TL`;
            });

            // 모바일 TL 잔액 추가 (없는 경우)
            if (!document.querySelector('.mobile-tl-balance')) {
                const mobileTLBalance = document.createElement('div');
                mobileTLBalance.className = 'mobile-tl-balance';
                mobileTLBalance.style.cssText = `
                    display: none;
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    background: linear-gradient(135deg, #FF6B00, #FFA500);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);
                    z-index: 999;
                `;
                mobileTLBalance.innerHTML = `
                    <i class="fas fa-coins"></i>
                    <span>${user.balance.toLocaleString()} TL</span>
                `;
                document.body.appendChild(mobileTLBalance);
            }
        }
    }

    setupMobileMenu() {
        // 모바일 네비게이션 메뉴 생성
        if (window.innerWidth <= 768) {
            this.createMobileMenu();
        }

        // 창 크기 변경 감지
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768 && !document.querySelector('.mobile-nav')) {
                this.createMobileMenu();
            } else if (window.innerWidth > 768) {
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav) {
                    mobileNav.remove();
                }
            }
        });
    }

    createMobileMenu() {
        if (document.querySelector('.mobile-nav')) return;

        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        mobileNav.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(10, 15, 43, 0.95);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-around;
            padding: 0.75rem 0;
            z-index: 999;
        `;

        const pages = [
            { icon: 'home', text: '홈', link: 'index.html' },
            { icon: 'sliders-h', text: '스튜디오', link: 'studio.html' },
            { icon: 'music', text: 'TLMUSIC', link: 'tlmusic.html' },
            { icon: 'broadcast-tower', text: '카페', link: 'cafe-radio.html' },
            { icon: 'user', text: '내 정보', link: '#' }
        ];

        pages.forEach(page => {
            const isActive = window.location.pathname.includes(page.link.replace('.html', ''));
            const navItem = document.createElement('a');
            navItem.href = page.link;
            navItem.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                text-decoration: none;
                color: ${isActive ? '#FF6B00' : '#94a3b8'};
                font-size: 0.8rem;
                transition: color 0.3s ease;
            `;
            navItem.innerHTML = `
                <i class="fas fa-${page.icon}" style="font-size: 1.2rem; margin-bottom: 0.25rem;"></i>
                <span>${page.text}</span>
            `;
            
            navItem.addEventListener('click', (e) => {
                if (page.link === '#') {
                    e.preventDefault();
                    const userMenuBtn = document.querySelector('#userMenuBtn');
                    if (userMenuBtn) {
                        userMenuBtn.click();
                    }
                }
            });
            
            mobileNav.appendChild(navItem);
        });

        document.body.appendChild(mobileNav);

        // 모바일 TL 잔액 표시
        const user = JSON.parse(localStorage.getItem('timelink_user'));
        if (user && user.balance) {
            const mobileTLBalance = document.querySelector('.mobile-tl-balance');
            if (mobileTLBalance) {
                mobileTLBalance.style.display = 'block';
            }
        }
    }

    setupEventListeners() {
        // 글로벌 키보드 단축키
        document.addEventListener('keydown', (e) => {
            // Ctrl + L: 로그인 모달
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                if (window.timelinkAuth && !window.timelinkAuth.currentUser) {
                    window.timelinkAuth.showLoginModal();
                }
            }
            
            // Ctrl + R: 회원가입 모달
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                if (window.timelinkAuth && !window.timelinkAuth.currentUser) {
                    window.timelinkAuth.showRegisterModal();
                }
            }
            
            // Esc: 모달 닫기
            if (e.key === 'Escape') {
                const modal = document.querySelector('#loginModal, #registerModal');
                if (modal) {
                    modal.remove();
                }
            }
        });

        // 페이지 전환 시 TL 잔액 업데이트
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.href) {
                setTimeout(() => {
                    this.renderTLBalance();
                }, 100);
            }
        });
    }

    // TL 충전 모달
    showChargeModal() {
        const user = JSON.parse(localStorage.getItem('timelink_user'));
        if (!user) {
            alert('로그인이 필요합니다.');
            window.timelinkAuth.showLoginModal();
            return;
        }

        const modalHTML = `
            <div id="chargeModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 2000;">
                <div style="background: #1A2342; border-radius: 20px; padding: 2.5rem; width: 90%; max-width: 400px; border: 1px solid rgba(255, 107, 0, 0.3); position: relative;">
                    <button id="closeChargeModal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <h2 style="font-size: 1.8rem; margin-bottom: 2rem; color: white; text-align: center;">
                        <i class="fas fa-coins" style="color: #FF6B00;"></i>
                        TL 충전
                    </h2>
                    
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="color: #94a3b8; margin-bottom: 0.5rem;">현재 잔액</div>
                        <div style="font-size: 2rem; font-weight: 700; color: #FF6B00;">
                            ${user.balance.toLocaleString()} TL
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
                        ${[1000, 5000, 10000, 50000, 100000, 500000].map(amount => `
                            <button class="charge-amount-btn" data-amount="${amount}" 
                                    style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: white; cursor: pointer; transition: all 0.3s ease;">
                                <div style="font-weight: 600; margin-bottom: 0.25rem;">${amount.toLocaleString()} TL</div>
                                <div style="font-size: 0.8rem; color: #94a3b8;">₩${(amount / 10).toLocaleString()}</div>
                            </button>
                        `).join('')}
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #94a3b8;">직접 입력</label>
                        <input type="number" id="customAmount" min="100" max="1000000" 
                               style="width: 100%; padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: white;"
                               placeholder="충전할 TL 금액 입력">
                    </div>
                    
                    <button id="chargeBtn" style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #FF6B00, #FFA500); border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; margin-bottom: 1rem;">
                        TL 충전하기
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 이벤트 리스너 추가
        document.getElementById('closeChargeModal').addEventListener('click', () => {
            document.getElementById('chargeModal').remove();
        });

        // 충전 금액 버튼 클릭
        document.querySelectorAll('.charge-amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.charge-amount-btn').forEach(b => {
                    b.style.background = 'rgba(255, 255, 255, 0.05)';
                    b.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                });
                btn.style.background = 'rgba(255, 107, 0, 0.2)';
                btn.style.borderColor = '#FF6B00';
                document.getElementById('customAmount').value = btn.dataset.amount;
            });
        });

        // 커스텀 금액 입력
        document.getElementById('customAmount').addEventListener('input', (e) => {
            document.querySelectorAll('.charge-amount-btn').forEach(b => {
                b.style.background = 'rgba(255, 255, 255, 0.05)';
                b.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            });
        });

        // 충전 버튼 클릭
        document.getElementById('chargeBtn').addEventListener('click', () => {
            const amount = parseInt(document.getElementById('customAmount').value) || 0;
            
            if (amount < 100) {
                alert('최소 충전 금액은 100 TL입니다.');
                return;
            }

            if (amount > 1000000) {
                alert('최대 충전 금액은 1,000,000 TL입니다.');
                return;
            }

            // 더미 충전 처리
            if (confirm(`${amount.toLocaleString()} TL을 충전하시겠습니까?\n₩${(amount / 10).toLocaleString()}이 결제됩니다.`)) {
                user.balance += amount;
                localStorage.setItem('timelink_user', JSON.stringify(user));
                
                // TL 표시 업데이트
                window.timelinkAuth.renderAuthButtons();
                this.renderTLBalance();
                
                alert(`${amount.toLocaleString()} TL이 충전되었습니다!\n새 잔액: ${user.balance.toLocaleString()} TL`);
                document.getElementById('chargeModal').remove();
            }
        });

        // 모달 외부 클릭 시 닫기
        document.getElementById('chargeModal').addEventListener('click', (e) => {
            if (e.target.id === 'chargeModal') {
                document.getElementById('chargeModal').remove();
            }
        });
    }
}

// 공통 컴포넌트 초기화
window.commonComponents = new CommonComponents();

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('공통 컴포넌트 초기화 완료');
    
    // TL 충전 버튼 이벤트 추가
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-action="charge-tl"]')) {
            e.preventDefault();
            window.commonComponents.showChargeModal();
        }
    });
});

// CSS 추가
const commonStyles = document.createElement('style');
commonStyles.textContent = `
    /* TL 잔액 표시 스타일 */
    .tl-balance-display {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(255, 107, 0, 0.1);
        border-radius: 10px;
        border: 1px solid rgba(255, 107, 0, 0.3);
        color: #FFA500;
        font-weight: 600;
    }
    
    .tl-balance-display i {
        color: #FF6B00;
    }
    
    /* 모바일 네비게이션 */
    @media (max-width: 768px) {
        .main-nav {
            display: none !important;
        }
        
        body {
            padding-bottom: 60px; /* 모바일 네비게이션 높이 */
        }
    }
    
    @media (min-width: 769px) {
        .mobile-nav,
        .mobile-tl-balance {
            display: none !important;
        }
    }
    
    /* 애니메이션 */
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .mobile-nav {
        animation: slideInUp 0.3s ease-out;
    }
`;
document.head.appendChild(commonStyles);
