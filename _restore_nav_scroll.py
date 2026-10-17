import io
path = r"public\sidebar.js"
with io.open(path, "r", encoding="utf-8", newline="") as f:
    c = f.read()

# NAV: overflow visible → auto, flex-grow 복원
old = ".tl-global-links{display:block!important;flex:1 1 auto;min-height:0;width:100%;margin:0!important;padding:8px 0 12px!important;overflow:visible!important;overscroll-behavior:contain}"
new = ".tl-global-links{display:block!important;flex:1 1 auto;min-height:0;width:100%;margin:0!important;padding:8px 0 12px!important;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain}"

if old in c:
    c = c.replace(old, new, 1)
    print("NAV overflow: visible → auto 복원: OK")
else:
    # 다른 형태 찾기
    import re
    m = re.search(r'\.tl-global-links\{[^}]*overflow[^}]*\}', c)
    if m:
        print("현재 NAV 규칙:", m.group())
        print("→ 수동 확인 필요")
    else:
        print("NAV 규칙 못 찾음")

# ASIDE: overflow auto → hidden (NAV가 스크롤하니까)
old2 = "overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:none!important;-ms-overflow-style:none!important;transform:none}"
new2 = "overflow:hidden!important;transform:none}"

if old2 in c:
    c = c.replace(old2, new2, 1)
    print("ASIDE overflow: auto → hidden: OK")
else:
    print("ASIDE 패턴 못 찾음")

with io.open(path, "w", encoding="utf-8", newline="") as f:
    f.write(c)
