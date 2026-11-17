"""Simple versions of the three country games (shadow site, 17 Nov 2026; mock-ups approved by Jonathan the same day):

  how-many-borders  A country lights up on its map: how many countries does it touch by land? Three numbers.
                    After answering, its neighbours light up and the fact lists them.
  where-is-bigger   Three country shapes, not to scale: which covers the most land? After answering, all three to scale.
  which-of-five     Shown as "Which of Three?": one country to beat, three options, exactly one is bigger.

Facts are built from the numbers in the player's language (shadow/i18n.js), so these games are fully translated.
Country shapes, areas and names come from the full games (Where is Bigger? and How Many Borders?).
Output: shadow/<game>/data.js  (SG = {kind, shapes|views, q, tr})
Run from the repo root:  python3 tools/shadow_simple_countries.py
"""
import json, random, re, pathlib, ast, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from simple_geo import simp_path, clip_path  # same outline simplifier as the other simple games

ROOT = pathlib.Path(__file__).resolve().parent.parent
G = ROOT.parent


def load(game, name):
    s = (G / f'natural-wonders-{game}' / 'index.html').read_text()
    i = s.index(f'const {name}=') + len(f'const {name}=')
    return json.JSONDecoder().raw_decode(s[i:])[0]


def names(l):
    t = G / 'natural-wonders-where-is-bigger' / 'tools'
    j = t / f'names_{l}.json'
    if j.exists(): return json.loads(j.read_text())
    src = (t / f'build_{l}.py').read_text()
    m = re.search(r'\b(F|S)="""(.*?)"""', src, re.S) or re.search(r'\b(F|S)="(.*?)"\n', src, re.S)
    F = m.group(2)
    return {k: v.split('|')[0] for k, v in (x.split('=', 1) for x in F.strip().split(';') if '=' in x)}

LANGS = ['de', 'tr', 'fr', 'es', 'pt']
NAMES = {l: names(l) for l in LANGS}

X = {c['id']: c for c in load('where-is-bigger', 'COUNTRIES')}
C = {c['id']: c for c in load('how-many-borders', 'C')}


def bbox(d):
    n = list(map(float, re.findall(r'-?\d+(?:\.\d+)?', d)))
    return [round(min(n[::2]), 1), round(min(n[1::2]), 1), round(max(n[::2]), 1), round(max(n[1::2]), 1)]


def tr_for(ids, en_name):
    out = {}
    for l in LANGS:
        out[l] = {en_name[i]: NAMES[l][i] for i in ids if i in NAMES[l] and NAMES[l][i] != en_name[i]}
    return out


