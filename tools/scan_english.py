#!/usr/bin/env python3
"""List English-looking text left in a translated page: python3 tools/scan_english.py aperture/de/mobile/index.html"""
import re, sys
W = r"\b(the|you|your|and|of|to|tap|press|play|word|words|time|round|next|help|photo|today|skip|again|more|show|how|with|for|this|is|it|object|objects|everyday|thing|what|see|can|landmark|landmarks|solved|loading|copy|send|music|sound|zoom|reveal|picture|negative)\b"
for f in sys.argv[1:]:
    s = open(f, encoding='utf-8').read()
    for n in ['const OBJECTS=[', 'const TR_LM=', 'const TR_AP=', 'const POOL=(', 'const Q_OPEN=', 'const Q_CLOSE=', 'const Q_STAR=', 'const OTD=', 'const PROMOS=', 'const MONTHS=', 'const KINDS=']:
        if n in s:
            i = s.index(n); j = s.index('\n];' if n in ('const OBJECTS=[',) else ';\n', i); s = s[:i] + s[j:]
    s = re.sub(r'<script src[^>]*></script>|<svg.*?</svg>|/\*.*?\*/|<style>.*?</style>', ' ', s, flags=re.S)
    found = set()
    for m in re.finditer(r">([^<>{}]*[A-Za-z]{3,}[^<>{}]*)<", s):
        t = m.group(1).strip()
        if re.search(W, t, re.I) and len(t) < 200: found.add('HTML: ' + t)
    for m in re.finditer(r"(?:aria-label|placeholder|title|content|alt)=\"([^\"]{4,200})\"", s):
        t = m.group(1)
        if re.search(W, t, re.I): found.add('ATTR: ' + t)
    for m in re.finditer(r"(?<![\w$])(['`])((?:(?!\1).){4,200}?)\1", s):
        t = m.group(2)
        if ' ' in t and re.search(W, t) and not re.search(r'[=;{}]|=>|\(\)|querySelector|function|\.join|\.test|https?:|aria-|class=|style=', t): found.add('JS: ' + t)
    print('==', f, len(found))
    for t in sorted(found): print('  ', t[:170])
