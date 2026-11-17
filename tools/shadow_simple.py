"""Builds the data for every simple game on the shadow site (17 Nov 2026).

Questions come from tools/simple_banks.py; maps come from each full game's own data
(../natural-wonders-<game>/index.html), so every answer is checked against the real game.
Output: shadow/<game>/data.js  ->  const SG = {views:{...}, q:[...]}

  view  = {n: name shown on the map, w, h, land: SVG path, clip: clip lines to the land,
           sea: true if the highlight is water drawn under the land,
           extra: [{k:'line'|'water'|'dot', d|xy}]  (faint context: other rivers, other lakes, other cities)}
  q     = {a, w:[2 wrong], c: clue, f: fact, t: tier, v: view id, qq: question (optional),
           hl: {k:'line'|'area'|'pt', d|xy, ring:[x,y,r] when small}}

Run from the repo root:  python3 tools/shadow_simple.py
"""
import json, math, re, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import simple_banks as B

ROOT = pathlib.Path(__file__).resolve().parent.parent
GAMES_DIR = ROOT.parent


def load(game, name):
    s = (GAMES_DIR / f'natural-wonders-{game}' / 'index.html').read_text()
    i = s.index(f'const {name}=') + len(f'const {name}=')
    return json.JSONDecoder().raw_decode(s[i:])[0]


# ---------------- geometry helpers ----------------
def rdp(pts, eps):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; L = (dx * dx + dy * dy) ** .5
    i, dm = 0, 0
    for k in range(1, len(pts) - 1):
        px, py = pts[k]
        d = (abs(dy * px - dx * py + x2 * y1 - y2 * x1) / L) if L > 1e-6 else ((px - x1) ** 2 + (py - y1) ** 2) ** .5
        if d > dm: i, dm = k, d
    if dm <= eps: return [pts[0], pts[-1]]
    return rdp(pts[:i + 1], eps)[:-1] + rdp(pts[i:], eps)

def fmt(pts, close):
    return 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + ('Z' if close else '')

def simp_path(d, eps=0.5):
    out = []
    for ring in re.findall(r'M[^M]*', d):
        nums = list(map(float, re.findall(r'-?\d+(?:\.\d+)?', ring)))
        pts = list(zip(nums[::2], nums[1::2]))
        if len(pts) < 3: continue
        q = rdp(pts, eps)
        if len(q) >= 3: out.append(fmt(q, 'Z' in ring))
    return ''.join(out)

def path_bbox(d):
    nums = list(map(float, re.findall(r'-?\d+(?:\.\d+)?', d)))
    xs, ys = nums[::2], nums[1::2]
    return min(xs), min(ys), max(xs), max(ys)

def clip_ring(pts, x0, y0, x1, y1):
    """Sutherland-Hodgman clip of a closed ring to a rectangle."""
    def clip(poly, inside, inter):
        out = []
        for i in range(len(poly)):
            a, b = poly[i - 1], poly[i]
            if inside(b):
                if not inside(a): out.append(inter(a, b))
                out.append(b)
            elif inside(a): out.append(inter(a, b))
        return out
    def ix(a, b, x): t = (x - a[0]) / (b[0] - a[0]); return (x, a[1] + t * (b[1] - a[1]))
    def iy(a, b, y): t = (y - a[1]) / (b[1] - a[1]); return (a[0] + t * (b[0] - a[0]), y)
    p = pts
    for inside, inter in ((lambda q: q[0] >= x0, lambda a, b: ix(a, b, x0)), (lambda q: q[0] <= x1, lambda a, b: ix(a, b, x1)),
                          (lambda q: q[1] >= y0, lambda a, b: iy(a, b, y0)), (lambda q: q[1] <= y1, lambda a, b: iy(a, b, y1))):
        if not p: break
        p = clip(p, inside, inter)
    return p


