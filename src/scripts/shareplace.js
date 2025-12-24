// SHAREPLACE JavaScript
class ShareplaceManager {
    constructor() {
        this.apiBaseUrl = 'https://your-api.workers.dev';
        this.currentUser = null;
        this.filters = {
            format: ['TL3', 'TL4', 'TLI', 'TLD'],
            genre: [],
            duration: 'medium',
            rate: 'medium',
            sort: 'popular'
        };
        this.init();
    }

    async init() {
        // 인증 확인
        if (window.authManager && authManager.isAuthenticated()) {
            this.currentUser = authManager.getUser();
        }
        
        // 데이터 로드
        await this.loadInitialData();
        this.bindEvents();
        this.setupGenreFilters();
    }

    async loadInitialData() {
        try {
            // TL CHART 로드
            await this.loadTLChart();
            
            // 최신 업로드 로드
            await this.loadLatestUploads();
            
            // 장르 탭 로드
            await this.loadGenreTabs();
            
            // 크리에이터 로드
            await this.loadFeaturedCreators();
            
            // 통계 업데이트
            await this.updateStats();
            
        } catch (error) {
            console.error('데이터 로드 중 오류:', error);
            this.showError('데이터를 불러오는데 실패했습니다.');
        }
    }

    async loadTLChart() {
        const chartContainer = document.getElementById('tlChart');
        if (!chartContainer) return;

        // Mock data (실제로는 API 호출)
        const chartData = [
            {
                id: 'tl3_001',
                title: 'Midnight Cityscape',
                artist: 'Chillwave Dreams',
                format: 'TL3',
                genre: 'Chillwave • Lo-fi',
                duration: 245,
                plays: 12456,
                likes: 892,
                tlRate: 1.8,
                thumbnail: '🎵'
            },
            {
                id: 'tl4_001',
                title: 'Tokyo Night Walk',
                artist: 'Visual Vibes',
                format: 'TL4',
                genre: 'Ambient • Travel',
                duration: 186,
                plays: 8567,
                likes: 567,
                tlRate: 2.1,
                thumbnail: '🎬'
            },
            // ... more items
        ];

        chartContainer.innerHTML = chartData.map((item, index) => `
            <div class="tl-item-card" data-id="${item.id}">
                <div class="item-badge">${item.format}</div>
                <div class="item-thumbnail">
                    ${item.thumbnail}
                </div>
                <div class="item-info">
                    <div class="chart-rank">#${index + 1}</div>
                    <h3 class="item-title">${item.title}</h3>
                    <div class="item-artist">
                        <i class="fas fa-user"></i> ${item.artist}
                    </div>
                    <div class="item-genre">${item.genre}</div>
                    <div class="item-stats">
                        <span><i class="fas fa-play"></i> ${item.plays.toLocaleString()}</span>
                        <span><i class="fas fa-heart"></i> ${item.likes}</span>
                        <span><i class="fas fa-clock"></i> ${this.formatDuration(item.duration)}</span>
                    </div>
                    <div class="item-charge">
                        <div class="charge-rate">
                            <span class="tl-icon">TL</span>
                            <span class="rate">1초 = ${item.tlRate.toFixed(1)}TL</span>
                            <span class="multiplier">(${item.tlRate.toFixed(1)}x)</span>
                        </div>
                        <button class="btn-charge-item" data-id="${item.id}" data-seconds="60">
                            <i class="fas fa-bolt"></i> 1분 충전
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadLatestUploads() {
        const uploadsContainer = document.getElementById('latestUploads');
        if (!uploadsContainer) return;

        // Mock data
        const latestData = [
            {
                id: 'tl3_new_001',
                title: 'Morning Coffee Jazz',
                artist: 'Smooth Brew',
                format: 'TL3',
                genre: 'Jazz • Instrumental',
                duration: 180,
                plays: 123,
                likes: 45,
                tlRate: 1.2,
                uploaded: '방금 전',
                thumbnail: '☕'
            },
            // ... more items
        ];

        uploadsContainer.innerHTML = latestData.map(item => `
            <div class="tl-item-card" data-id="${item.id}">
                <div class="item-badge">${item.format}</div>
                <div class="item-thumbnail">
                    ${item.thumbnail}
                </div>
                <div class="item-info">
                    <h3 class="item-title">${item.title}</h3>
                    <div class="item-artist">
                        <i class="fas fa-user"></i> ${item.artist}
                    </div>
                    <div class="item-genre">${item.genre}</div>
                    <div class="item-stats">
                        <span><i class="fas fa-play"></i> ${item.plays}</span>
                        <span><i class="fas fa-heart"></i> ${item.likes}</span>
                        <span><i class="fas fa-clock"></i> ${this.formatDuration(item.duration)}</span>
                    </div>
                    <div class="item-meta">
                        <span class="upload-time"><i class="fas fa-upload"></i> ${item.uploaded}</span>
                    </div>
                    <div class="item-charge">
                        <div class="charge-rate">
                            <span class="tl-icon">TL</span>
                            <span class="rate">1초 = ${item.tlRate.toFixed(1)}TL</span>
                            <span class="multiplier">(${item.tlRate.toFixed(1)}x)</span>
                        </div>
                        <button class="btn-charge-item" data-id="${item.id}" data-seconds="300">
                            <i class="fas fa-bolt"></i> 5분 충전
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupGenreFilters() {
        const genres = [
            '팝', '록', '힙합', '일렉트로닉', '재즈', '클래식',
            '인디', 'R&B', 'Lo-fi', '앰비언트', '트랩', 'EDM',
            '어쿠스틱', '어반', '인스트루멘탈', '월드뮤직'
        ];

        const genreFilters = document.getElementById('genreFilters');
        if (genreFilters) {
            genreFilters.innerHTML = genres.map(genre => `
                <label class="filter-option">
                    <input type="checkbox" name="genre" value="${genre}">
                    <span class="checkmark"></span>
                    ${genre}
                </label>
            `).join('');
        }
    }

    async loadGenreTabs() {
        const genreTabs = document.getElementById('genreTabs');
        const genreContent = document.getElementById('genreContent');
        
        if (!genreTabs || !genreContent) return;

        const genres = [
            { id: 'electronic', name: '일렉트로닉', icon: '⚡' },
            { id: 'hiphop', name: '힙합', icon: '🎤' },
            { id: 'jazz', name: '재즈', icon: '🎷' },
            { id: 'lofi', name: 'Lo-fi', icon: '☕' },
            { id: 'ambient', name: '앰비언트', icon: '🌌' }
        ];

        genreTabs.innerHTML = genres.map((genre, index) => `
            <button class="genre-tab ${index === 0 ? 'active' : ''}" 
                    data-genre="${genre.id}">
                ${genre.icon} ${genre.name}
            </button>
        `).join('');

        // 첫 번째 장르 콘텐츠 로드
        await this.loadGenreContent(genres[0].id);
    }

    async loadGenreContent(genreId) {
        const genreContent = document.getElementById('genreContent');
        if (!genreContent) return;

        // Mock data for genre
        genreContent.innerHTML = `
            <div class="genre-header">
                <h3>${this.getGenreName(genreId)} 추천</h3>
                <p>이 장르의 인기 TL 파일들을 만나보세요</p>
            </div>
            <div class="genre-items">
                <!-- Items would be loaded here -->
            </div>
        `;
    }

    async loadFeaturedCreators() {
        const creatorsContainer = document.getElementById('featuredCreators');
        if (!creatorsContainer) return;

        const creators = [
            { id: 'creator_001', name: 'Chillwave Dreams', specialty: 'Lo-fi & Chillhop', items: 42, followers: '12.4K' },
            { id: 'creator_002', name: 'Visual Vibes', specialty: 'Ambient Visuals', items: 28, followers: '8.7K' },
            { id: 'creator_003', name: 'Quantum Beats', specialty: 'Experimental Electronic', items: 56, followers: '15.2K' },
            { id: 'creator_004', name: 'Neural Patterns', specialty: 'AI Generated Music', items: 34, followers: '9.8K' }
        ];

        creatorsContainer.innerHTML = creators.map(creator => `
            <div class="creator-card">
                <div class="creator-avatar">
                    ${creator.name.charAt(0)}
                </div>
                <h3 class="creator-name">${creator.name}</h3>
                <div class="creator-specialty">${creator.specialty}</div>
                <div class="creator-stats">
                    <span><i class="fas fa-music"></i> ${creator.items}</span>
                    <span><i class="fas fa-users"></i> ${creator.followers}</span>
                </div>
                <button class="btn btn-outline btn-small mt-2" onclick="shareplace.followCreator('${creator.id}')">
                    <i class="fas fa-plus"></i> 팔로우
                </button>
            </div>
        `).join('');
    }

    async updateStats() {
        // 실제 API 호출로 업데이트
        document.getElementById('totalItems').textContent = '15,824';
        document.getElementById('totalCreators').textContent = '2,347';
        document.getElementById('totalPlays').textContent = '1.2M';
    }

    bindEvents() {
        // 검색 이벤트
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('mainSearch');
        
        if (searchBtn && searchInput) {
            const searchHandler = () => {
                const query = searchInput.value.trim();
                if (query) {
                    this.searchItems(query);
                }
            };
            
            searchBtn.addEventListener('click', searchHandler);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') searchHandler();
            });
        }

        // 필터 적용
        const applyFiltersBtn = document.getElementById('applyFilters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.updateFilters();
                this.applyFilters();
            });
        }

        // 필터 초기화
        const resetFiltersBtn = document.getElementById('resetFilters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // 충전 버튼 이벤트 위임
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-charge-item')) {
                const button = e.target.closest('.btn-charge-item');
                const itemId = button.dataset.id;
                const seconds = parseInt(button.dataset.seconds);
                this.showChargeModal(itemId, seconds);
            }
            
            // 장르 탭 클릭
            if (e.target.closest('.genre-tab')) {
                const tab = e.target.closest('.genre-tab');
                const genreId = tab.dataset.genre;
                this.switchGenreTab(tab, genreId);
            }
            
            // 퀵 필터 태그
            if (e.target.closest('.filter-tag')) {
                const tag = e.target.closest('.filter-tag');
                const filter = tag.dataset.filter;
                this.applyQuickFilter(tag, filter);
            }
        });

        // 차트 기간 변경
        const chartPeriod = document.getElementById('chartPeriod');
        if (chartPeriod) {
            chartPeriod.addEventListener('change', (e) => {
                this.loadTLChart(e.target.value);
            });
        }

        // 시간 필터 버튼
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hours = parseInt(e.target.dataset.hours);
                this.filterByTime(hours);
            });
        });
    }

    updateFilters() {
        const formatFilters = Array.from(document.querySelectorAll('input[name="format"]:checked'))
            .map(input => input.value);
        
        const genreFilters = Array.from(document.querySelectorAll('input[name="genre"]:checked'))
            .map(input => input.value);
        
        const durationFilter = document.querySelector('input[name="duration"]:checked')?.value;
        const rateFilter = document.querySelector('input[name="rate"]:checked')?.value;

        this.filters.format = formatFilters;
        this.filters.genre = genreFilters;
        this.filters.duration = durationFilter;
        this.filters.rate = rateFilter;
    }

    async applyFilters() {
        try {
            // API 호출로 필터 적용
            const response = await this.apiCall('/api/shareplace/filter', {
                method: 'POST',
                body: JSON.stringify(this.filters)
            });
            
            // 결과 업데이트
            await this.updateFilteredResults(response.data);
            
            // 성공 메시지
            this.showToast('필터가 적용되었습니다.', 'success');
            
        } catch (error) {
            console.error('필터 적용 오류:', error);
            this.showError('필터 적용 중 오류가 발생했습니다.');
        }
    }

    resetFilters() {
        // 모든 체크박스 해제
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.checked = false;
        });
        
        // 기본값으로 설정
        document.querySelectorAll('input[name="format"][value="TL3"], input[name="format"][value="TL4"]')
            .forEach(input => input.checked = true);
        
        document.querySelector('input[name="duration"][value="medium"]').checked = true;
        document.querySelector('input[name="rate"][value="medium"]').checked = true;
        
        this.updateFilters();
        this.showToast('필터가 초기화되었습니다.', 'info');
    }

    async searchItems(query) {
        try {
            // 검색 API 호출
            const response = await this.apiCall('/api/shareplace/search', {
                method: 'POST',
                body: JSON.stringify({ query, filters: this.filters })
            });
            
            // 검색 결과 표시
            this.displaySearchResults(response.results);
            
        } catch (error) {
            console.error('검색 오류:', error);
            this.showError('검색 중 오류가 발생했습니다.');
        }
    }

    async showChargeModal(itemId, defaultSeconds = 60) {
        // 아이템 정보 가져오기
        const item = await this.getItemInfo(itemId);
        
        const modalOverlay = document.getElementById('chargeModalOverlay');
        const modal = document.getElementById('chargeModal');
        
        if (!modalOverlay || !modal) return;
        
        // 모달 내용 설정
        modal.innerHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-bolt"></i> TL 파일 충전</h3>
                <button class="btn-close" id="closeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="charge-preview">
                    <div class="preview-thumbnail">
                        ${item.thumbnail}
                    </div>
                    <div class="preview-info">
                        <h4>${item.title}</h4>
                        <div class="preview-artist">
                            <i class="fas fa-user"></i> ${item.artist}
                        </div>
                        <div class="preview-details">
                            <span>${item.format}</span>
                            <span>•</span>
                            <span>${this.formatDuration(item.duration)}</span>
                            <span>•</span>
                            <span class="tl-rate">${item.tlRate.toFixed(1)}x</span>
                        </div>
                    </div>
                </div>
                
                <div class="charge-options">
                    <h4>충전 시간 선택</h4>
                    <div class="options-grid">
                        ${this.generateChargeOptions(item.tlRate)}
                    </div>
                </div>
                
                <div class="wallet-info">
                    <div class="wallet-balance">
                        <span>내 지갑:</span>
                        <span class="balance-amount">${this.currentUser?.balance?.toLocaleString() || '0'} TL</span>
                    </div>
                    <div class="charge-summary">
                        <div class="summary-row">
                            <span>선택 시간:</span>
                            <span class="selected-time">1분</span>
                        </div>
                        <div class="summary-row">
                            <span>총 비용:</span>
                            <span class="total-cost">${Math.round(60 * item.tlRate)} TL</span>
                        </div>
                        <div class="summary-row total">
                            <span>충전 후 잔액:</span>
                            <span class="after-balance">${(this.currentUser?.balance || 0) - Math.round(60 * item.tlRate)} TL</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" id="cancelCharge">취소</button>
                <button class="btn btn-primary" id="confirmCharge">충전하기</button>
            </div>
        `;
        
        // 모달 표시
        modalOverlay.style.display = 'flex';
        
        // 모달 이벤트 바인딩
        this.bindModalEvents(item, defaultSeconds);
    }

    generateChargeOptions(tlRate) {
        const options = [
            { seconds: 60, label: '1분' },
            { seconds: 300, label: '5분' },
            { seconds: 600, label: '10분' },
            { seconds: 1800, label: '30분' },
            { seconds: 3600, label: '1시간' },
            { seconds: 7200, label: '2시간' }
        ];
        
        return options.map(opt => `
            <div class="charge-option" data-seconds="${opt.seconds}">
                <div class="option-time">${opt.label}</div>
                <div class="option-cost">${Math.round(opt.seconds * tlRate).toLocaleString()} TL</div>
                <div class="option-rate">(${tlRate.toFixed(1)}x)</div>
            </div>
        `).join('');
    }

    bindModalEvents(item, defaultSeconds) {
        const modalOverlay = document.getElementById('chargeModalOverlay');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelCharge');
        const confirmBtn = document.getElementById('confirmCharge');
        
        // 닫기 버튼
        const closeModal = () => {
            modalOverlay.style.display = 'none';
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        // 모달 외부 클릭 시 닫기
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        
        // 충전 옵션 선택
        document.querySelectorAll('.charge-option').forEach(option => {
            option.addEventListener('click', () => {
                const seconds = parseInt(option.dataset.seconds);
                this.updateChargeSummary(item, seconds);
            });
        });
        
        // 충전 확인
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
                try {
                    await this.processCharge(item, defaultSeconds);
                    closeModal();
                    this.showToast('충전이 완료되었습니다!', 'success');
                } catch (error) {
                    this.showError('충전 중 오류가 발생했습니다.');
                }
            });
        }
        
        // 초기 요약 업데이트
        this.updateChargeSummary(item, defaultSeconds);
    }

    updateChargeSummary(item, seconds) {
        const totalCost = Math.round(seconds * item.tlRate);
        const afterBalance = (this.currentUser?.balance || 0) - totalCost;
        
        // 업데이트 UI
        const selectedTime = document.querySelector('.selected-time');
        const totalCostEl = document.querySelector('.total-cost');
        const afterBalanceEl = document.querySelector('.after-balance');
        
        if (selectedTime) selectedTime.textContent = this.formatDuration(seconds);
        if (totalCostEl) totalCostEl.textContent = `${totalCost.toLocaleString()} TL`;
        if (afterBalanceEl) afterBalanceEl.textContent = `${afterBalance.toLocaleString()} TL`;
        
        // 충전 옵션 활성화 표시
        document.querySelectorAll('.charge-option').forEach(opt => {
            opt.classList.toggle('active', parseInt(opt.dataset.seconds) === seconds);
        });
    }

    async processCharge(item, seconds) {
        // 실제 결제 처리
        if (!this.currentUser) {
            throw new Error('로그인이 필요합니다.');
        }
        
        // API 호출
        await this.apiCall('/api/shareplace/charge', {
            method: 'POST',
            body: JSON.stringify({
                itemId: item.id,
                seconds: seconds,
                userId: this.currentUser.id
            })
        });
        
        // 사용자 잔액 업데이트
        if (window.authManager) {
            await authManager.updateBalance();
        }
    }

    // 유틸리티 함수들
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    getGenreName(genreId) {
        const genreMap = {
            'electronic': '일렉트로닉',
            'hiphop': '힙합',
            'jazz': '재즈',
            'lofi': 'Lo-fi',
            'ambient': '앰비언트'
        };
        return genreMap[genreId] || genreId;
    }

    async apiCall(endpoint, options = {}) {
        const url = `${this.apiBaseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.currentUser?.token) {
            headers['Authorization'] = `Bearer ${this.currentUser.token}`;
        }
        
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
        }
        
        return await response.json();
    }

    showToast(message, type = 'info') {
        // 간단한 토스트 메시지 구현
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    // 다른 메소드들...
}

// 글로벌 인스턴스 생성
window.shareplace = new ShareplaceManager();
