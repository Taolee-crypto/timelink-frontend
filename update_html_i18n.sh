#!/bin/bash
FILE="index.html"

# 다국어 키 매핑
declare -A translations=(
    ["로그인"]="login"
    ["회원가입"]="register" 
    ["TL Platform - 통합 웹3.0 플랫폼"]="welcome"
    ["홈"]="home"
    ["플랫폼"]="platforms"
    ["기능"]="features"
    ["마이페이지"]="mypage"
    ["광고관리"]="ads"
    ["TL STUDIO"]="studio"
    ["TL 뮤직마켓"]="music"
    ["TL 튜브"]="tube"
    ["© 2024 TL Platform. 모든 권리 보유."]="copyright"
)

# 백업 생성
cp "$FILE" "${FILE}.backup"

# 각 키에 대해 data-i18n 속성 추가
for kor in "${!translations[@]}"; do
    key="${translations[$kor]}"
    echo "처리 중: '$kor' -> data-i18n='$key'"
    
    # 정규식으로 텍스트 노드 찾아서 속성 추가
    # 주의: 이 방법은 간단한 경우에만 작동
    sed -i "s|>${kor}<| data-i18n=\"${key}\">${kor}<|g" "$FILE"
done

echo "완료: $FILE 업데이트"