class Proj:
    """Equirectangular projection of a lon/lat box onto a 520-wide map."""
    W = 520
    def __init__(self, box):
        self.l0, self.b0, self.l1, self.b1 = box
        self.k = math.cos(math.radians((self.b0 + self.b1) / 2))
        self.s = self.W / ((self.l1 - self.l0) * self.k)
        self.h = round((self.b1 - self.b0) * self.s)
    def xy(self, lon, lat): return ((lon - self.l0) * self.k * self.s, (self.b1 - lat) * self.s)
    def geo(self, g, eps=0.55):
        polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        m = 30; out = []
        for poly in polys:
            for ring in poly:
                pts = [self.xy(lo, la) for lo, la in ring]
                xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
                if max(xs) < -m or min(xs) > self.W + m or max(ys) < -m or min(ys) > self.h + m: continue
                pts = clip_ring(pts, -m, -m, self.W + m, self.h + m)
                if len(pts) < 3: continue
                q = rdp(pts + [pts[0]], eps)
                if len(q) >= 4: out.append(fmt(q[:-1], True))
        return ''.join(out)


VIEWS = {  # lon/lat boxes for the games drawn from world data
 'Europe': (-25, 34, 45, 71), 'Africa': (-20, -36, 53, 38), 'Asia': (25, -11, 150, 58),
 'North America': (-168, 6, -50, 72), 'South America': (-85, -57, -33, 13), 'Oceania': (110, -48, 180, 1),
 'UK': (-11, 48.6, 2.6, 59.4),
}
VIEW_NAMES = {'UK': 'UK and Ireland'}


def ring_if_small(x0, y0, x1, y1, min_size=18):
    if max(x1 - x0, y1 - y0) < min_size:
        return [round((x0 + x1) / 2, 1), round((y0 + y1) / 2, 1), round(max(14, (max(x1 - x0, y1 - y0)) / 2 + 9), 1)]
    return None


def check(bank, names, game):
    for a, v, c, w, t, f in bank:
        assert a in names, f'{game}: "{a}" is not in the game data'
        assert a not in w and len(set(w)) == 2, f'{game}: wrong answers for {a}'
        assert t in (1, 2, 3)
    tiers = {t: sum(1 for q in bank if q[4] == t) for t in (1, 2, 3)}
    assert tiers[1] >= 4 and tiers[2] >= 3 and tiers[3] >= 3, (game, tiers)
    return tiers


import simple_names as NM
def _river_names():
    out = {l: {} for l in NM.LANGS}
    for l in NM.LANGS:
        f = GAMES_DIR / 'natural-wonders-rivers' / 'tools' / 'i18n' / f'{l}.py'
        g = {}
        if f.exists(): exec(f.read_text(), g)
        out[l].update(NM.RIVERS_EXTRA[l]); out[l].update(g.get('N', {}))
    return out

def translations(game, views, qs):
    """Only the names this game shows: answers, wrong answers, map names."""
    used = {q['a'] for q in qs} | {w for q in qs for w in q['w']} | {v['n'] for v in views.values()}
    src = _river_names() if game == 'rivers' else NM.GAME_NAMES[game]
    tr = {}
    for l in NM.LANGS:
        d = {}
        for n in used:
            t = src[l].get(n) or NM.MAPS[l].get(n)
            if t and t != n: d[n] = t
        tr[l] = d
    return tr

def write(game, views, qs):
    dst = ROOT / 'shadow' / game / 'data.js'
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(f'/* Simple {game} data: built by tools/shadow_simple.py from the full game. Do not edit by hand. */\n'
                   f'var SG=(window.SGD=window.SGD||{{}})["{game}"]=' + json.dumps({'views': views, 'q': qs, 'tr': translations(game, views, qs)}, ensure_ascii=False, separators=(',', ':')) + ';\n')
    return dst.stat().st_size // 1024


def Q(a, v, c, w, t, f, hl, qq=None):
    d = {'a': a, 'w': w, 'c': c, 'f': f, 't': t, 'v': v, 'hl': hl}
    if qq: d['qq'] = qq
    return d


report = {}

# ---------------- Rivers: the full game's own country and continent maps ----------------
D = load('rivers', 'DATA'); SC = {s['id']: s for s in D['scopes']}
rp = lambda r: ''.join(fmt([tuple(p) for p in rdp([tuple(p) for p in l], .5)], False) for l in r['lines'])
views, qs = {}, []
for a, v, c, w, t, f in B.RIVERS:
    sc = SC[v]; names = [r['n'] for r in sc['rivers']]
    assert a in names, f'rivers: {a} not on {v}'
    if v not in views:
        views[v] = {'n': sc['name'], 'w': 520, 'h': 520, 'land': simp_path(sc['d']), 'clip': sc['type'] == 'country', 'extra': []}
    tgt = [r for r in sc['rivers'] if r['n'] == a][0]
    qs.append(Q(a, v, c, w, t, f, {'k': 'line', 'd': rp(tgt)}))
    qs[-1]['others'] = [rp(r) for r in sc['rivers'] if r['n'] != a]
