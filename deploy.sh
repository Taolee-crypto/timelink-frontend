#!/bin/bash
echo "🚀 TimeLink 배포 시작..."

# 1. 변경사항 확인
echo "변경된 파일들:"
git status --short

# 2. 모든 파일 추가
git add .

# 3. 커밋
COMMIT_MSG="복구: TL-MUSIC-PLACE 이미지 명령 직전 상태로 복구"
if [ -n "$1" ]; then
    COMMIT_MSG="$1"
fi
git commit -m "$COMMIT_MSG"

# 4. 원격 저장소에 푸시
echo "GitHub에 업로드..."
git push origin main

# 5. GitHub Pages 배포 확인
echo ""
echo "✅ 배포 완료!"
echo "🌐 웹사이트: https://timelink.digital"
echo "⏱️ GitHub Pages 배포는 1-2분 소요됩니다"
