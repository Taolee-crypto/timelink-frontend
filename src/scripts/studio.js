<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>STUDIO | TIMELINK - 콘텐츠 변환 플랫폼</title>
    
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- 공통 스타일 -->
    <link rel="stylesheet" href="studio.css">
    
    <!-- 스튜디오 전용 스타일 -->
    <style>
        /* 기존 studio.html의 스타일 중 studio.css로 이동하지 않은 부분 */
        /* 스튜디오 전용 스타일들 */
        
        /* Header 패딩 조정 (공통 헤더가 fixed이므로) */
        body {
            padding-top: 80px;
        }
        
        .studio-header {
            background: var(--gradient-dark);
            padding: 3rem 0 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 3rem;
            position: relative;
            overflow: hidden;
        }
        
        .header-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 50%, rgba(108, 99, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 212, 170, 0.1) 0%, transparent 50%);
        }
        
        .header-content {
            position: relative;
            z-index: 2;
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .studio-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .studio-icon {
            width: 50px;
            height: 50px;
            background: var(--gradient-primary);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
        }
        
        .studio-title {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(135deg, #FFFFFF, var(--tl-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        
        .studio-subtitle {
            font-size: 1.2rem;
            color: var(--tl-gray);
            margin-bottom: 2rem;
            line-height: 1.8;
        }
        
        .badge-grid {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 2rem;
        }
        
        .tl-badge {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .tl-badge:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
        }
        
        .tl-badge.crypto {
            background: linear-gradient(135deg, var(--tl-crypto), #7c4dff);
            color: white;
            border: none;
        }
        
        /* Conversion Process */
        .conversion-process {
            margin: 3rem 0;
            padding: 2rem;
            background: var(--gradient-card);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .process-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .process-header h2 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: white;
        }
        
        .process-header p {
            color: var(--tl-gray);
            max-width: 600px;
            margin: 0 auto;
        }
        
        .process-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .process-step {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .process-step:hover {
            transform: translateY(-5px);
            border-color: var(--tl-primary);
        }
        
        .step-number {
            position: absolute;
            top: 10px;
            left: 10px;
            width: 30px;
            height: 30px;
            background: var(--tl-primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .step-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--tl-primary), var(--tl-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .step-title {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            color: white;
        }
        
        .step-description {
            font-size: 0.9rem;
            color: var(--tl-gray);
        }
        
        /* File Upload Area */
        .upload-section {
            background: var(--gradient-card);
            border-radius: 20px;
            padding: 3rem;
            margin-bottom: 3rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .upload-zone {
            border: 3px dashed rgba(108, 99, 255, 0.3);
            border-radius: 20px;
            padding: 4rem 2rem;
            text-align: center;
            background: rgba(26, 26, 46, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .upload-zone:hover {
            border-color: var(--tl-secondary);
            background: rgba(54, 209, 220, 0.05);
        }
        
        .upload-zone.dragover {
            border-color: var(--tl-primary);
            background: rgba(0, 102, 255, 0.05);
        }
        
        .upload-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            display: block;
        }
        
        .upload-text h3 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: white;
        }
        
        .upload-text p {
            color: var(--tl-gray);
            margin-bottom: 1.5rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .file-input {
            display: none;
        }
        
        .upload-btn {
            background: var(--gradient-primary);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .upload-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 102, 255, 0.3);
        }
        
        /* File List */
        .file-list {
            margin-top: 2rem;
        }
        
        .file-item {
            display: flex;
            align-items: center;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
        }
        
        .file-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.2);
        }
        
        .file-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            background: var(--gradient-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-right: 1.5rem;
            flex-shrink: 0;
        }
        
        .file-info {
            flex: 1;
        }
        
        .file-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: white;
        }
        
        .file-details {
            display: flex;
            gap: 1.5rem;
            color: var(--tl-gray);
            font-size: 0.9rem;
        }
        
        .file-actions {
            display: flex;
            gap: 1rem;
        }
        
        .action-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }
        
        .action-btn:hover {
            background: var(--tl-primary);
            border-color: var(--tl-primary);
        }
        
        .action-btn.convert {
            background: var(--gradient-primary);
            border: none;
        }
        
        /* Copyright Form */
        .copyright-form {
            background: var(--gradient-card);
            border-radius: 20px;
            padding: 3rem;
            margin-bottom: 3rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .form-section {
            margin-bottom: 2.5rem;
        }
        
        .form-section h3 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: white;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.75rem;
            font-weight: 500;
            color: white;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .form-control {
            width: 100%;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-control:focus {
            outline: none;
            border-color: var(--tl-primary);
            background: rgba(0, 102, 255, 0.05);
        }
        
        .form-control::placeholder {
            color: var(--tl-gray);
        }
        
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: pointer;
            font-weight: 500;
        }
        
        .checkbox-label input[type="checkbox"] {
            width: 20px;
            height: 20px;
            accent-color: var(--tl-primary);
        }
        
        /* Time Settings */
        .time-settings {
            background: var(--gradient-card);
            border-radius: 20px;
            padding: 3rem;
            margin-bottom: 3rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .time-range {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .range-label {
            min-width: 150px;
            font-weight: 500;
        }
        
        .range-slider {
            flex: 1;
        }
        
        .slider {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            outline: none;
            -webkit-appearance: none;
        }
        
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            background: var(--gradient-primary);
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid white;
        }
        
        .time-display {
            font-family: 'Courier New', monospace;
            font-size: 1.5rem;
            color: var(--tl-secondary);
            text-align: center;
            padding: 1rem;
            background: rgba(0, 212, 170, 0.1);
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        
        /* Crypto Section */
        .crypto-section {
            background: var(--gradient-card);
            border-radius: 20px;
            padding: 3rem;
            margin-bottom: 3rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .crypto-animation {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            margin: 2rem 0;
        }
        
        .quantum-particles {
            position: relative;
            width: 150px;
            height: 150px;
        }
        
        .particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: var(--tl-secondary);
            border-radius: 50%;
            animation: float 2s infinite ease-in-out;
        }
        
        .particle:nth-child(1) {
            top: 20%;
            left: 20%;
            animation-delay: 0s;
        }
        
        .particle:nth-child(2) {
            top: 60%;
            left: 40%;
            animation-delay: 0.5s;
        }
        
        .particle:nth-child(3) {
            top: 30%;
            left: 70%;
            animation-delay: 1s;
        }
        
        .key-display {
            background: rgba(155, 93, 229, 0.1);
            border: 1px solid rgba(155, 93, 229, 0.3);
            border-radius: 10px;
            padding: 1.5rem;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            margin: 2rem 0;
        }
        
        .key-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .key-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .key-label {
            color: var(--tl-gray);
        }
        
        .key-value {
            color: var(--tl-secondary);
            word-break: break-all;
            text-align: right;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.2); }
        }
        
        /* Save Section */
        .save-section {
            background: var(--gradient-card);
            border-radius: 20px;
            padding: 3rem;
            margin-bottom: 3rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            text-align: center;
        }
        
        .tl-formats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .format-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 2rem 1rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .format-card:hover {
            background: rgba(0, 102, 255, 0.05);
            border-color: var(--tl-primary);
            transform: translateY(-5px);
        }
        
        .format-card.active {
            background: rgba(0, 102, 255, 0.1);
            border-color: var(--tl-primary);
        }
        
        .format-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            display: block;
        }
        
        .format-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: white;
        }
        
        .format-desc {
            font-size: 0.9rem;
            color: var(--tl-gray);
        }
        
        /* Action Buttons */
        .action-buttons {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .btn {
            padding: 1rem 2.5rem;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .btn-primary {
            background: var(--gradient-primary);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0, 102, 255, 0.3);
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-3px);
        }
        
        /* Footer */
        .studio-footer {
            text-align: center;
            padding: 3rem 0;
            color: var(--tl-gray);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .footer-links a {
            color: var(--tl-gray);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: var(--tl-secondary);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .container {
                padding: 0 1rem;
            }
            
            body {
                padding-top: 70px;
            }
            
            .studio-title {
                font-size: 2.2rem;
            }
            
            .process-steps {
                grid-template-columns: 1fr;
            }
            
            .upload-zone {
                padding: 3rem 1rem;
            }
            
            .file-actions {
                flex-direction: column;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .tl-formats {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .action-buttons {
                flex-direction: column;
                gap: 1rem;
            }
            
            .btn {
                width: 100%;
                justify-content: center;
            }
        }
        
        @media (max-width: 480px) {
            .tl-formats {
                grid-template-columns: 1fr;
            }
            
            .studio-title {
                font-size: 1.8rem;
            }
            
            .upload-section,
            .copyright-form,
            .time-settings,
            .crypto-section,
            .save-section {
                padding: 2rem 1rem;
            }
        }
        
        /* Status Messages */
        .status-message {
            padding: 1rem;
            border-radius: 10px;
            margin: 1rem 0;
            display: none;
            animation: fadeIn 0.3s ease;
        }
        
        .status-success {
            background: rgba(0, 212, 170, 0.1);
            color: var(--tl-secondary);
            border: 1px solid rgba(0, 212, 170, 0.3);
            display: block;
        }
        
        .status-error {
            background: rgba(239, 68, 68, 0.1);
            color: var(--tl-danger);
            border: 1px solid rgba(239, 68, 68, 0.3);
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* 텍스트 클래스 */
        .text-muted {
            color: var(--tl-gray);
            margin-bottom: 1.5rem;
        }
    </style>
</head>
<body>
    <!-- 공통 헤더 -->
    <header class="tl-header">
        <div class="header-container">
            <!-- 로고 -->
            <a href="index.html" class="tl-logo">
                <div class="tl-logo-icon">TL</div>
                <div class="tl-logo-text">TIMELINK</div>
            </a>

            <!-- 네비게이션 -->
            <nav class="tl-nav">
                <a href="studio.html" class="nav-link active">
                    <i class="fas fa-sliders-h"></i> <span>STUDIO</span>
                </a>
                <a href="shareplace.html" class="nav-link">
                    <i class="fas fa-store"></i> <span>SHAREPLACE</span>
                </a>
                <a href="tltube.html" class="nav-link">
                    <i class="fas fa-play-circle"></i> <span>TLTUBE</span>
                </a>
                <a href="tlmusic.html" class="nav-link">
                    <i class="fas fa-music"></i> <span>TLMUSIC</span>
                </a>
                <a href="cafe-radio.html" class="nav-link">
                    <i class="fas fa-broadcast-tower"></i> <span>CAFE RADIO</span>
                </a>
            </nav>

            <!-- 사용자 메뉴 -->
            <div class="user-section">
                <div class="tl-balance" id="tlBalance">
                    <div class="tl-icon">TL</div>
                    <span id="balanceAmount">0</span>
                </div>
                
                <div class="user-avatar" id="userAvatar">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        </div>
    </header>

    <!-- 스튜디오 헤더 -->
    <div class="studio-header">
        <div class="header-bg"></div>
        <div class="container">
            <div class="header-content">
                <div class="studio-logo">
                    <div class="studio-icon">
                        <i class="fas fa-sliders-h"></i>
                    </div>
                    <h1 class="studio-title">STUDIO</h1>
                </div>
                
                <p class="studio-subtitle">
                    음악, 영상, 이미지, 문서, 전자책을 TL 파일로 변환하는 통합 스튜디오<br>
                    CRYSTALS-DILITHIUM 양자내성 암호화로 보호되는 최고의 콘텐츠 변환 플랫폼
                </p>
                
                <div class="badge-grid">
                    <div class="tl-badge">
                        <i class="fas fa-music"></i> 음악 (TL3)
                    </div>
                    <div class="tl-badge">
                        <i class="fas fa-video"></i> 영상 (TL4)
                    </div>
                    <div class="tl-badge">
                        <i class="fas fa-image"></i> 이미지 (TLI)
                    </div>
                    <div class="tl-badge">
                        <i class="fas fa-file-alt"></i> 문서 (TLD)
                    </div>
                    <div class="tl-badge">
                        <i class="fas fa-book"></i> 전자책 (TLE)
                    </div>
                    <div class="tl-badge crypto">
                        <i class="fas fa-shield-alt"></i> 양자내성 암호화
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="container">
        <!-- Conversion Process -->
        <section class="conversion-process">
            <div class="process-header">
                <h2>5단계 TL 파일 변환 프로세스</h2>
                <p>간단한 5단계로 모든 콘텐츠를 안전한 TL 파일로 변환하세요</p>
            </div>
            
            <div class="process-steps">
                <div class="process-step">
                    <div class="step-number">1</div>
                    <div class="step-icon">
                        <i class="fas fa-file-upload"></i>
                    </div>
                    <h3 class="step-title">파일 업로드</h3>
                    <p class="step-description">음악, 영상, 이미지 등 원본 파일 업로드</p>
                </div>
                
                <div class="process-step">
                    <div class="step-number">2</div>
                    <div class="step-icon">
                        <i class="fas fa-copyright"></i>
                    </div>
                    <h3 class="step-title">저작권 정보</h3>
                    <p class="step-description">저작권자 정보 및 작품 메타데이터 입력</p>
                </div>
                
                <div class="process-step">
                    <div class="step-number">3</div>
                    <div class="step-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3 class="step-title">시간 충전</h3>
                    <p class="step-description">재생 시간 및 TL 승수 설정</p>
                </div>
                
                <div class="process-step">
                    <div class="step-number">4</div>
                    <div class="step-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h3 class="step-title">양자 암호화</h3>
                    <p class="step-description">CRYSTALS-DILITHIUM 암호화 적용</p>
                </div>
                
                <div class="process-step">
                    <div class="step-number">5</div>
                    <div class="step-icon">
                        <i class="fas fa-save"></i>
                    </div>
                    <h3 class="step-title">TL 파일 저장</h3>
                    <p class="step-description">TL3/TL4/TLI/TLD/TLE 형식으로 저장</p>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" id="startConversion">
                    <i class="fas fa-play"></i> 변환 시작하기
                </button>
                <button class="btn btn-secondary" id="viewTutorial">
                    <i class="fas fa-question-circle"></i> 튜토리얼 보기
                </button>
            </div>
        </section>

        <!-- File Upload Section -->
        <section class="upload-section" id="uploadSection">
            <h2><i class="fas fa-file-upload"></i> 파일 업로드 (1단계)</h2>
            <p class="text-muted">TL 파일로 변환할 원본 파일을 업로드하세요</p>
            
            <div class="upload-zone" id="uploadZone">
                <div class="upload-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <div class="upload-text">
                    <h3>파일을 드래그 앤 드롭하거나 클릭하여 선택</h3>
                    <p>MP3, WAV, MP4, PDF, JPEG, PNG 등 다양한 형식 지원</p>
                </div>
                <button class="upload-btn" id="uploadBtn">
                    <i class="fas fa-folder-open"></i> 파일 선택
                </button>
                <input type="file" class="file-input" id="fileInput" multiple>
            </div>
            
            <div class="file-list" id="fileList">
                <!-- 파일 목록이 여기에 동적으로 추가됨 -->
            </div>
            
            <div class="status-message" id="uploadStatus"></div>
        </section>

        <!-- Copyright Information Section -->
        <section class="copyright-form" id="copyrightSection" style="display: none;">
            <h2><i class="fas fa-copyright"></i> 저작권 정보 입력 (2단계)</h2>
            <p class="text-muted">저작권자 정보와 작품 메타데이터를 입력하세요</p>
            
            <div class="form-section">
                <h3><i class="fas fa-user-check"></i> 저작권자 정보</h3>
                
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="isCopyrightOwner">
                        <span>나는 이 작품의 저작권자입니다</span>
                    </label>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">
                            <i class="fas fa-user"></i> 작품명
                        </label>
                        <input type="text" class="form-control" id="artworkName" placeholder="작품 이름">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <i class="fas fa-user-tag"></i> 예술가 이름
                        </label>
                        <input type="text" class="form-control" id="artistName" placeholder="아티스트/작가 이름">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-tags"></i> 장르/카테고리
                    </label>
                    <input type="text" class="form-control" id="genre" placeholder="음악, 영상, 예술, 교육 등">
                </div>
            </div>
            
            <div class="form-section" id="detailedInfoSection" style="display: none;">
                <h3><i class="fas fa-info-circle"></i> 상세 정보 (저작권자용)</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">
                            <i class="fas fa-user-edit"></i> 작곡가/작사가
                        </label>
                        <input type="text" class="form-control" id="composer" placeholder="작곡가 이름">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <i class="fas fa-microphone"></i> 가수/성우
                        </label>
                        <input type="text" class="form-control" id="singer" placeholder="가수/성우 이름">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-calendar-alt"></i> 작품 생성일
                    </label>
                    <input type="date" class="form-control" id="creationDate">
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-align-left"></i> 작품 설명
                    </label>
                    <textarea class="form-control" id="description" rows="4" placeholder="작품에 대한 자세한 설명"></textarea>
                </div>
            </div>
            
            <div class="status-message" id="copyrightStatus"></div>
        </section>

        <!-- Time Settings Section -->
        <section class="time-settings" id="timeSection" style="display: none;">
            <h2><i class="fas fa-clock"></i> 시간 충전 설정 (3단계)</h2>
            <p class="text-muted">TL 파일의 재생 시간과 TL 차감 승수를 설정하세요</p>
            
            <div class="time-display" id="timeDisplay">
                1초 = 1TL (승수: 1.0x)
            </div>
            
            <div class="form-section">
                <h3><i class="fas fa-bolt"></i> TL 승수 설정</h3>
                
                <div class="time-range">
                    <div class="range-label">승수 배율: <span id="multiplierValue">1.0</span>x</div>
                    <div class="range-slider">
                        <input type="range" class="slider" id="multiplierSlider" min="0.5" max="3" step="0.1" value="1">
                    </div>
                </div>
                
                <p class="text-muted">
                    <i class="fas fa-info-circle"></i> 승수는 파일 재생 시 차감되는
