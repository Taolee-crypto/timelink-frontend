import re

path = r'C:\Users\win11\Desktop\timelink-frontend\public\creator.html'

with open(path, 'r', encoding='utf-8') as f:
    s = f.read()

before = s

# 깨진 마크다운 링크 패턴들을 올바른 CSS로 복원
# 패턴: .[클래스명](http://...) → .클래스명
s = re.sub(r'\.\[([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\]\(http://[^)]+\)', r'.\1.\2', s)
# 패턴: #[id명](http://...) → #id명  
s = re.sub(r'#\[([a-zA-Z0-9_-]+)\]\(http://[^)]+\)', r'#\1', s)

fixes = s.count('.file-selected.show') - before.count('.file-selected.show')
print(f"file-selected.show 수정: {s.count('.file-selected.show')}개 발견")
print(f"progressOverlay.show 수정: {s.count('#progressOverlay.show')}개 발견")
print(f"spotify-section.show 수정: {s.count('.spotify-section.show')}개 발견")

with open(path, 'w', encoding='utf-8') as f:
    f.write(s)

print("DONE")
