TARGET = r'C:\Users\win11\Desktop\timelink-frontend\public\creator.html'

with open(TARGET, 'r', encoding='utf-8') as f:
    src = f.read()

OLD = "'<div class=\"mf-actions\"><button class=\"mf-btn\" onclick=\"location.href=\\'shareplace.html\\'\">보기</button>'+\n      '<button class=\"mf-btn del\" onclick=\"delShare(\\''+s.id+'\\',"

NEW = "'<div class=\"mf-actions\"><button class=\"mf-btn\" onclick=\"openEdit(\\''+s.id+'\\')\">\u270f\ufe0f \uc218\uc815</button>'+\n      '<button class=\"mf-btn del\" onclick=\"delShare(\\''+s.id+'\\',"

if OLD in src:
    src = src.replace(OLD, NEW, 1)
    with open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    print("OK: 수정 버튼 교체 완료")
else:
    print("NOT FOUND — 수동 확인 필요")
    # 776번째 줄 내용 출력
    lines = src.split('\n')
    for i, line in enumerate(lines):
        if 'mf-actions' in line and 'button' in line:
            print(f"Line {i+1}: {repr(line[:120])}")
