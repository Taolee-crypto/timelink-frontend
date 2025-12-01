// 마켓 아이템 로드
function loadMarketItems() {
    const marketGrid = document.getElementById('marketGrid');
    
    // 데모용 데이터 + 업로드된 파일
    const allMarketItems = [
        ...marketFiles,
        { 
            id: 1, 
            title: '인기 음원 팩', 
            purchasePrice: 5000, 
            description: '인기 있는 음원 10곡 세트', 
            type: 'tl3',
            owner: 'TL Music',
            ownerId: 0
        },
        { 
            id: 2, 
            title: '특별 음원', 
            purchasePrice: 3000, 
            description: '한정판 특별 음원', 
            type: 'tl3',
            owner: 'TL Music',
            ownerId: 0
        }
    ];
    
    displayMarketItems(allMarketItems);
}

function displayMarketItems(items) {
    const marketGrid = document.getElementById('marketGrid');
    marketGrid.innerHTML = '';
    
    if (items.length === 0) {
        marketGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">마켓에 등록된 파일이 없습니다.</div>';
        return;
    }
    
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'market-item';
        itemEl.innerHTML = `
            <div class="item-content">
                <h3>${item.title}</h3>
                <p>${item.description || '사용자가 업로드한 음원 파일'}</p>
                <div class="item-owner">저작권자: ${item.owner}</div>
                <div class="item-price">${item.purchasePrice.toLocaleString()} TL</div>
                <button onclick="buyMarketItem(${item.marketId || item.id})">구매하기</button>
            </div>
        `;
        marketGrid.appendChild(itemEl);
    });
}

// 마켓 아이템 구매
async function buyMarketItem(itemId) {
    const item = marketFiles.find(f => f.marketId === itemId) || 
                 marketFiles.find(f => f.id === itemId);
    
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
            type: 'market'
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
