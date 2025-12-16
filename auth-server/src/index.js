// Auth Server Worker - 인증 및 권한 관리
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const path = url.pathname;

    // 사용자 등록
    if (path === '/register' && request.method === 'POST') {
      return handleRegister(request, env);
    }

    // 로그인
    if (path === '/login' && request.method === 'POST') {
      return handleLogin(request, env);
    }

    // 토큰 갱신
    if (path === '/refresh' && request.method === 'POST') {
      return handleRefresh(request, env);
    }

    // 토큰 검증
    if (path === '/verify' && request.method === 'POST') {
      return handleVerify(request, env);
    }

    // 사용자 정보
    if (path.startsWith('/user/') && request.method === 'GET') {
      return handleUserInfo(request, env, url);
    }

    // TL 지갑 정보
    if (path.startsWith('/wallet/') && request.method === 'GET') {
      return handleWalletInfo(request, env, url);
    }

    return new Response('TL Auth Server API', {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// 사용자 등록
async function handleRegister(request, env) {
  try {
    const { email, password, username } = await request.json();
    
    if (!email || !password || !username) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    // 이메일 검증
    if (!isValidEmail(email)) {
      return jsonResponse({ error: 'Invalid email format' }, 400);
    }

    // 비밀번호 강도 검증
    if (!isStrongPassword(password)) {
      return jsonResponse({ error: 'Password too weak' }, 400);
    }

    // 중복 이메일 확인
    const existingUser = await env.USERS.get(`email:${email}`);
    if (existingUser) {
      return jsonResponse({ error: 'Email already registered' }, 409);
    }

    // 중복 사용자명 확인
    const existingUsername = await env.USERS.get(`username:${username}`);
    if (existingUsername) {
      return jsonResponse({ error: 'Username already taken' }, 409);
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);
    
    // 사용자 ID 생성
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 사용자 데이터 저장
    const userData = {
      userId,
      email,
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      role: 'user',
      tlBalance: 10000, // 초기 TL 잔액
      settings: {
        autoCharge: true,
        chargeThreshold: 30,
        defaultMultiplier: 1
      }
    };

    // 여러 키로 저장
    await env.USERS.put(`id:${userId}`, JSON.stringify(userData));
    await env.USERS.put(`email:${email}`, userId);
    await env.USERS.put(`username:${username}`, userId);

    // 지갑 생성
    await createUserWallet(userId, env);

    // 환영 이메일 전송 (비동기)
    ctx.waitUntil(sendWelcomeEmail(email, username, env));

    return jsonResponse({
      success: true,
      message: 'Registration successful',
      userId,
      nextStep: 'Please verify your email'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return jsonResponse({ error: 'Registration failed' }, 500);
  }
}

// 로그인 처리
async function handleLogin(request, env) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return jsonResponse({ error: 'Missing email or password' }, 400);
    }

    // 사용자 ID 조회
    const userId = await env.USERS.get(`email:${email}`);
    if (!userId) {
      return jsonResponse({ error: 'Invalid credentials' }, 401);
    }

    // 사용자 데이터 조회
    const userData = await env.USERS.get(`id:${userId}`, { type: 'json' });
    if (!userData) {
      return jsonResponse({ error: 'Invalid credentials' }, 401);
    }

    // 비밀번호 검증
    const passwordValid = await verifyPassword(password, userData.passwordHash);
    if (!passwordValid) {
      return jsonResponse({ error: 'Invalid credentials' }, 401);
    }

    // JWT 토큰 생성
    const tokens = await generateTokens(userId, userData.role, env);
    
    // 로그인 시간 업데이트
    userData.lastLogin = new Date().toISOString();
    await env.USERS.put(`id:${userId}`, JSON.stringify(userData));

    // 로그인 기록
    await recordLogin(userId, request.headers.get('CF-Connecting-IP'), env);

    return jsonResponse({
      success: true,
      message: 'Login successful',
      tokens,
      user: {
        userId,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        tlBalance: userData.tlBalance,
        settings: userData.settings
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse({ error: 'Login failed' }, 500);
  }
}

// 토큰 갱신
async function handleRefresh(request, env) {
  try {
    const { refreshToken } = await request.json();
    
    if (!refreshToken) {
      return jsonResponse({ error: 'Refresh token required' }, 400);
    }

    // 리프레시 토큰 검증
    const payload = await verifyRefreshToken(refreshToken, env);
    if (!payload) {
      return jsonResponse({ error: 'Invalid refresh token' }, 401);
    }

    // 새로운 액세스 토큰 생성
    const newAccessToken = await generateAccessToken(payload.userId, payload.role, env);

    return jsonResponse({
      success: true,
      accessToken: newAccessToken,
      expiresIn: 3600
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return jsonResponse({ error: 'Token refresh failed' }, 500);
  }
}

// 토큰 검증
async function handleVerify(request, env) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return jsonResponse({ error: 'Token required' }, 400);
    }

    const payload = await verifyAccessToken(token, env);
    
    if (!payload) {
      return jsonResponse({ valid: false }, 401);
    }

    // 사용자 정보 조회
    const userData = await env.USERS.get(`id:${payload.userId}`, { type: 'json' });
    
    if (!userData) {
      return jsonResponse({ valid: false }, 401);
    }

    return jsonResponse({
      valid: true,
      user: {
        userId: payload.userId,
        role: payload.role,
        username: userData.username,
        tlBalance: userData.tlBalance
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return jsonResponse({ error: 'Verification failed' }, 500);
  }
}

// 사용자 정보 조회
async function handleUserInfo(request, env, url) {
  try {
    const userId = url.pathname.split('/').pop();
    const authHeader = request.headers.get('Authorization');
    
    if (!userId) {
      return jsonResponse({ error: 'User ID required' }, 400);
    }

    // 인증 확인
    const authResult = await verifyAccessTokenFromHeader(authHeader, env);
    if (!authResult.valid || authResult.userId !== userId) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const userData = await env.USERS.get(`id:${userId}`, { type: 'json' });
    
    if (!userData) {
      return jsonResponse({ error: 'User not found' }, 404);
    }

    // 민감한 정보 제거
    delete userData.passwordHash;
    delete userData._internal;

    return jsonResponse({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('User info error:', error);
    return jsonResponse({ error: 'Failed to get user info' }, 500);
  }
}

// 지갑 정보 조회
async function handleWalletInfo(request, env, url) {
  try {
    const userId = url.pathname.split('/').pop();
    const authHeader = request.headers.get('Authorization');
    
    if (!userId) {
      return jsonResponse({ error: 'User ID required' }, 400);
    }

    // 인증 확인
    const authResult = await verifyAccessTokenFromHeader(authHeader, env);
    if (!authResult.valid || authResult.userId !== userId) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const walletData = await env.WALLETS.get(userId, { type: 'json' });
    
    if (!walletData) {
      return jsonResponse({ error: 'Wallet not found' }, 404);
    }

    // 거래 내역 가져오기
    const transactions = await getUserTransactions(userId, env);

    return jsonResponse({
      success: true,
      wallet: {
        ...walletData,
        transactions: transactions.slice(0, 10) // 최근 10개
      }
    });

  } catch (error) {
    console.error('Wallet info error:', error);
    return jsonResponse({ error: 'Failed to get wallet info' }, 500);
  }
}

// 헬퍼 함수들
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  // 최소 8자, 대문자, 소문자, 숫자, 특수문자
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
}

async function hashPassword(password) {
  // 실제 구현에서는 bcrypt나 Argon2 사용
  // Cloudflare Workers에서는 Web Crypto API 사용
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

async function generateTokens(userId, role, env) {
  const accessToken = await generateAccessToken(userId, role, env);
  const refreshToken = await generateRefreshToken(userId, env);
  
  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: 3600
  };
}

async function generateAccessToken(userId, role, env) {
  // JWT 액세스 토큰 생성
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    userId,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1시간
    iss: 'timelink-auth'
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = await signToken(`${encodedHeader}.${encodedPayload}`, env.JWT_SECRET);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

async function generateRefreshToken(userId, env) {
  // 리프레시 토큰 생성 (더 긴 유효기간)
  const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  
  await env.REFRESH_TOKENS.put(refreshToken, JSON.stringify({
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30일
  }), { expirationTtl: 30 * 24 * 60 * 60 });
  
  return refreshToken;
}

async function verifyAccessToken(token, env) {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    
    const header = JSON.parse(atob(encodedHeader));
    const payload = JSON.parse(atob(encodedPayload));
    
    // 서명 검증
    const expectedSignature = await signToken(`${encodedHeader}.${encodedPayload}`, env.JWT_SECRET);
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    // 만료 시간 검증
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

async function verifyRefreshToken(token, env) {
  const tokenData = await env.REFRESH_TOKENS.get(token, { type: 'json' });
  
  if (!tokenData) {
    return null;
  }
  
  const expiresAt = new Date(tokenData.expiresAt).getTime();
  if (expiresAt < Date.now()) {
    return null;
  }
  
  return {
    userId: tokenData.userId,
    role: 'user' // 기본 역할
  };
}

async function signToken(data, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataBuffer = encoder.encode(data);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, dataBuffer);
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function verifyAccessTokenFromHeader(authHeader, env) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false };
  }
  
  const token = authHeader.substring(7);
  const payload = await verifyAccessToken(token, env);
  
  if (!payload) {
    return { valid: false };
  }
  
  return {
    valid: true,
    userId: payload.userId,
    role: payload.role
  };
}

async function createUserWallet(userId, env) {
  const walletData = {
    userId,
    tlBalance: 10000,
    totalEarned: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    addresses: {
      main: `tl_${Math.random().toString(36).substr(2, 16)}`
    }
  };
  
  await env.WALLETS.put(userId, JSON.stringify(walletData));
}

async function recordLogin(userId, ip, env) {
  const loginRecord = {
    userId,
    ip,
    timestamp: new Date().toISOString(),
    userAgent: 'Unknown' // 실제 구현에서는 헤더에서 추출
  };
  
  await env.LOGIN_LOGS.put(`login_${Date.now()}_${userId}`, JSON.stringify(loginRecord));
}

async function getUserTransactions(userId, env) {
  const transactions = [];
  
  // 거래 내역 조회
  const txKeys = await env.TRANSACTIONS.list({ prefix: `user:${userId}:` });
  
  for (const key of txKeys.keys) {
    const tx = await env.TRANSACTIONS.get(key.name, { type: 'json' });
    if (tx) {
      transactions.push(tx);
    }
  }
  
  // 날짜순 정렬
  transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return transactions;
}

async function sendWelcomeEmail(email, username, env) {
  // 실제 구현에서는 SendGrid, Mailgun 등 사용
  console.log(`Welcome email sent to ${email} for user ${username}`);
}
