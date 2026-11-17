"""Builds the shadow site (twominute.games/shadow/), started 17 Nov 2026.

A private copy of the home page and the Natural Wonders page, same look and icons,
pointing at the simpler versions of the games. A game that has been reworked links to
its simple version (/shadow/<slug>/); every other game shows a Coming soon page.
No ads, no counting, hidden from search engines.

Run from the repo root after changing index.html or wonders/index.html:  python3 tools/build_shadow.py
"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
READY = {'rivers'}            # games that have a simple version so far
SIMPLE_TEXT = {
    'rivers': 'A river lights up on the map. Which one is it? Pick from three.',
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
