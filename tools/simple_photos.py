"""Adds photos of the real places to the simple games' data (18 Nov 2026).

Lakes: the 64 photos the classic Lakes had (natural-wonders-lakes/photos/<id>.jpg, credits from the classic page's PH table),
matched to the simple game's lakes by name. Each question gets "ph": [image path, author, licence, source page].
Run after tools/shadow_simple.py or tools/simple_ct.py:  python3 tools/simple_photos.py
"""
import json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
def load(game):
    p = ROOT / 'simple' / 'data' / f'{game}.js'; s = p.read_text(); i = s.index('={') + 1
    return p, s[:i], json.loads(s[i:].rstrip().rstrip(';'))
def save(p, head, data): p.write_text(head + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')

# Lakes
names = json.loads((ROOT / 'tools' / 'data' / 'lakes_photo_names.json').read_text())   # classic id -> lake name
cls = (ROOT / 'shadow' / 'classic' / 'lakes' / 'index.html').read_text()
i = cls.find('const PH='); PH = json.loads(cls[i + 9:cls.find('};', i) + 1])
by = {names[k]: k for k in PH if k in names}
p, head, d = load('lakes'); n = 0
for q in d['q']:
    k = by.get(q['a'])
    if k and (ROOT.parent / 'natural-wonders-lakes' / 'photos' / f'{k}.jpg').exists():
        a, lic, url = PH[k]; q['ph'] = [f'/natural-wonders-lakes/photos/{k}.jpg', a, lic, url]; n += 1
    else: q.pop('ph', None)
save(p, head, d); print(f'lakes: {n} of {len(d["q"])} with photos')

# Mountains (25 Nov 2026): one Wikimedia Commons photo per mountain (the lead photo of its Wikipedia article), shown straight from
# Wikimedia at 960 px wide, with the author, licence and file page as the credit. tools/data/mountains_photos.json: name -> [url, author, licence, page]
MP = json.loads((ROOT / 'tools' / 'data' / 'mountains_photos.json').read_text())
p, head, d = load('mountains'); n = 0
for q in d['q']:
    if q['a'] in MP: q['ph'] = MP[q['a']]; n += 1
    else: q.pop('ph', None)
save(p, head, d); print(f'mountains: {n} of {len(d["q"])} with photos')
