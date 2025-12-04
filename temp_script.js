        // 시스템 상태 확인 함수
        async function checkSystemStatus() {
            console.log('시스템 상태 확인 시작...');
            
            const backendStatus = document.getElementById('backendStatus');
            const frontendStatus = document.getElementById('frontendStatus');
            const updateTime = document.getElementById('updateTime');
            
            // 요소 확인
            if (!backendStatus) {
                console.error('backendStatus 요소를 찾을 수 없습니다');
                return;
            }
            
            // 프론트엔드 상태 표시
            if (frontendStatus) {
                frontendStatus.textContent = '✅ 온라인';
                frontendStatus.className = 'status-value online';
            }
            
            // 업데이트 시간 표시
            if (updateTime) {
                updateTime.textContent = new Date().toLocaleString('ko-KR');
            }
            
            // 백엔드 상태 확인
            backendStatus.textContent = '확인 중...';
            backendStatus.className = 'status-value';
            
            try {
                console.log('백엔드 URL:', window.TLAPI?.baseURL || 'API 초기화 전');
                
                // TLAPI가 초기화되었는지 확인
                if (!window.TLAPI) {
                    console.warn('TLAPI가 아직 초기화되지 않았습니다');
                    backendStatus.textContent = '❌ API 초기화 실패';
                    backendStatus.className = 'status-value offline';
                    return;
                }
                
                const health = await window.TLAPI.checkHealth();
                console.log('백엔드 응답:', health);
                
                if (health.status === 'ok') {
                    backendStatus.textContent = '✅ 온라인';
                    backendStatus.className = 'status-value online';
                    
                    // 성공 메시지 (선택사항)
                    // alert('시스템이 정상적으로 작동 중입니다!');
                } else {
                    backendStatus.textContent = `❌ ${health.message || '연결 실패'}`;
                    backendStatus.className = 'status-value offline';
                    
                    // 오류 메시지 표시
                    const errorDiv = document.getElementById('errorMessage');
                    if (errorDiv) {
                        errorDiv.innerHTML = `
                            <div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 5px; margin-top: 10px;">
                                <strong>⚠️ 백엔드 연결 문제</strong><br>
                                ${health.message || '서버에 연결할 수 없습니다.'}<br>
                                URL: ${window.TLAPI.baseURL}
                            </div>
                        `;
                    }
                }
            } catch (error) {
                console.error('상태 확인 중 오류:', error);
                backendStatus.textContent = `❌ 오류: ${error.message.substring(0, 30)}...`;
                backendStatus.className = 'status-value offline';
                
                // 디버깅 정보 표시
                const debugInfo = document.getElementById('debugInfo');
                if (!debugInfo) {
                    const container = document.querySelector('.status-panel');
                    if (container) {
                        container.innerHTML += `
                            <div id="debugInfo" style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 5px; font-size: 0.9rem;">
                                <strong>디버깅 정보:</strong><br>
                                에러: ${error.message}<br>
                                API URL: ${window.TLAPI?.baseURL || 'API 없음'}<br>
                                시간: ${new Date().toISOString()}
                            </div>
                        `;
                    }
                }
            }
        }
        
        // 애플리케이션 시작 함수
        function startApp() {
            console.log('애플리케이션 시작');
            window.location.href = 'app.html';
        }
        
        // 페이지 로드 시 자동 상태 확인
        window.addEventListener('DOMContentLoaded', async function() {
            console.log('DOMContentLoaded 이벤트 발생');
            
            // TLAPI 초기화 대기
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 상태 확인 실행
            checkSystemStatus();
            
            // 10초마다 상태 확인 (선택사항)
            setInterval(checkSystemStatus, 10000);
        });
        
        // 개발자 모드 단축키
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                localStorage.clear();
                alert('개발자 모드: 로컬 저장소 초기화됨');
                location.reload();
            }
        });
        
        console.log('TL Platform v1.0.0 로드됨');
