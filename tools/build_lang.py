#!/usr/bin/env python3
"""Build translated Aperture and Aperture Landmarks pages (12 Nov 2026; replaces build_lm_de.py).

   python3 tools/build_lang.py                 every game in every language that has text in tools/i18n/
   python3 tools/build_lang.py landmarks tr    one game, one language
   python3 tools/build_lang.py --report ...    also list every English string that matched nowhere

   Text lives in tools/i18n/<lang>.py:
     LOCALE           date format, e.g. "de-DE"
     UI               [(English, translation)] shared by both games; applied longest first
     LM, LM_POOL, LM_Q, LM_OTD      Landmarks: names and answers, word list, quotes, On this day
     AP, AP_POOL, AP_Q, AP_OTD      Aperture: the same for the everyday objects
   A game is built for a language only when its data is there. The list of built languages is written into
   window.TMG_AV in every page head, so the language switch, the offer and the redirect stay in step."""
import importlib, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'i18n'))
LANGS = ['de', 'tr', 'fr', 'es', 'pt']
GAMES = {'landmarks': '/aperture/landmarks/', 'aperture': '/aperture/'}
CARD = {('landmarks', 'de'): 'https://twominute.games/de/landmarks/card-v1.png'}

def js(o): return json.dumps(o, ensure_ascii=False)

def load(lang):
    try: return importlib.import_module(lang)
    except ModuleNotFoundError: return None

def has(T, game): return T is not None and hasattr(T, 'LM' if game == 'landmarks' else 'AP')

def available():
    av = {g: [] for g in GAMES}
    for l in LANGS:
        T = load(l)
        for g in GAMES:
            if has(T, g): av[g].append(l)
    return av

def swap(s, name, data, end=';\n'):
    i = s.index('const ' + name + '='); j = s.index(end, i) + (len(end) - 2 if end != ';\n' else 0)
    return s[:i] + 'const ' + name + '=' + js(data) + s[j:]

def build(game, lang, src, dst, av):
    T = load(lang); s = open(os.path.join(ROOT, src), encoding='utf-8').read()
    B, O = GAMES[game], GAMES['aperture' if game == 'landmarks' else 'landmarks']
    report = []
    # 1. words on screen, longest first so longer phrases win over the words inside them
    for en, tr in sorted(T.UI, key=lambda p: -len(p[0])):
        n = s.count(en)
        if n: s = s.replace(en, tr)
        report.append((n, en))
    # 2. links and page head
    L = lang
    rep = [('<html lang="en">', f'<html lang="{L}">'),
           (f"location.replace('{B}mobile/'", f"location.replace('{B}{L}/mobile/'"),
           (f'https://twominute.games{B}?desktop=1', f'https://twominute.games{B}{L}/?desktop=1'),
           (f'https://twominute.games{B}mobile/', f'https://twominute.games{B}{L}/mobile/'),
           (f'href="https://twominute.games{B}"', f'href="https://twominute.games{B}{L}/"'),
           (f'content="https://twominute.games{B}"', f'content="https://twominute.games{B}{L}/"'),
           (f'href="{B}"', f'href="{B}{L}/"'),
           ('\\ntwominute.games' + B.rstrip('/') + '`', '\\ntwominute.games' + B + L + '`'),
           ('"href": "/natural-wonders-where-is-bigger/"', f'"href": "/natural-wonders-where-is-bigger/{L}/"')]
    other = 'aperture' if game == 'landmarks' else 'landmarks'
    if L in av[other]: rep.append((f'"href": "{O}"', f'"href": "{O}{L}/"'))
    if (game, L) in CARD: rep.append(('https://twominute.games/og-landmarks.png', CARD[(game, L)]))
    for a, b in rep: s = s.replace(a, b)
    # 3. game data
    if game == 'landmarks':
        anchor = "/* load a landmark's photo once"
        assert s.count(anchor) == 1, 'landmarks anchor'
        lm = {k: {'t': v[0], 'p': v[1], 'a': v[2]} for k, v in T.LM.items()}
        s = s.replace(anchor, f"/* {L} names and answers (tools/build_lang.py) */\nconst TR_LM=" + js(lm) +
                      ";\nOBJECTS.forEach(o=>{const d=TR_LM[o.title];if(d){o.answer=d.a;o.name=d.p+d.t;o.tde=d.t}});\n" + anchor, 1)
        pool, Q, otd = T.LM_POOL, T.LM_Q, T.LM_OTD
    else:
        i = s.index('const OBJECTS=['); j = s.index('\n];\n', i) + 4
        ap = {k: {'n': v[0], 'a': v[1]} for k, v in T.AP.items()}
        s = s[:j] + f"/* {L} names and answers (tools/build_lang.py) */\nconst TR_AP=" + js(ap) + \
            ";\nOBJECTS.forEach(o=>{const d=TR_AP[o.name];if(d){o.answer=d.a;o.name=d.n}});\n" + s[j:]
        pool, Q, otd = T.AP_POOL, T.AP_Q, T.AP_OTD
    i = s.index('const POOL=('); j = s.index(';\n', i)
    s = s[:i] + "const POOL=(" + js(' '.join(pool)) + ").split(/\\s+/).filter(Boolean)" + s[j:]
    for name, key in (('Q_OPEN', 'open'), ('Q_CLOSE', 'close'), ('Q_STAR', 'star')):
        i = s.index('const ' + name + '='); j = s.index(';\n', i)
        s = s[:i] + 'const ' + name + '=' + js(Q[key]) + s[j:]
    i = s.index('const OTD='); j = s.index('};', i) + 1
    s = s[:i] + 'const OTD=' + js(otd) + s[j:]
    s = s.replace("toLocaleDateString('en-GB'", f"toLocaleDateString('{T.LOCALE}'")
    # 4. translated labels run longer: keep the desktop help buttons inside their card
    if '/mobile/' not in src:
        k = s.index('</style>')
        s = s[:k] + '.asks{grid-template-columns:auto auto auto}.ask{font-size:12px;padding:8px 6px}.ask small{margin-left:3px}\n' + s[k:]
    out = os.path.join(ROOT, dst); os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(s)
    return report

def set_av(av):
    """write the language list into every page head (English sources and the built pages)"""
    tag = 'window.TMG_AV=' + js(av) + ';'
    files = []
    for g, B in GAMES.items():
        for l in [''] + av[g]:
            for m in ('', 'mobile/'):
                files.append(os.path.join(ROOT, B.strip('/'), l, m, 'index.html'))
    for f in files:
        if not os.path.exists(f): continue
        s = open(f, encoding='utf-8').read()
        s2 = re.sub(r'window\.TMG_AV=\{.*?\};', tag, s, count=1)
        if s2 != s: open(f, 'w', encoding='utf-8').write(s2)

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    want_report = '--report' in sys.argv
    games = [args[0]] if args else list(GAMES)
    langs = [args[1]] if len(args) > 1 else LANGS
    av = available()
    set_av(av)   # sources first, so the built pages copy the right list
    for g in games:
        B = GAMES[g].strip('/')
        for l in langs:
            if l not in av[g]: continue
            r1 = build(g, l, f'{B}/index.html', f'{B}/{l}/index.html', av)
            r2 = build(g, l, f'{B}/mobile/index.html', f'{B}/{l}/mobile/index.html', av)
            miss = [en for (n1, en), (n2, _) in zip(r1, r2) if n1 == 0 and n2 == 0]
            print(f'{g:9} {l}: built ({len(r1)-len(miss)} of {len(r1)} strings used)')
            if want_report:
                for en in miss: print('    unused:', en[:80])
    set_av(av)
    print('languages:', av)