# store each view's rivers once; a question names which one is lit
for v in views:
    views[v]['extra'] = [{'k': 'line', 'n': r['n'], 'd': rp(r)} for r in SC[v]['rivers']]
for q in qs: q.pop('others')
report['rivers'] = (len(qs), write('rivers', views, qs))

# ---------------- Lakes: the full game's continent maps, lakes drawn on the land ----------------
D = load('lakes', 'DATA'); LK = {l['id']: l for l in D['lakes']}; SC = {s['id']: s for s in D['scopes']}
NAMES = {'EU': 'Europe', 'AS': 'Asia', 'AF': 'Africa', 'NA': 'North America', 'SA': 'South America'}
check(B.LAKES, [l['n'] for l in D['lakes']], 'lakes')
views, qs = {}, []
for a, v, c, w, t, f in B.LAKES:
    sc = SC[v]; inscope = {LK[x['id']]['n']: x for x in sc['lakes']}
    assert a in inscope, f'lakes: {a} not on the {v} map'
    if v not in views:
        views[v] = {'n': NAMES[v], 'w': sc['w'], 'h': sc['h'], 'land': simp_path(sc['land']),
                    'extra': [{'k': 'water', 'n': LK[x['id']]['n'], 'd': simp_path(x['d'], .3) or x['d']} for x in sc['lakes'] if x['d']]}
    if not inscope[a]['d']:  # too small to have an outline on this map: mark the spot
        hl = {'k': 'pt', 'xy': [round(c_, 1) for c_ in inscope[a]['xy']]}
    else:
        d = simp_path(inscope[a]['d'], .3) or inscope[a]['d']; bb = path_bbox(d)
        hl = {'k': 'area', 'd': d}; r = ring_if_small(*bb)
        if r: hl['ring'] = r
    qs.append(Q(a, v, c, w, t, f, hl, 'Which lake is this?'))
report['lakes'] = (len(qs), write('lakes', views, qs))

# ---------------- world-data games: Mountains, Deserts, Forests, Bodies of Water ----------------
LAND = load('mountains', 'DATA')['land']
_view_cache = {}
def world_view(v):
    if v not in _view_cache:
        p = Proj(VIEWS[v])
        _view_cache[v] = (p, {'n': VIEW_NAMES.get(v, v), 'w': p.W, 'h': p.h, 'land': p.geo(LAND), 'extra': []})
    return _view_cache[v]

class UKFine:
    """The UK as drawn in River Cities (much finer than the world outline). Points are placed with a
    quadratic fit from the cities' lon/lat to their map positions (error under 0.1 px)."""
    def __init__(self):
        import numpy as np
        g = {c['id']: c for c in load('river-cities', 'COUNTRIES')}['GBR']
        A = np.array([[lo, la, lo * lo, la * la, lo * la, 1] for (lo, la) in (c['ll'] for c in g['cities'])])
        X = np.array([c['xy'] for c in g['cities']])
        self.sol = np.linalg.lstsq(A, X, rcond=None)[0]
        land = simp_path(g['d']); x0, y0, x1, y1 = path_bbox(land); m = 14
        self.vb = [round(x0 - m, 1), round(y0 - m, 1), round(x1 - x0 + 2 * m, 1), round(y1 - y0 + 2 * m, 1)]
        self.W, self.h = self.vb[2], self.vb[3]
        self.view = {'n': 'United Kingdom', 'w': self.vb[2], 'h': self.vb[3], 'vb': self.vb, 'land': land, 'extra': []}
    def xy(self, lo, la):
        x, y = [lo, la, lo * lo, la * la, lo * la, 1] @ self.sol
        return float(x) - self.vb[0], float(y) - self.vb[1]
_ukfine = None

