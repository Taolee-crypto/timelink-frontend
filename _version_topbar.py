import io, os, re

# 모든 HTML에서 topbar-v2.js 참조 찾기
files = []
for root, dirs, fnames in os.walk("public"):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.git')]
    for fn in fnames:
        if fn.endswith('.html'):
            files.append(os.path.join(root, fn))

count = 0
for path in files:
    with io.open(path, "r", encoding="utf-8", newline="") as f:
        content = f.read()
    if 'topbar-v2.js' not in content:
        continue
    # 쿼리 없으면 추가, 있으면 갱신
    new_content = re.sub(
        r'/_shared/topbar-v2\.js(\?v=[^"\']*)?',
        '/_shared/topbar-v2.js?v=20261016a',
        content
    )
    if new_content != content:
        with io.open(path, "w", encoding="utf-8", newline="") as f:
            f.write(new_content)
        count += 1
        print(f"✅ {path}")

print(f"\n총 {count}개 파일")
