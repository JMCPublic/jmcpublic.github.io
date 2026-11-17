"""Builds the shadow site (twominute.games/shadow/).

17 Nov 2026, before the swap: a private copy of the home and Natural Wonders pages pointing at the new simple games.
17 Nov 2026, the swap: the simple games went live at their real addresses (pages written by tools/build_simple_pages.py),
and the shadow site now keeps the CLASSIC versions (copied to /shadow/classic/<game>/) for comparison.
No ads, no counting, hidden from search engines, linked from nowhere.

Run from the repo root after changing index.html or wonders/index.html:  python3 tools/build_shadow.py
"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
NOINDEX = '<meta name="robots" content="noindex, nofollow">'
BANNER = ('<div style="position:relative;z-index:5;background:#fff3e8;color:#16130f;font:600 13px Inter,system-ui,sans-serif;'
          'text-align:center;padding:7px 12px">🕰️ Shadow site · the classic versions (before 17 Nov 2026) · private, not linked anywhere</div>')


def common(s):
    s = re.sub(r'<script async src="https://pagead2\.googlesyndication\.com[^>]*>\s*</script>\s*', '', s)
    s = re.sub(r'<script src="/shared/(reach|adbox)\.js[^"]*"[^>]*></script>\s*', '', s)
    s = re.sub(r'<link rel="manifest"[^>]*>\s*', '', s)
    s = re.sub(r'<link rel="canonical"[^>]*>\s*', '', s)
    s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + NOINDEX, 1)
    s = re.sub(r'(<body[^>]*>)', r'\1\n' + BANNER, s, count=1)
    return s


# ---------- home page ----------
s = common((ROOT / 'index.html').read_text())
s = s.replace('<title>Two Minute Games', '<title>Shadow · Two Minute Games', 1)
s = s.replace('href="/wonders/"', 'href="/shadow/wonders/"')
s = s.replace('<a class="brand" href="/"', '<a class="brand" href="/shadow/"')
(ROOT / 'shadow' / 'index.html').write_text(s)

# ---------- Natural Wonders page: every game opens its classic version ----------
w = common((ROOT / 'wonders' / 'index.html').read_text())
w = w.replace('<title>', '<title>Shadow · ', 1)
w = w.replace('<a class="brand" href="/"', '<a class="brand" href="/shadow/"')
w = w.replace('<a href="/">← All games</a>', '<a href="/shadow/">← All games</a>')
w = w.replace("const B='/natural-wonders-';", "const B='/shadow/classic/';", 1)
w = w.replace('href="/natural-wonders-masterbrain/"', 'href="/shadow/classic/masterbrain/"')
(ROOT / 'shadow' / 'wonders').mkdir(exist_ok=True)
(ROOT / 'shadow' / 'wonders' / 'index.html').write_text(w)
print('shadow pages built: the classic versions')
