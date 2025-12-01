// 비디오 아이템 로드
function loadVideoItems() {
    // 데모용 데이터 + 업로드된 파일
    const allVideoItems = [
        ...tubeFiles,
        { 
            id: 1, 
            title: '뮤직비디오 컬렉션', 
            purchasePrice: 2000, 
            duration: '10분',
            type: 'tl4',
            owner: 'TL Video',
            ownerId: 0,
            thumbnail: '🎬'
        },
        { 
            id: 2, 
            title: '라이브 공연 영상', 
            purchasePrice: 3000, 
            duration: '15분',
            type: 'tl4', 
            owner: 'TL Video',
            ownerId: 0,
            thumbnail: '🎵'
        }
    ];
    
    displayVideoItems(allVideoItems);
}

function displayVideoItems(items) {
    const videoGrid = document.getElementById('videoGrid');
    videoGrid.innerHTML = '';
    
    if (items.length === 0) {
        videoGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">TL Tube에 등록된 파일이 없습니다.</div>';
        return;
    }
    
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'video-item';
        itemEl.innerHTML = `
            <div class="video-thumbnail">${item.thumbnail || '🎬'}</div>
            <div class="item-content">
                <h3>${item.title}</h3>
                <p>${item.duration ? `재생 시간: ${item.duration} | ` : ''}가격: ${item.purchasePrice.toLocaleString()} TL</p>
                <div class="item-owner">저작권자: ${item.owner}</div>
                <button onclick="buyVideoItem(${item.tubeId || item.id})">구매하기</button>
            </div>
        `;
        videoGrid.appendChild(itemEl);
    });
}

// 비디오 아이템 구매
async function buyVideoItem(itemId) {
    const item = tubeFiles.find(f => f.tubeId === itemId) || 
                 tubeFiles.find(f => f.id === itemId);
    
    if (!item) {
        alert('아이템을 찾을 수 없습니다.');
        return;
    }
    
    if (currentUser.tl < item.purchasePrice) {
        alert('TL이 부족합니다.');
        return;
    }
    
    try {
        currentUser.tl -= item.purchasePrice;
        
        // 수익 분배 (55% 저작권자, 45% 플랫폼)
        const creatorEarnings = Math.floor(item.purchasePrice * 0.55);
        const platformEarnings = item.purchasePrice - creatorEarnings;
        
        // 통계 업데이트
        userStats.totalEarnings += item.purchasePrice;
        userStats.creatorShare += creatorEarnings;
        userStats.platformShare += platformEarnings;
        
        userStats.earningsHistory.push({
            date: new Date().toLocaleDateString(),
            item: item.title,
            amount: item.purchasePrice,
            creatorShare: creatorEarnings,
            platformShare: platformEarnings,
            type: 'tube'
        });
        
        // 파일을 사용자 라이브러리에 추가
        const purchasedFile = {
            ...item,
            id: Date.now(),
            playTime: 0,
            totalTime: 0,
            usedTime: 0,
            chargedTL: 0,
            uploaded: false,
            purchased: true,
            lastPosition: 0
        };
        
        userFiles.push(purchasedFile);
        
        updateUserDisplay();
        updateLibraryDisplay();
        updateFileSelect();
        updateStats();
        saveDataToStorage();
        
        alert('구매가 완료되었습니다! 파일이 라이브러리에 추가되었습니다.');
        
    } catch (error) {
        alert('구매 중 오류가 발생했습니다.');
        console.error('Buy error:', error);
    }
}
