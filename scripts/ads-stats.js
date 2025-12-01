// 광고 보기
function watchAd() {
    const adStatus = document.getElementById('adStatus');
    const watchAdBtn = document.getElementById('watchAdBtn');
    const adTimer = document.getElementById('adTimer');
    const adTimeLeft = document.getElementById('adTimeLeft');
    
    // 광고 시청 시작
    watchAdBtn.disabled = true;
    adTimer.style.display = 'block';
    
    let timeLeft = 30;
    adTimeLeft.textContent = timeLeft;
    
    const timer = setInterval(() => {
        timeLeft--;
        adTimeLeft.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            
            // 광고 보상 제공
            const reward = 50; // 50 TL 보상
            currentUser.tl += reward;
            
            // 수익 분배 (55% 저작권자, 45% 플랫폼)
            const creatorEarnings = Math.floor(reward * 0.55);
            const platformEarnings = reward - creatorEarnings;
            
            // 통계 업데이트
            userStats.totalEarnings += reward;
            userStats.creatorShare += creatorEarnings;
            userStats.platformShare += platformEarnings;
            
            userStats.earningsHistory.push({
                date: new Date().toLocaleDateString(),
                item: '광고 시청',
                amount: reward,
                creatorShare: creatorEarnings,
                platformShare: platformEarnings,
                type: 'ad'
            });
            
            updateUserDisplay();
            updateStats();
            saveDataToStorage();
            
            adStatus.textContent = `광고 시청 완료! ${reward} TL이 충전되었습니다.`;
            adStatus.className = 'status success';
            
            watchAdBtn.disabled = false;
            adTimer.style.display = 'none';
            
            // 다음 광고 준비
            setTimeout(() => {
                adStatus.textContent = '';
            }, 3000);
        }
    }, 1000);
}

// 통계 업데이트
function updateStats() {
    document.getElementById('totalEarnings').textContent = userStats.totalEarnings.toLocaleString();
    document.getElementById('creatorShare').textContent = userStats.creatorShare.toLocaleString();
    document.getElementById('platformShare').textContent = userStats.platformShare.toLocaleString();
    document.getElementById('uploadedFiles').textContent = userStats.uploadedFiles;
    
    // 수익 내역 표시
    const earningsList = document.getElementById('earningsList');
    earningsList.innerHTML = '';
    
    if (userStats.earningsHistory.length === 0) {
        earningsList.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">수익 내역이 없습니다.</div>';
        return;
    }
    
    userStats.earningsHistory.slice().reverse().forEach(earning => {
        const earningItem = document.createElement('div');
        earningItem.className = 'file-item';
        earningItem.innerHTML = `
            <div class="file-info">
                <div class="file-title">
                    ${earning.item}
                    <span class="file-type-badge">${earning.type === 'market' ? 'TL 마켓' : earning.type === 'tube' ? 'TL Tube' : '광고'}</span>
                </div>
                <div class="file-meta">
                    날짜: ${earning.date} | 
                    총 수익: ${earning.amount} TL |
                    저작권자: ${earning.creatorShare} TL (55%) |
                    플랫폼: ${earning.platformShare} TL (45%)
                </div>
            </div>
        `;
        earningsList.appendChild(earningItem);
    });
}
