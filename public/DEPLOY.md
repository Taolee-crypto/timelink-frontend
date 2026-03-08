# TimeLink 파일 구조 & 배포 가이드

## 📁 폴더 구조
```
timelink-frontend/
├── index.html          ← Admin 패널 (admin.timelink.digital)
├── admin.html          ← admin.html로도 접근 가능
├── public/
│   ├── index.html      ← 진짜 홈 랜딩 (timelink.digital)
│   ├── login.html
│   ├── signup.html
│   ├── onboarding.html
│   ├── dashboard.html
│   ├── shareplace.html ← 로그인 후 메인화면
│   ├── wallet.html
│   ├── creator.html
│   ├── cafe-owner.html
│   ├── radio.html
│   ├── creation-right-policy.html
│   ├── main.js
│   └── manifest.json
```

## 🚀 GitHub 배포 순서

```powershell
cd C:\Users\win11\Desktop\timelink-frontend

# 1. public/ 폴더에 파일 복사 (다운받은 public/ 폴더 통째로)
# 2. 루트에 index.html (admin) 복사

git add -A
git commit -m "feat: restructure - public/ user pages + root admin panel"
git push origin main
```

## 🌐 도메인 연결

| 도메인 | 파일 | 설명 |
|--------|------|------|
| timelink.digital | public/index.html | 랜딩 홈 |
| admin.timelink.digital | index.html (루트) | Admin 패널 |

## 🔗 페이지 흐름
```
/ (홈)
  ↓ 가입
signup.html → onboarding.html → dashboard.html
  ↓ 로그인
login.html → shareplace.html (메인)
  ↓ 탐색
shareplace.html → creator.html / wallet.html / radio.html / cafe-owner.html
```
