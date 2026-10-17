import io, re, os, json

# 모든 HTML + JS + CSS에서 한국어 추출
files = []
for root, dirs, fnames in os.walk("public"):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '_shared')]
    for fn in fnames:
        if fn.endswith(('.html', '.js', '.css')):
            files.append(os.path.join(root, fn))

skip_patterns = [
    r'<script[^>]*>.*?</script>',
    r'<style[^>]*>.*?</style>',
    r'/\*.*?\*/',
    r'//[^\n]*',
    r'<!--.*?-->',
]

all_texts = {}
html_attrs = {}  # alt, placeholder, title

ko_re = re.compile(r'[가-힣]')
text_re = re.compile(r'[가-힣][가-힣0-9A-Za-z\s·\.\,\!\?\-\:\/\+\%\~\→\←\(\)\[\]\'"]{1,100}')

for path in files:
    try:
        with io.open(path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()
    except:
        continue
    
    # 스크립트/스타일/주석 제거
    c = content
    for pat in skip_patterns:
        c = re.sub(pat, '', c, flags=re.DOTALL)
    
    # 태그 제거
    text_only = re.sub(r'<[^>]+>', ' ', c)
    text_only = re.sub(r'&[a-z#0-9]+;', ' ', text_only)
    
    # 텍스트 추출
    for m in text_re.finditer(text_only):
        t = m.group().strip().strip('"\'').strip()
        if 2 <= len(t) <= 100 and ko_re.search(t):
            all_texts[t] = all_texts.get(t, 0) + 1
    
    # HTML 속성 (alt, placeholder, title, aria-label)
    for attr in ['alt', 'placeholder', 'title', 'aria-label']:
        for m in re.finditer(attr + r'\s*=\s*["\']([^"\']*[가-힣][^"\']*)["\']', content):
            t = m.group(1).strip()
            if 2 <= len(t) <= 100:
                key = f'[{attr}] {t}'
                html_attrs[key] = html_attrs.get(key, 0) + 1

# 정렬 (빈도순)
texts_sorted = sorted(all_texts.items(), key=lambda x: (-x[1], x[0]))
attrs_sorted = sorted(html_attrs.items(), key=lambda x: (-x[1], x[0]))

with io.open("_ko_all.json", "w", encoding="utf-8") as f:
    json.dump({
        "texts": texts_sorted,
        "attrs": attrs_sorted,
        "total_texts": len(texts_sorted),
        "total_attrs": len(attrs_sorted)
    }, f, ensure_ascii=False, indent=2)

print(f"텍스트: {len(texts_sorted)}개")
print(f"속성: {len(attrs_sorted)}개")
print(f"\n상위 30개 텍스트:")
for t, c in texts_sorted[:30]:
    print(f"  [{c}] {t}")
print(f"\n상위 15개 속성:")
for t, c in attrs_sorted[:15]:
    print(f"  [{c}] {t}")
