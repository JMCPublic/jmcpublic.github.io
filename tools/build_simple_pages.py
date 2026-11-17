"""Writes the live page of every simple Natural Wonders game into its own repo (the swap, 17 Nov 2026).

  ../natural-wonders-<game>/index.html   the simple game (engine /simple/simple.js, data /simple/data/<game>.js)
  ../natural-wonders-<game>/<lang>/       old language addresses: remember the language, open the game
  ../natural-wonders-masterbrain/         the daily finale

Run from the repo root after changing the template or a game's words:  python3 tools/build_simple_pages.py
"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
G = ROOT.parent

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
 'where-is-bigger': dict(name='Where is Bigger?', q='Which covers the most land?', noun='countries', icon='where-is-bigger', next='Next →',
                         intro='Three country shapes, not to scale. Which one covers the most land? Pick from three.'),
 'which-of-five': dict(name='Which of Three?', q='', noun='countries', icon='which-of-five', next='Next →',
                       intro='One country to beat and three challengers. Only one of them is bigger. Which?'),
 'how-many-borders': dict(name='How Many Borders?', q='', noun='countries', icon='how-many-borders', next='Next →',
                          intro='A country lights up on the map. How many countries does it touch by land? Pick from three.'),
}

TPL = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Natural Wonders · {name}</title>
<meta name="description" content="{intro} Ten a day, free, no sign-up.">
<link rel="canonical" href="https://twominute.games/natural-wonders-{key}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Two Minute Games">
<meta property="og:title" content="Natural Wonders · {name}">
<meta property="og:description" content="{intro}">
<meta property="og:url" content="https://twominute.games/natural-wonders-{key}/">
<meta property="og:image" content="https://twominute.games/og-v2.png">
<meta name="theme-color" content="#f6f3ec">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/icons/{icon}-180.png">
<link rel="manifest" href="/icons/m/{icon}-en.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,800&display=swap">
<link rel="stylesheet" href="/simple/simple.css?v={v}">
</head>
<body>
<!-- Natural Wonders, simple version (live 17 Nov 2026). The page is built by tools/build_simple_pages.py in jmcpublic.github.io; the classic version is at /shadow/classic/{key}/ -->
<div class="wrap" id="app"></div>
<script>const CFG={cfg};window.TMG_SIMPLE=1;window.TMG_GAME=CFG.key;</script>
{data}<script src="/simple/i18n.js?v={v}"></script>
<script src="/simple/simple.js?v={v}"></script>
<script src="/shared/adbox.js?v=7" defer></script>
<script src="/shared/reach.js?v=12" defer></script>
<script src="/shared/feedback.js?v=1" defer></script>
<script src="/shared/nwcount.js?v=1" defer></script>
</body>
</html>
"""
REDIRECT = """<!doctype html>
<html lang="{l}"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Natural Wonders</title>
<script>try{{localStorage.setItem('tmg-lang','{l}')}}catch(e){{}}location.replace('/natural-wonders-{key}/'+location.search+location.hash)</script>
<meta http-equiv="refresh" content="0; url=/natural-wonders-{key}/">
</head><body><a href="/natural-wonders-{key}/">Natural Wonders</a></body></html>
"""
import time
V = time.strftime('%m%d%H%M')   # one version for engine, words and style, so phones fetch them together
for key, c in SIMPLE.items():
    cfg = dict(c, key=key, home='/wonders/'); cfg.pop('icon')
    data = ROOT / 'simple' / 'data' / f'{key}.js'
    dv = int(data.stat().st_mtime)
    html = TPL.format(name=c['name'], intro=c['intro'], key=key, icon=c['icon'], v=V, cfg=json.dumps(cfg, ensure_ascii=False),
                      data=f'<script src="/simple/data/{key}.js?v={dv}"></script>\n')
    repo = G / f'natural-wonders-{key}'
    (repo / 'index.html').write_text(html)
    for l in ('de', 'tr', 'fr', 'es', 'pt'):
        d = repo / l
        if d.exists():
            for f in d.iterdir():
                if f.is_file(): f.unlink()
            (d / 'index.html').write_text(REDIRECT.format(l=l, key=key))
mb = {k: {x: v for x, v in c.items() if x in ('the', 'theRe')} for k, c in SIMPLE.items()}
mbv = max(int((ROOT / 'simple' / 'data' / f'{k}.js').stat().st_mtime) for k in SIMPLE)
cfg = dict(key='masterbrain', name='Masterbrain', q='', noun='questions', next='Next →', mb=mb, mbv=mbv, home='/wonders/',
           intro='The daily finale: one question from every Natural Wonders game, getting harder as you go.')
html = TPL.format(name='Masterbrain', intro=cfg['intro'], key='masterbrain', icon='masterbrain', v=V, cfg=json.dumps(cfg, ensure_ascii=False),
                  data='<script>var SG;</script>\n')
(G / 'natural-wonders-masterbrain' / 'index.html').write_text(html)
print('live pages written:', ', '.join(list(SIMPLE) + ['masterbrain']), '· version', V)