def pt_game(game, bank, items, key='ll'):
    global _ukfine
    by = {i['n']: i for i in items}
    check(bank, by, game)
    views, qs = {}, []
    for a, v, c, w, t, f in bank:
        if v == 'UK':
            _ukfine = _ukfine or UKFine(); p = _ukfine; views[v] = p.view
            x, y = p.xy(*by[a][key]); x += p.vb[0]; y += p.vb[1]
            qs.append(Q(a, v, c, w, t, f, {'k': 'pt', 'xy': [round(x, 1), round(y, 1)]})); continue
        p, view = world_view(v); views[v] = view
        x, y = p.xy(*by[a][key])
        assert 0 <= x <= p.W and 0 <= y <= p.h, f'{game}: {a} is off the {v} map'
        qs.append(Q(a, v, c, w, t, f, {'k': 'pt', 'xy': [round(x, 1), round(y, 1)]}))
    return views, qs

D = load('mountains', 'DATA')
views, qs = pt_game('mountains', B.MOUNTAINS, D['peaks'])
for q in qs: q['qq'] = 'Which mountain is this?'
report['mountains'] = (len(qs), write('mountains', views, qs))

D = load('forests', 'DATA')
views, qs = pt_game('forests', B.FORESTS, D['forests'])
for q in qs: q['qq'] = 'Which forest is this?'
report['forests'] = (len(qs), write('forests', views, qs))

def area_game(game, bank, items, sea=False, qq=None):
    by = {i['n']: i for i in items}
    check(bank, by, game)
    views, qs = {}, []
    for a, v, c, w, t, f in bank:
        p, view = world_view(v)
        views[v] = dict(view, sea=True) if sea else view
        d = p.geo(by[a]['g'], .5) or p.geo(by[a]['g'], .1)
        if not d:  # too thin to draw at this size (a strait): mark its centre instead
            x, y = p.xy(*by[a]['c'])
            assert 0 <= x <= p.W and 0 <= y <= p.h, f'{game}: {a} is off the {v} map'
            qs.append(Q(a, v, c, w, t, f, {'k': 'pt', 'xy': [round(x, 1), round(y, 1)]}, qq(by[a]) if qq else None)); continue
        hl = {'k': 'area', 'd': d}
        x0, y0, x1, y1 = path_bbox(d)
        x0, y0, x1, y1 = max(x0, 0), max(y0, 0), min(x1, p.W), min(y1, p.h)
        r = ring_if_small(x0, y0, x1, y1, 22)
        if r: hl['ring'] = r
        qs.append(Q(a, v, c, w, t, f, hl, qq(by[a]) if qq else None))
    return views, qs

D = load('deserts', 'DATA')
views, qs = area_game('deserts', B.DESERTS, D['deserts'], qq=lambda i: 'Which desert is this?')
report['deserts'] = (len(qs), write('deserts', views, qs))

D = load('bodies-of-water', 'DATA')
KQ = {'sea': 'Which sea is this?', 'gulf': 'Which gulf is this?', 'bay': 'Which bay is this?', 'strait': 'Which strait is this?',
      'channel': 'Which channel is this?', 'sound': 'What is this called?', 'fjord': 'What is this called?'}
views, qs = area_game('bodies-of-water', B.WATERS, D['marine'], sea=True,
                      qq=lambda i: 'Which estuary is this?' if i['n'] == 'Río de la Plata' else KQ.get(i.get('ft'), 'What is this called?'))
report['bodies-of-water'] = (len(qs), write('bodies-of-water', views, qs))

# ---------------- River Cities: the full game's country maps, rivers and cities ----------------
C = {c['id']: c for c in load('river-cities', 'COUNTRIES')}
views, qs = {}, []
for a, v, c, w, t, f in B.RIVER_CITIES:
    co = C[v]; cities = {x['n']: x for x in co['cities']}
    assert a in cities, f'river-cities: {a} not in {v}'
    if v not in views:
        views[v] = {'n': co['name'], 'w': 520, 'h': 520, 'land': simp_path(co['d']), 'clip': True, 'rivers_white': True,
                    'extra': [{'k': 'line', 'n': r['n'], 'd': rp(r)} for r in co['rivers']] +
                             [{'k': 'dot', 'xy': [round(x['xy'][0], 1), round(x['xy'][1], 1)]} for x in co['cities']]}
    x, y = cities[a]['xy']
    qs.append(Q(a, v, c, w, t, f, {'k': 'pt', 'xy': [round(x, 1), round(y, 1)]}, 'Which city is this?'))
report['river-cities'] = (len(qs), write('river-cities', views, qs))

for g, (n, kb) in report.items():
    print(f'{g:16} {n:3} questions  {kb:4} KB')
