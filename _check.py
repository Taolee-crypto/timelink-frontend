import io, re
with io.open("_live.html", "r", encoding="utf-8", errors="replace") as f:
    html = f.read()

pattern = re.compile(r"<script\b([^>]*)>(.*?)</script>", re.DOTALL)
for i, m in enumerate(pattern.finditer(html)):
    attrs = m.group(1)
    body = m.group(2)
    src_match = re.search(r'\bsrc\s*=\s*["\']([^"\']+)', attrs)
    line = html[:m.start()].count("\n") + 1
    print(f"script {i} (line {line}): src={src_match.group(1) if src_match else '(inline)'}, {len(body)} bytes")
    if not src_match and body.strip():
        with io.open(f"_live_inl_{i}.js", "w", encoding="utf-8") as f:
            f.write(body)
