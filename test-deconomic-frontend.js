// test-deconomic-frontend.js
const DECONOMIC_API = "https://deconomic-api.timelink-api.workers.dev";

// 간단한 테스트 함수
async function testDeconomicAPI() {
  console.log("=== Deconomic API 프론트엔드 테스트 ===");
  
  // 1. 헬스 체크
  try {
    const health = await fetch(`${DECONOMIC_API}/health`).then(r => r.json());
    console.log("✅ API 건강 상태:", health.status);
  } catch (e) {
    console.error("❌ API 연결 실패:", e);
    return;
  }
  
  // 2. 테스트 사용자 생성
  const testEmail = `test${Date.now()}@deconomic.com`;
  const userData = {
    email: testEmail,
    username: "Deconomic테스트"
  };
  
  try {
    const signup = await fetch(`${DECONOMIC_API}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(r => r.json());
    
    if (signup.success) {
      console.log("✅ 사용자 생성 성공!");
      console.log("   TL 잔액:", signup.user.tlBalance, "TL");
      console.log("   세션 ID:", signup.sessionId);
      
      // 3. 디지털 자산 생성 테스트
      const assetData = {
        title: "프론트엔드 테스트 음악",
        fileType: "audio",
        uploaderEmail: testEmail
      };
      
      const asset = await fetch(`${DECONOMIC_API}/api/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
      }).then(r => r.json());
      
      if (asset.success) {
        console.log("✅ 디지털 자산 생성 성공!");
        console.log("   자산 ID:", asset.asset.id);
        console.log("   TL 타입:", asset.asset.tlType);
        
        // 4. TL 충전 테스트
        const chargeData = {
          email: testEmail,
          amount: 1000,
          assetId: asset.asset.id
        };
        
        const charge = await fetch(`${DECONOMIC_API}/api/tl/charge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chargeData)
        }).then(r => r.json());
        
        if (charge.success) {
          console.log("✅ TL 충전 성공!");
          console.log("   충전 메시지:", charge.message);
          console.log("   자산 상태:", charge.asset.status);
        }
      }
    }
  } catch (e) {
    console.error("❌ 테스트 실패:", e);
  }
}

// 테스트 실행
testDeconomicAPI();
