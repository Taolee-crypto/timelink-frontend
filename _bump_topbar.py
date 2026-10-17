import io, os, re

files = []
for root, dirs, fnames in os.walk("public"):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.git')]
    for fn in fnames:
        if fn.endswith('.html'):
            files.append(os.path.join(root, fn))

# 새 버전 (현재 시각 기반)
import time
V = "20261016b"

count = 0
for path in files:
    with io.open(path, "r", encoding="utf-8", newline="") as f:
        content = f.read()
    if 'topbar-v2.js' not in content:
        continue
    # 기존 쿼리 제거 후 새 버전 추가
    new_content = re.sub(
        r'/_shared/topbar-v2\.js(\?v=[^"\']*)?',
        f'/_shared/topbar-v2.js?v={V}',
        content
    )
    if new_content != content:
        with io.open(path, "w", encoding="utf-8", newline="") as f:
            f.write(new_content)
        count += 1
        print(f"✅ {path}")

print(f"\n총 {count}개")
