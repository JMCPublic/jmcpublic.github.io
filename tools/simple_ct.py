"""Puts the translated clues and facts (tools/simple_ct/<game>.py) into the simple games' data (simple/data/<game>.js).

17 Nov 2026. Each question gets "ct": {lang: [clue, fact]}. The engine shows the player's language and falls back to English.
Run after tools/shadow_simple.py (which rebuilds the data files) or after editing a translation:  python3 tools/simple_ct.py
"""
import json, pathlib, importlib.util, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
for f in sorted((ROOT / 'tools' / 'simple_ct').glob('*.py')):
    game = f.stem.replace('_', '-')
    spec = importlib.util.spec_from_file_location(game, f); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    p = ROOT / 'simple' / 'data' / f'{game}.js'
    s = p.read_text(); i = s.index('={') + 1
    head, data = s[:i], json.loads(s[i:].rstrip().rstrip(';'))
    missing = []
    for q in data['q']:
        t = m.T.get(q['a'])
        if not t: missing.append(q['a']); q.pop('ct', None); continue
        q['ct'] = {l: list(v) for l, v in t.items()}
    p.write_text(head + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print(f'{game}: {len(data["q"]) - len(missing)} of {len(data["q"])} translated' + (f' · missing: {", ".join(missing)}' if missing else ''))
