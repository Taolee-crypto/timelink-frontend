// dashboard.js - 대시보드 기능
class Dashboard {
    constructor() {
        this.charts = {};
        this.init();
    }
    
    async init() {
        console.log('대시보드 초기화');
        
        // 데이터 로드
        await this.loadStats();
        await this.loadActivity();
        await this.loadTracks();
        
        // 차트 초기화
        this.initCharts();
        
        // 이벤트 설정
        this.setupEventListeners();
        
        // 반응형 처리
        this.setupResponsive();
    }
    
    async loadStats() {
        try {
            // API에서 데이터 가져오기
            const response = await fetch('/api/user/stats');
            const data = await response.json();
            
            // 통계 업데이트
            this.updateStats(data);
        } catch (error) {
            console.log('API 호출 실패, 테스트 데이터 사용:', error);
            
            // 테스트 데이터
            const testData = {
                totalEarnings: 1250,
                totalUploads: 8,
                totalSales: 24,
                monthlyEarnings: 320,
                activeProjects: 3
            };
            
            this.updateStats(testData);
        }
    }
    
    updateStats(data) {
        const elements = {
            'total-earnings': `${data.totalEarnings} TL`,
            'total-uploads': data.totalUploads,
            'total-sales': data.totalSales,
            'monthly-earnings': `${data.monthlyEarnings} TL`,
            'active-projects': data.activeProjects
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
    }
    
    async loadActivity() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;
        
        const activities = [
            {
                icon: 'bi-cloud-upload-fill',
                text: '새 음원 "Midnight Dreams"을 업로드했습니다',
                time: '2시간 전',
                color: 'var(--primary)'
            },
            {
                icon: 'bi-cart-check-fill',
                text: '음원 "Summer Vibes"가 판매되었습니다 (+42 TL)',
                time: '어제',
                color: 'var(--success)'
            },
            {
                icon: 'bi-cash-coin',
                text: '120 TL 수익이 정산되었습니다',
                time: '3일 전',
                color: 'var(--warning)'
            },
            {
                icon: 'bi-heart-fill',
                text: '사용자가 내 음원을 좋아합니다에 추가했습니다',
                time: '1주 전',
                color: 'var(--danger)'
            },
            {
                icon: 'bi-star-fill',
                text: '음원 "Urban Flow"에 새 리뷰가 등록되었습니다',
                time: '2주 전',
                color: 'var(--secondary)'
            }
        ];
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background-color: ${activity.color}20; color: ${activity.color};">
                    <i class="bi ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
    
    async loadTracks() {
        const tracksList = document.getElementById('tracks-list');
        if (!tracksList) return;
        
        const tracks = [
            {
                title: 'Midnight Dreams',
                genre: 'Chillhop',
                plays: 1245,
                sales: 42,
                revenue: 168,
                date: '2일 전'
            },
            {
                title: 'Urban Flow',
                genre: 'Hip Hop',
                plays: 2876,
                sales: 68,
                revenue: 272,
                date: '1주 전'
            },
            {
                title: 'Summer Vibes',
                genre: 'Pop',
                plays: 3542,
                sales: 94,
                revenue: 376,
                date: '2주 전'
            },
            {
                title: 'Neon Lights',
                genre: 'Electronic',
                plays: 1987,
                sales: 37,
                revenue: 148,
                date: '3주 전'
            },
            {
                title: 'Ocean Breeze',
                genre: 'Ambient',
                plays: 1567,
                sales: 29,
                revenue: 116,
                date: '1개월 전'
            }
        ];
        
        tracksList.innerHTML = tracks.map(track => `
            <div class="track-item">
                <div class="track-cover">
                    <i class="bi bi-music-note-beamed"></i>
                </div>
                <div class="track-info">
                    <div class="track-title">${track.title}</div>
                    <div class="track-meta">${track.genre} • ${track.date}</div>
                </div>
                <div class="track-stats">
                    <div class="stat">
                        <div class="stat-value">${track.plays.toLocaleString()}</div>
                        <div class="stat-label">재생</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${track.sales}</div>
                        <div class="stat-label">판매</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${track.revenue} TL</div>
                        <div class="stat-label">수익</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    initCharts() {
        // 수익 차트
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            this.charts.revenue = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
                    datasets: [{
                        label: '월별 수익 (TL)',
                        data: [120, 190, 300, 250, 320, 280],
                        borderColor: 'var(--primary)',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'var(--primary)',
                        pointBorderColor: 'white',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                drawBorder: false,
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + ' TL';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'nearest'
                    }
                }
            });
        }
        
        // 장르 차트
        const genreCtx = document.getElementById('genreChart');
        if (genreCtx) {
            this.charts.genre = new Chart(genreCtx, {
                type: 'doughnut',
                data: {
                    labels: ['팝', '힙합', '일렉트로닉', '락', 'R&B', '기타'],
                    datasets: [{
                        data: [30, 25, 20, 10, 10, 5],
                        backgroundColor: [
                            'var(--primary)',
                            'var(--secondary)',
                            'var(--warning)',
                            'var(--success)',
                            'var(--danger)',
                            'var(--gray-400)'
                        ],
                        borderWidth: 0,
                        hoverOffset: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${percentage}% (${value}개)`;
                                }
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
        }
    }
    
    setupEventListeners() {
        // 차트 기간 선택
        const periodSelect = document.querySelector('.chart-period');
        if (periodSelect) {
            periodSelect.addEventListener('change', (e) => {
                console.log('기간 변경:', e.target.value);
                this.updateChartData(e.target.value);
            });
        }
        
        // 통계 카드 클릭 이벤트
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.classList[1]; // earnings, uploads 등
                console.log('통계 카드 클릭:', type);
                this.handleStatClick(type);
            });
        });
    }
    
    setupResponsive() {
        // 창 크기 변경 시 차트 크기 조정
        window.addEventListener('resize', () => {
            if (this.charts.revenue) {
                this.charts.revenue.resize();
            }
            if (this.charts.genre) {
                this.charts.genre.resize();
            }
        });
    }
    
    updateChartData(period) {
        console.log('차트 데이터 업데이트:', period);
        // 실제로는 API 호출로 데이터 가져와서 차트 업데이트
    }
    
    handleStatClick(type) {
        // 통계 카드 클릭 시 상세 정보 표시
        console.log('상세 정보 표시:', type);
        
        // 예: 모달 표시, 페이지 이동 등
        alert(`${type} 상세 정보 표시 준비 중...`);
    }
}

// 페이지 로드 시 대시보드 초기화
document.addEventListener('DOMContentLoaded', () => {
    // Chart.js가 로드되었는지 확인
    if (typeof Chart !== 'undefined') {
        window.dashboard = new Dashboard();
    } else {
        console.error('Chart.js가 로드되지 않았습니다.');
        // fallback으로 기본 기능만 실행
        const dashboard = new Dashboard();
        dashboard.loadStats();
        dashboard.loadActivity();
        dashboard.loadTracks();
    }
});
