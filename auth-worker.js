// Cloudflare Workers - Authentication Service
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request, env, ctx) {
        // CORS 처리
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // API 라우팅
            switch(path) {
                case '/api/send-verification':
                    return await handleSendVerification(request, env);
                case '/api/verify-code':
                    return await handleVerifyCode(request, env);
                case '/api/signup':
                    return await handleSignup(request, env);
                case '/api/login':
                    return await handleLogin(request, env);
                case '/api/check-email':
                    return await handleCheckEmail(request, env);
                case '/api/me':
                    return await handleGetUser(request, env);
                default:
                    return jsonResponse({ error: 'Not found' }, 404);
            }
        } catch (error) {
            console.error('Error:', error);
            return jsonResponse({ error: 'Internal server error' }, 500);
        }
    }
};

// 이메일 인증 코드 발송
async function handleSendVerification(request, env) {
    const { email } = await request.json();
    
    if (!email || !isValidEmail(email)) {
        return jsonResponse({ success: false, message: '유효하지 않은 이메일' }, 400);
    }
    
    // 인증 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10분
    
    // KV에 저장
    await env.VERIFICATIONS.put(email, JSON.stringify({
        code,
        expiresAt,
        verified: false,
        attempts: 0
    }), { expirationTtl: 600 });
    
    // 이메일 전송 (개발용: 콘솔 출력)
    console.log(`인증 코드 발송: ${email} - 코드: ${code}`);
    
    return jsonResponse({ 
        success: true, 
        message: '인증 코드가 발송되었습니다',
        code: code // 개발용 - 실제 서비스에서는 제거
    });
}

// 인증 코드 검증
async function handleVerifyCode(request, env) {
    const { email, code } = await request.json();
    
    if (!email || !code) {
        return jsonResponse({ success: false, message: '이메일과 코드를 입력해주세요' }, 400);
    }
    
    // KV에서 인증 정보 가져오기
    const verificationData = await env.VERIFICATIONS.get(email);
    if (!verificationData) {
        return jsonResponse({ success: false, message: '인증 요청을 찾을 수 없습니다' }, 404);
    }
    
    const data = JSON.parse(verificationData);
    
    // 만료 확인
    if (Date.now() > data.expiresAt) {
        await env.VERIFICATIONS.delete(email);
        return jsonResponse({ success: false, message: '인증 코드가 만료되었습니다' }, 400);
    }
    
    // 시도 횟수 확인
    if (data.attempts >= 5) {
        await env.VERIFICATIONS.delete(email);
        return jsonResponse({ success: false, message: '시도 횟수를 초과했습니다' }, 400);
    }
    
    // 코드 비교
    if (data.code === code) {
        // 인증 성공
        data.verified = true;
        await env.VERIFICATIONS.put(email, JSON.stringify(data), { expirationTtl: 3600 });
        
        return jsonResponse({ 
            success: true, 
            message: '이메일 인증이 완료되었습니다' 
        });
    } else {
        // 실패 시 시도 횟수 증가
        data.attempts++;
        await env.VERIFICATIONS.put(email, JSON.stringify(data), { expirationTtl: 600 });
        
        return jsonResponse({ 
            success: false, 
            message: '인증 코드가 일치하지 않습니다',
            attempts: data.attempts
        }, 400);
    }
}

// 회원가입 처리
async function handleSignup(request, env) {
    const { email, password, username, userType, walletAddress } = await request.json();
    
    // 필수 필드 검증
    if (!email || !password || !username) {
        return jsonResponse({ success: false, message: '필수 정보를 입력해주세요' }, 400);
    }
    
    // 이메일 인증 확인
    const verificationData = await env.VERIFICATIONS.get(email);
    if (!verificationData) {
        return jsonResponse({ success: false, message: '이메일 인증이 필요합니다' }, 400);
    }
    
    const verification = JSON.parse(verificationData);
    if (!verification.verified) {
        return jsonResponse({ success: false, message: '이메일 인증이 완료되지 않았습니다' }, 400);
    }
    
    // 이메일 중복 확인
    const existingUser = await env.USERS.get(email);
    if (existingUser) {
        return jsonResponse({ success: false, message: '이미 가입된 이메일입니다' }, 400);
    }
    
    // 사용자 생성
    const userId = generateUserId();
    const userData = {
        id: userId,
        email,
        username,
        passwordHash: await hashPassword(password),
        userType: userType || 'general',
        walletAddress: walletAddress || generateWalletAddress(),
        tlBalance: 10000,
        createdAt: Date.now(),
        emailVerified: true
    };
    
    // KV에 저장
    await env.USERS.put(email, JSON.stringify(userData));
    
    // JWT 토큰 생성
    const token = generateToken(userData);
    
    // 인증 데이터 삭제
    await env.VERIFICATIONS.delete(email);
    
    return jsonResponse({
        success: true,
        message: '회원가입이 완료되었습니다',
        token,
        user: {
            id: userId,
            email,
            username,
            userType: userData.userType,
            walletAddress: userData.walletAddress,
            tlBalance: 10000
        }
    });
}

// 로그인 처리
async function handleLogin(request, env) {
    const { email, password } = await request.json();
    
    if (!email || !password) {
        return jsonResponse({ success: false, message: '이메일과 비밀번호를 입력해주세요' }, 400);
    }
    
    // 사용자 조회
    const userData = await env.USERS.get(email);
    if (!userData) {
        return jsonResponse({ success: false, message: '존재하지 않는 계정입니다' }, 404);
    }
    
    const user = JSON.parse(userData);
    
    // 비밀번호 검증
    const inputHash = await hashPassword(password);
    if (user.passwordHash !== inputHash) {
        return jsonResponse({ success: false, message: '비밀번호가 일치하지 않습니다' }, 400);
    }
    
    // 토큰 생성
    const token = generateToken(user);
    
    return jsonResponse({
        success: true,
        message: '로그인 성공',
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            userType: user.userType,
            walletAddress: user.walletAddress,
            tlBalance: user.tlBalance
        }
    });
}

// 이메일 중복 확인
async function handleCheckEmail(request, env) {
    const { email } = await request.json();
    
    if (!email) {
        return jsonResponse({ success: false, message: '이메일을 입력해주세요' }, 400);
    }
    
    const existingUser = await env.USERS.get(email);
    
    return jsonResponse({
        success: true,
        available: !existingUser
    });
}

// 사용자 정보 조회
async function handleGetUser(request, env) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return jsonResponse({ success: false, message: '인증이 필요합니다' }, 401);
    }
    
    try {
        // 토큰 검증 (간단한 구현)
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        const userData = await env.USERS.get(payload.email);
        if (!userData) {
            return jsonResponse({ success: false, message: '사용자를 찾을 수 없습니다' }, 404);
        }
        
        const user = JSON.parse(userData);
        
        return jsonResponse({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                userType: user.userType,
                walletAddress: user.walletAddress,
                tlBalance: user.tlBalance
            }
        });
    } catch (error) {
        return jsonResponse({ success: false, message: '유효하지 않은 토큰' }, 401);
    }
}

// 유틸리티 함수들
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS
        }
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function generateToken(userData) {
    const payload = {
        userId: userData.id,
        email: userData.email,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7일
    };
    
    // 간단한 JWT 구현
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    const signature = 'dummy_signature'; // 실제로는 서명 필요
    
    return `${header}.${body}.${signature}`;
}

function generateWalletAddress() {
    return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(20)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}
