#!/bin/bash
FILE="index.html"

# 기존 스크립트 태그 제거 (간단한 버전)
sed -i '/<script src="js\/config.js"/d' "$FILE"
sed -i '/<script src="js\/language.js"/d' "$FILE"

# 올바른 위치에 스크립트 추가 (</body> 태그 직전)
sed -i '/<\/body>/i\
    <script src="js/language.js"></script>\
    <script src="js/config.js"></script>\
    <script>\
    document.addEventListener("DOMContentLoaded", function() {\
        console.log("🚀 TL Platform 초기화 시작");\
        \
        // 언어 설정\
        const savedLang = localStorage.getItem("tl_language") || "ko";\
        if (typeof applyLanguage === "function") {\
            applyLanguage(savedLang);\
        }\
        \
        // API 초기화\
        if (typeof TLAPI !== "undefined") {\
            TLAPI.init().then(function(api) {\
                console.log("API 초기화 완료:", api.healthy ? "성공" : "실패");\
                \
                // 상태 표시 업데이트\
                const statusEl = document.getElementById("connection-status");\
                if (statusEl) {\
                    statusEl.textContent = api.healthy ? "✅ 연결됨" : "⚠️ 오프라인";\
                    statusEl.className = api.healthy ? "status-connected" : "status-offline";\
                }\
            }).catch(function(error) {\
                console.error("API 초기화 실패:", error);\
            });\
        }\
    });\
    </script>' "$FILE"

echo "스크립트 수정 완료"
