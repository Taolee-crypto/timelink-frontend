import io, json

# 번역 파일 로드
with io.open("_translated_batch1.json", "r", encoding="utf-8") as f:
    translations = json.load(f)

print(f"번역: {len(translations)}개")

# i18n.js에 추가 (AUTO_KO_EN 확장)
path = r"public\i18n.js"
with io.open(path, "r", encoding="utf-8", newline="") as f:
    content = f.read()

# 이미 있나
if '/* ── 자동 번역 확장 (2026-10-16) ── */' in content:
    print("SKIP: 이미 병합됨")
    raise SystemExit(0)

# AUTO_KO_EN = { ... } 뒤에 확장 추가
# 가장 안전: "var AUTO_KO_EN={" 시작 부분 찾고, 그 뒤에 삽입
anchor = "var AUTO_KO_EN={"
idx = content.find(anchor)
if idx == -1:
    print("FAIL: AUTO_KO_EN 못 찾음")
    raise SystemExit(1)

# Object.assign(AUTO_KO_EN, { ... }); 형태로 추가
ext = "/* ── 자동 번역 확장 (2026-10-16) ── */\n"
ext += "Object.assign(AUTO_KO_EN," + json.dumps(translations, ensure_ascii=False, indent=0) + ");\n"

# AUTO_KO_EN 닫는 지점 뒤에 (또는 그 앞에)
# 간단히: 내용 맨 앞 (IIFE 안) 에 삽입
# 하지만 AUTO_KO_EN 정의 전에 넣으면 안 됨
# 따라서 "var AUTO_KO_EN" 시작 전에 삽입하는 게 아니라
# AUTO_KO_EN의 끝 (};) 다음에 삽입

# "var AUTO_KO_EN={...};" 패턴 찾기 (여러 줄)
# 안전: "var AUTO_KO_EN={" 시작점에서 "};" 찾기
end_idx = content.find("};", idx)
if end_idx == -1:
    print("FAIL: AUTO_KO_EN 끝 못 찾음")
    raise SystemExit(1)

# 닫는 }; 다음에 삽입
insert_at = end_idx + 2  # }; 다음
new_content = content[:insert_at] + "\n" + ext + content[insert_at:]

with io.open(path, "w", encoding="utf-8", newline="") as f:
    f.write(new_content)

print("✅ i18n.js에 603개 번역 추가")
