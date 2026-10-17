import io, json, time
import requests
import urllib.parse

with io.open("_ko_filtered.json", "r", encoding="utf-8") as f:
    data = json.load(f)

texts = [t for t, c in data["texts"]]
print(f"번역 대상: {len(texts)}개")

result = {}
failed = []

# Google Translate 무료 웹 엔드포인트
BASE = "https://translate.googleapis.com/translate_a/single"

session = requests.Session()

def translate(text):
    try:
        params = {
            "client": "gtx",
            "sl": "ko",
            "tl": "en",
            "dt": "t",
            "q": text
        }
        r = session.get(BASE, params=params, timeout=10)
        if r.status_code != 200:
            return None
        data = r.json()
        # data[0] = [[번역, 원본, ...], ...]
        if data and data[0]:
            translated = "".join(part[0] for part in data[0] if part and part[0])
            return translated
        return None
    except Exception as e:
        return None

for i, t in enumerate(texts):
    if i % 50 == 0:
        print(f"[{i+1}/{len(texts)}] {t[:30]}...")
    tr = translate(t)
    if tr and tr != t:
        result[t] = tr
    else:
        failed.append(t)
    time.sleep(0.2)  # rate limit (5 req/s)

print(f"\n✅ 성공: {len(result)}")
print(f"❌ 실패: {len(failed)}")

with io.open("_translated_batch1.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

with io.open("_translate_failed.json", "w", encoding="utf-8") as f:
    json.dump(failed, f, ensure_ascii=False, indent=2)

print("저장: _translated_batch1.json")
print("저장: _translate_failed.json")