def write(game, data):
    dst = ROOT / 'shadow' / game / 'data.js'
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(f'/* Simple {game} data: built by tools/shadow_simple_countries.py from the full games. Do not edit by hand. */\n'
                   'const SG=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    return dst.stat().st_size // 1024


# ---------------- size games: well-known countries only ----------------
KNOWN = ('RUS CAN USA CHN BRA AUS IND ARG KAZ DZA COD SAU MEX IDN SDN LBY IRN MNG PER TCD NER AGO MLI ZAF COL ETH BOL EGY TZA NGA '
         'VEN NAM PAK TUR CHL ZMB MMR AFG SOM FRA UKR MDG KEN BWA ESP THA SWE JPN DEU MAR FIN NOR VNM MYS POL ITA PHL NZL GBR GHA '
         'ROU GUY IRQ CUB GRC PRT AUT HUN IRL NLD CHE BEL DNK ISL NPL KOR BGD LKA ISR JOR SYR CZE SRB HRV ECU URY PRY UGA ZWE').split()
KNOWN = [k for k in KNOWN if k in X]
A = {k: int(X[k]['a']) for k in KNOWN}
EN = {k: X[k]['n'] for k in KNOWN}
FAME = {k: i for i, k in enumerate(['USA', 'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'CHN', 'IND', 'BRA', 'AUS', 'CAN', 'RUS', 'JPN', 'MEX', 'EGY',
                                    'ARG', 'ZAF', 'TUR', 'GRC', 'PRT', 'IRL', 'SWE', 'NOR', 'POL', 'NLD', 'BEL', 'CHE', 'AUT', 'NZL', 'KEN',
                                    'NGA', 'SAU', 'IRN', 'THA', 'VNM', 'IDN', 'PAK', 'KOR', 'UKR', 'FIN', 'DNK', 'ISL', 'CUB', 'MAR', 'PER',
                                    'COL', 'CHL', 'KAZ', 'MNG', 'PHL', 'MYS', 'GHA', 'DZA', 'LBY', 'ETH', 'ISR', 'JOR', 'IRQ', 'SYR', 'AFG'])}
famous = lambda k: FAME.get(k, 99) < 40
shapes = {k: {'d': simp_path(X[k]['d'], .7) or X[k]['d'], 'bb': bbox(X[k]['d']), 's': float(X[k]['s']), 'a': A[k]} for k in KNOWN}
rng = random.Random(1117)

def ratio(a, b): return A[a] / A[b]

# Where is Bigger? (three): tier by how clearly the biggest wins, and by how famous the countries are
def bigger_triples():
    out, seen = [], set()
    want = {1: 26, 2: 26, 3: 26}
    tries = 0
    while any(want.values()) and tries < 200000:
        tries += 1
        tri = rng.sample(KNOWN, 3)
        key = frozenset(tri)
        if key in seen: continue
        s = sorted(tri, key=lambda k: -A[k]); r = ratio(s[0], s[1])
        fam = sum(famous(k) for k in tri)
        if r >= 2.2 and fam >= 2: t = 1
        elif 1.35 <= r < 2.2 and fam >= 2: t = 2
        elif 1.04 <= r < 1.35 and fam >= 1: t = 3
        else: continue
        if not want[t]: continue
        want[t] -= 1; seen.add(key)
        out.append({'a': EN[s[0]], 'ids': tri, 'w': [EN[s[1]], EN[s[2]]], 't': t, 'big': s[0], 'nx': s[1], 'sm': s[2]})
    return out

# Which of Three?: one country to beat; exactly one option is bigger
def three_sets():
    out, seen = [], set()
    want = {1: 26, 2: 26, 3: 26}
    tries = 0
    while any(want.values()) and tries < 300000:
        tries += 1
        T = rng.choice([k for k in KNOWN if FAME.get(k, 99) < 60])
        bigger = [k for k in KNOWN if A[k] > A[T]]
        smaller = [k for k in KNOWN if A[k] < A[T]]
        if not bigger or len(smaller) < 2: continue
        b = rng.choice(bigger); r = ratio(b, T)
        s1, s2 = rng.sample(smaller, 2)
        lo = max(A[s1], A[s2]) / A[T]
        if r >= 2 and lo <= .6 and famous(b): t = 1
        elif 1.25 <= r < 2 and lo <= .85: t = 2
        elif 1.02 <= r < 1.25 and lo >= .7: t = 3
        else: continue
        if not want[t] or (T, b) in seen: continue
        want[t] -= 1; seen.add((T, b))
        out.append({'a': EN[b], 'w': [EN[s1], EN[s2]], 't': t, 'tg': T, 'ids': [T, b, s1, s2]})
    return out

trip = bigger_triples()
qs = [{'a': q['a'], 'w': q['w'], 't': q['t'], 'k': 'shapes', 'ids': q['ids'], 'f': {'big': q['big'], 'nx': q['nx'], 'sm': q['sm']}} for q in trip]
used = sorted({i for q in trip for i in q['ids']})
kb1 = write('where-is-bigger', {'kind': 'shapes', 'shapes': {k: shapes[k] for k in used}, 'names': {k: EN[k] for k in used},
                                'q': qs, 'tr': tr_for(used, EN)})

three = three_sets()
qs = [{'a': q['a'], 'w': q['w'], 't': q['t'], 'k': 'target', 'tg': q['tg'], 'ids': q['ids']} for q in three]
used = sorted({i for q in three for i in q['ids']})
kb2 = write('which-of-five', {'kind': 'target', 'shapes': {k: shapes[k] for k in used}, 'names': {k: EN[k] for k in used},
                              'q': qs, 'tr': tr_for(used, EN)})

# ---------------- How Many Borders? ----------------
TIERS = {
 1: 'GBR IRL PRT USA ESP ITA FRA DEU EGY IND CHN BRA MEX KOR RUS',
 2: 'NOR SWE FIN POL AUT CHE BEL NLD GRC TUR IRN PAK ARG PER COL VEN ZAF KEN NGA SAU THA VNM UKR KAZ MNG',
 3: 'CZE HUN SRB BLR LUX MDA AFG IRQ SYR JOR LAO MMR BOL PRY ECU CHL URY ETH SDN COD TZA ZMB NER MLI LBY UZB TKM',
}
def options(n, t, r):
    if t == 1: cand = [n + 3, n + 6] if n < 4 else [n - 3, n + 4]
    elif t == 2: cand = [n - 2, n + 2] if n >= 2 else [n + 2, n + 4]
    else: cand = [n - 1, n + 1] if n >= 1 else [n + 1, n + 2]
    return [str(x) for x in cand]

bq, ids_all, en_b = [], set(), {}
for t, ids in TIERS.items():
    for k in ids.split():
        if k not in C: continue
        c = C[k]; n = int(c['count'])
        nb = [x['n'] for x in c['nbs']]
        bb = c['bb'] if isinstance(c['bb'], list) else json.loads(c['bb'])
        pad = max(bb[2] - bb[0], bb[3] - bb[1]) * .12 + 6
        e = max(vb_w := (bb[2] - bb[0] + 2 * pad), 1) / 520 * 1.1  # about one pixel on a phone
        vb = [round(bb[0] - pad, 1), round(bb[1] - pad, 1), round(bb[2] - bb[0] + 2 * pad, 1), round(bb[3] - bb[1] + 2 * pad, 1)]
        m_ = pad * .6; box = (vb[0] - m_, vb[1] - m_, vb[0] + vb[2] + m_, vb[1] + vb[3] + m_)
        bq.append({'a': str(n), 'w': options(n, t, None), 't': t, 'k': 'borders', 'c': k, 'nbs': [x['iso'] for x in c['nbs']],
                   'map': {'vb': vb, 'ctx': clip_path(c['ctx'], box, e * 2.2), 'd': clip_path(c['d'], box, e * 1.4) or c['d'], 'nb': [clip_path(x['d'], box, e * 2) for x in c['nbs']]}})
        en_b[k] = c['n']; ids_all.add(k)
        for x in c['nbs']: en_b[x['iso']] = x['n']; ids_all.add(x['iso'])
reg = {k: C[k]['r'] for k in C}
import simple_names as NM
trb = tr_for(sorted(ids_all), en_b)
AMER = {'de': 'Amerika', 'tr': 'Amerika', 'fr': 'Amériques', 'es': 'América', 'pt': 'Américas'}
for l in LANGS:
    for r in ('Europe', 'Asia', 'Africa'): trb[l][r] = NM.MAPS[l].get(r, r)
    trb[l]['Americas'] = AMER[l]
kb3 = write('how-many-borders', {'kind': 'borders', 'names': en_b, 'region': {q['c']: reg[q['c']] for q in bq}, 'q': bq, 'tr': trb})

for g, qs_, kb in [('where-is-bigger', trip, kb1), ('which-of-five', three, kb2), ('how-many-borders', bq, kb3)]:
    print(f'{g:18} {len(qs_):3} questions  tiers', {t: sum(1 for q in qs_ if q["t"] == t) for t in (1, 2, 3)}, f'{kb} KB')
