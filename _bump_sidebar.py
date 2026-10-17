import io, re, os

files = []
for root, dirs, fnames in os.walk("public"):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.git')]
    for fn in fnames:
        if fn.endswith('.html'):
            p = os.path.join(root, fn)
            with io.open(p, "r", encoding="utf-8", newline="") as f:
                if "sidebar.js" in f.read():
                    files.append(p)

print(f"대상 파일: {len(files)}개")
for f in files:
    print(f"  {f}")
print()

V = "20261016d"
count = 0
for path in files:
    with io.open(path, "r", encoding="utf-8", newline="") as f:
        c = f.read()
    new_c = re.sub(
        r'/sidebar\.js(\?v=[^"\']*)?',
        f'/sidebar.js?v={V}',
        c
    )
    if new_c != c:
        with io.open(path, "w", encoding="utf-8", newline="") as f:
            f.write(new_c)
        count += 1
        print(f"OK {os.path.basename(path)}")

print(f"\n총 {count}개 수정")
