import io, re, json

# 스캔 결과 로드
with io.open("_ko_all.json", "r", encoding="utf-8") as f:
    data = json.load(f)

texts = data["texts"]
attrs = data["attrs"]

# 잘못된 추출 필터 (JS 코드 조각, 너무 긴 것)
def is_valid(t):
    if len(t) < 2 or len(t) > 60:
        return False
    # 코드 조각 (괄호, 세미콜론, =, )) 등
    if re.search(r'[(){}\[\];=]|=>|function|\'\'|""', t):
        return False
    # 이미 다국어 (en:, ja: 등 포함)
    if re.search(r"en\s*:|ja\s*:|zh\s*:|th\s*:|vi\s*:", t):
        return False
    # 언어 이름
    if t in ['en', 'ko', 'ja', 'zh', 'th', 'vi']:
        return False
    # URL or 경로
    if re.search(r'https?://|/api/|\.html|\.js|\.css', t):
        return False
    return True

valid_texts = [(t, c) for t, c in texts if is_valid(t)]
valid_attrs = [(t, c) for t, c in attrs if is_valid(t.split('] ', 1)[-1] if '] ' in t else t)]

print(f"유효 텍스트: {len(valid_texts)} (필터 전 {len(texts)})")
print(f"유효 속성: {len(valid_attrs)} (필터 전 {len(attrs)})")

# 저장
with io.open("_ko_filtered.json", "w", encoding="utf-8") as f:
    json.dump({
        "texts": valid_texts,
        "attrs": valid_attrs,
    }, f, ensure_ascii=False, indent=2)

print("\n상위 40개 유효 텍스트:")
for t, c in valid_texts[:40]:
    print(f"  [{c}] {t}")
