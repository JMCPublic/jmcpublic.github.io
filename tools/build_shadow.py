"""Builds the shadow site (twominute.games/shadow/), started 17 Nov 2026.

A private copy of the home page and the Natural Wonders page, same look and icons,
pointing at the simpler versions of the games. A game that has been reworked links to
its simple version (/shadow/<slug>/); every other game shows a Coming soon page.
No ads, no counting, hidden from search engines.

Run from the repo root after changing index.html or wonders/index.html:  python3 tools/build_shadow.py
"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
READY = {'rivers', 'lakes', 'mountains', 'deserts', 'forests', 'bodies-of-water', 'river-cities'}  # games with a simple version
SIMPLE_TEXT = {
    'rivers': 'A river lights up on the map. Which one is it? Pick from three.',
    'lakes': 'A lake lights up on the map. Which one is it? Pick from three.',
    'mountains': 'A peak is marked on the map. Which mountain is it? Pick from three.',
    'deserts': 'A desert lights up on the map. Which one is it? Pick from three.',
    'forests': 'A forest is marked on the map. Which one is it? Pick from three.',
    'bodies-of-water': 'A sea, gulf or strait lights up on the map. What is it called? Pick from three.',
    'river-cities': 'A city on a great river is marked on the map. Which one is it? Pick from three.',
}
NOINDEX = '<meta name="robots" content="noindex, nofollow">'
BANNER = ('<div style="position:relative;z-index:5;background:#fff3e8;color:#16130f;font:600 13px Inter,system-ui,sans-serif;'
          'text-align:center;padding:7px 12px">🕶️ Shadow site · the simpler versions · private, not linked anywhere</div>')


def common(s):
    # no ads, no counting, no install-as-app, not indexed
    s = re.sub(r'<script async src="https://pagead2\.googlesyndication\.com[^>]*>\s*</script>\s*', '', s)
    s = re.sub(r'<script src="/shared/(reach|adbox)\.js[^"]*"[^>]*></script>\s*', '', s)
    s = re.sub(r'<link rel="manifest"[^>]*>\s*', '', s)
    s = re.sub(r'<link rel="canonical"[^>]*>\s*', '', s)
    s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + NOINDEX, 1)
    s = re.sub(r'(<body[^>]*>)', r'\1\n' + BANNER, s, count=1)
    return s


def link(slug):
    return f'/shadow/{slug}/' if slug in READY else f'/shadow/soon/?g={slug}'


# ---------- home page ----------
s = (ROOT / 'index.html').read_text()
s = common(s)
s = s.replace('<title>Two Minute Games', '<title>Shadow · Two Minute Games', 1)
s = s.replace('href="/aperture/landmarks/"', f'href="{link("landmarks")}"')
s = s.replace('href="/aperture/"', f'href="{link("aperture")}"')
s = s.replace('href="/wonders/"', 'href="/shadow/wonders/"')
s = s.replace('<a class="brand" href="/"', '<a class="brand" href="/shadow/"')
out = ROOT / 'shadow' / 'index.html'
out.parent.mkdir(exist_ok=True)
out.write_text(s)

# ---------- Natural Wonders page ----------
w = (ROOT / 'wonders' / 'index.html').read_text()
w = common(w)
w = w.replace('<title>', '<title>Shadow · ', 1)
w = w.replace('<a class="brand" href="/"', '<a class="brand" href="/shadow/"')
w = w.replace('href="/natural-wonders-masterbrain/"', f'href="{link("masterbrain")}"')
w = w.replace('<a href="/">← All games</a>', '<a href="/shadow/">← All games</a>')
for slug, t in SIMPLE_TEXT.items():
    w = re.sub(r"(\{n:'[^']+',slug:'" + slug + r"',ic:'[^']+',t:')[^']*'", lambda m: m.group(1) + t.replace("'", "’") + "'", w)
old = "<span class=\"play\">${g.soon?'Coming soon':'Play'}</span>`;"
new = "<span class=\"play\">${READY.has(g.slug)?'Play':'Coming soon'}</span>`;"
assert old in w, 'wonders play label changed: update build_shadow.py'
w = w.replace(old, new)
old = '<a class="g" href="${B+g.slug}/">${inner}</a>'
assert old in w, 'wonders link template changed: update build_shadow.py'
w = w.replace(old, '<a class="g${READY.has(g.slug)?\'\':\' later\'}" href="${READY.has(g.slug)?\'/shadow/\'+g.slug+\'/\':\'/shadow/soon/?g=\'+g.slug}">${inner}</a>')
w = w.replace("const B='/natural-wonders-';", "const B='/natural-wonders-';const READY=new Set(" + str(sorted(READY)).replace("'", '"') + ");", 1)
w = w.replace('</style>', '.g.later .play{opacity:.55}\n</style>', 1)
out = ROOT / 'shadow' / 'wonders' / 'index.html'
out.parent.mkdir(exist_ok=True)
out.write_text(w)
print('shadow pages built; ready:', ', '.join(sorted(READY)))

# ---------- simple game pages (17 Nov): one template, the engine in /shadow/simple.js ----------
SIMPLE = {
 'rivers': dict(name='Rivers', q='Which river is this?', noun='rivers', icon='rivers', the=True, next='Next river →',
                intro='A river lights up on the map. Which one is it? Pick from three.'),
 'lakes': dict(name='Lakes', q='Which lake is this?', noun='lakes', icon='lakes', theRe='Sea$', next='Next lake →',
               intro='A lake lights up on the map. Which one is it? Pick from three.'),
 'mountains': dict(name='Mountains', q='Which mountain is this?', noun='mountains', icon='mountains', next='Next mountain →',
                   intro='A peak is marked on the map. Which mountain is it? Pick from three.'),
 'deserts': dict(name='Deserts', q='Which desert is this?', noun='deserts', icon='deserts', the=True, next='Next desert →',
                 intro='A desert lights up on the map. Which one is it? Pick from three.'),
 'forests': dict(name='Forests', q='Which forest is this?', noun='forests', icon='forests', next='Next forest →',
                 theRe='^(Amazon|Congo|Black|New Forest|Sundarbans|Ardennes|Forest of|Borneo|Bwindi|Tongass|Hoh|Great|Gondwana|Lacandon|Landes|Hyrcanian|Daintree|Monteverde|El Yunque|Mau)',
                 intro='A forest is marked on the map. Which one is it? Pick from three.'),
 'bodies-of-water': dict(name='Bodies of Water', q='What is this called?', noun='seas, gulfs and straits', icon='bodies-of-water', the=True, next='Next one →',
                         intro='A sea, gulf or strait lights up on the map. What is it called? Pick from three.'),
 'river-cities': dict(name='River Cities', q='Which city is this?', noun='river cities', icon='river-cities', next='Next city →',
                      intro='A city on a great river is marked on the map. Which one is it? Pick from three.'),
}
import json as _json
TPL = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{name} (simple) · Shadow · Two Minute Games</title>
<meta name="theme-color" content="#f6f3ec">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/icons/{icon}-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,800&display=swap">
<link rel="stylesheet" href="/shadow/simple.css?v=4">
</head>
<body>
<div class="bar">🕶️ Shadow site · simple {name} · private test</div>
<div class="wrap" id="app"></div>
<script>const CFG={cfg};window.TMG_SIMPLE=1;window.TMG_GAME=CFG.key;</script>
<script src="data.js?v={ver}"></script>
<script src="/shadow/i18n.js?v=1"></script>
<script src="/shadow/simple.js?v=5"></script>
<script src="/shared/adbox.js?v=7" defer></script>
<script src="/shared/reach.js?v=10" defer></script>
<script src="/shared/feedback.js?v=1" defer></script>
<script src="/shared/nwcount.js?v=1" defer></script>
</body>
</html>
'''
for key, c in SIMPLE.items():
    cfg = dict(c, key=key); cfg.pop('icon')
    data = ROOT / 'shadow' / key / 'data.js'
    ver = int(data.stat().st_mtime) if data.exists() else 1
    (ROOT / 'shadow' / key).mkdir(exist_ok=True)
    (ROOT / 'shadow' / key / 'index.html').write_text(TPL.format(name=c['name'], icon=c['icon'], cfg=_json.dumps(cfg, ensure_ascii=False), ver=ver))
print('simple game pages:', ', '.join(SIMPLE))
