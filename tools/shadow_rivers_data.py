"""Simple Rivers (shadow site, 17 Nov 2026): the question bank plus the maps it needs.

Maps come from the full Rivers game (../natural-wonders-rivers/index.html, const DATA).
Each question shows one map with one river lit up and asks which river it is, from three.
Tier 1 = most people know it, 2 = makes you think, 3 = the clever one.
The two wrong answers set the difficulty as much as the river does.

Run from the repo root:  python3 tools/shadow_rivers_data.py   ->  shadow/rivers/data.js
"""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT.parent / 'natural-wonders-rivers' / 'index.html'

# river, map, clue, two wrong answers, tier, fact shown after answering
Q = [
 # ---- tier 1: most people know these ----
 ('Nile','Africa','Flows north through Egypt, past Cairo, into the Mediterranean.',['Amazon','Thames'],1,'At about 6,650 km it vies with the Amazon for the title of longest river in the world.'),
 ('Amazon','South America','Carries more water than any other river on Earth.',['Nile','Mississippi'],1,'About a fifth of all the fresh water that rivers pour into the oceans comes from the Amazon.'),
 ('Thames','GBR','Flows through London, past the Houses of Parliament.',['Seine','Danube'],1,'It is the longest river entirely in England. The longest in Britain is the Severn.'),
 ('Mississippi','USA','Flows south past New Orleans into the Gulf of Mexico.',['Thames','Rhine'],1,'With the Missouri, it forms one of the longest river systems in the world.'),
 ('Seine','FRA','Flows through the middle of Paris.',['Thames','Tiber'],1,'It passes the Eiffel Tower and Notre-Dame before winding on to the English Channel.'),
 ('Tiber','ITA','Flows through Rome.',['Seine','Thames'],1,'Legend says Romulus and Remus, the founders of Rome, were found on its banks.'),
 ('Danube','Europe','Flows through Vienna, Budapest and Belgrade.',['Thames','Nile'],1,'It passes through ten countries, more than any other river in the world.'),
 ('Ganges','IND',"India's holiest river, with the city of Varanasi on its banks.",['Nile','Amazon'],1,'It flows from the Himalayas to the Bay of Bengal.'),
 ('Yangtze','CHN',"Asia's longest river, reaching the sea at Shanghai.",['Mississippi','Thames'],1,'The Three Gorges Dam on the Yangtze is the largest power station in the world.'),
 ('Ottawa','CAN','Flows past the capital of Canada, which shares its name.',['Thames','Nile'],1,'For much of its length it forms the border between Ontario and Quebec.'),
 # ---- tier 2: makes you think ----
 ('Rhine','DEU','Flows past Cologne, famous for its castles and the Lorelei rock.',['Elbe','Danube'],2,'It rises in the Swiss Alps and reaches the North Sea in the Netherlands.'),
 ('Volga','RUS',"Europe's longest river, ending in the Caspian Sea.",['Don','Danube'],2,'About 3,530 km long, it flows entirely within Russia.'),
 ('Murray','AUS',"Australia's longest river.",['Darling','Mississippi'],2,'It forms most of the border between New South Wales and Victoria.'),
 ('Rio Grande','USA','Forms part of the border between the USA and Mexico.',['Missouri','Columbia'],2,'In Mexico it is called the Río Bravo.'),
 ('Zambezi','Africa','Plunges over Victoria Falls.',['Congo','Niger'],2,'Victoria Falls is known locally as Mosi-oa-Tunya, "the smoke that thunders".'),
 ('Loire','FRA',"France's longest river, famous for its châteaux.",['Seine','Rhône'],2,'It runs for more than 1,000 km to the Atlantic.'),
 ('Yellow River','CHN','Named after the colour of the silt it carries.',['Yangtze','Mekong'],2,'It is often called the cradle of Chinese civilisation.'),
 ('Arno','ITA','Flows through Florence and Pisa.',['Tiber','Po'],2,"Florence's Ponte Vecchio, lined with shops, crosses the Arno."),
 ('Elbe','DEU','Flows through Dresden and out to sea past Hamburg.',['Rhine','Danube'],2,'It rises in the mountains of the Czech Republic.'),
 ('Mekong','Asia','Flows through six countries to a huge delta in Vietnam.',['Ganges','Yangtze'],2,'It rises high on the Tibetan Plateau.'),
 ('Vistula','POL',"Poland's longest river, flowing through Kraków and Warsaw.",['Oder','Danube'],2,'It empties into the Baltic Sea near Gdańsk.'),
 ('Severn','GBR',"Britain's longest river, rising in the mountains of Wales.",['Thames','Trent'],2,'Its estuary has one of the biggest tides in the world.'),
 ('Tagus','ESP','The longest river in Spain and Portugal, reaching the sea at Lisbon.',['Ebro','Douro'],2,'The Spanish call it the Tajo; the Portuguese, the Tejo.'),
 ('Congo','Africa','The deepest river in the world, crossing the equator twice.',['Zambezi','Niger'],2,'In places it is more than 200 m deep.'),
 # ---- tier 3: the clever ones ----
 ('Rhône','FRA','Flows out of Lake Geneva, past Lyon, to the Mediterranean.',['Loire','Garonne'],3,'It drops through the Camargue, home to wild white horses and flamingos, at its delta.'),
 ('Niger','Africa','Curves like a boomerang through Mali, past Timbuktu.',['Nile','Congo'],3,'It flows through Mali, Niger and Nigeria on its way to the Gulf of Guinea.'),
 ('Indus','Asia','Gave India its name, but flows mostly through Pakistan.',['Ganges','Brahmaputra'],3,'One of the world’s first great civilisations grew up along its banks.'),
 ('Euphrates','Asia','With the Tigris, it watered ancient Mesopotamia.',['Jordan','Indus'],3,'Babylon stood on its banks.'),
 ('Missouri','USA','The longest river in the United States.',['Mississippi','Colorado'],3,'It joins the Mississippi just north of St. Louis.'),
 ('Po','ITA',"Italy's longest river, flowing past Turin to the Adriatic.",['Tiber','Arno'],3,'Its wide valley is the farming heartland of northern Italy.'),
 ('Yukon','CAN','The gold-rush river that flows across Alaska to the Bering Sea.',['Fraser','Mackenzie'],3,'Prospectors poured up it during the Klondike Gold Rush of the 1890s.'),
 ('Fraser','CAN','Reaches the Pacific at Vancouver.',['Yukon','Columbia'],3,'It is famous for its huge salmon runs.'),
 ('Orinoco','South America','Flows through Venezuela to the Atlantic.',['Amazon','Paraná'],3,"Angel Falls, the world's highest waterfall, is in its basin."),
 ('Tay','GBR',"Scotland's longest river, flowing past Perth and Dundee.",['Tweed','Severn'],3,'It carries more water than any other river in Britain.'),
 ('Guadalquivir','ESP','Flows through Seville.',['Tagus','Ebro'],3,'Its name comes from the Arabic for "the great river".'),
 ('Yamuna','IND','Flows past the Taj Mahal in Agra.',['Ganges','Indus'],3,'It joins the Ganges at Prayagraj.'),
 ('Columbia','USA','Forms much of the border between Washington and Oregon.',['Missouri','Rio Grande'],3,'Its many dams make it the biggest source of hydropower in North America.'),
 ('Lena','RUS','Flows north through Yakutsk to the Arctic Ocean.',['Volga','Ob'],3,'Its delta freezes solid for most of the year.'),
 ('Ebro','ESP','Flows past Zaragoza. The Romans named the whole peninsula after it.',['Tagus','Douro'],3,'The name Iberia comes from the Latin name for the Ebro, Iberus.'),
 ('Paraná','South America',"South America's second-longest river, which ends in the River Plate.",['Amazon','Orinoco'],3,'The huge Itaipú Dam, on the border of Brazil and Paraguay, is on the Paraná.'),
]


def rdp(pts, eps):
    """Ramer-Douglas-Peucker: drop points that don't change the shape at this size."""
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; L = (dx * dx + dy * dy) ** .5
    i, dm = 0, 0
    for k in range(1, len(pts) - 1):
        d = (abs(dy * pts[k][0] - dx * pts[k][1] + x2 * y1 - y2 * x1) / L) if L > 1e-6 else ((pts[k][0] - x1) ** 2 + (pts[k][1] - y1) ** 2) ** .5  # closed ring: ends meet
        if d > dm: i, dm = k, d
    if dm <= eps: return [pts[0], pts[-1]]
    return rdp(pts[:i + 1], eps)[:-1] + rdp(pts[i:], eps)

def simp_d(d, eps=0.6):
    import re
    out = []
    for ring in re.findall(r'M[^M]*', d):
        closed = 'Z' in ring
        nums = list(map(float, re.findall(r'-?\d+(?:\.\d+)?', ring)))
        pts = list(zip(nums[::2], nums[1::2]))
        if len(pts) < 3: continue
        q = rdp(pts, eps)
        if len(q) < 3: continue
        out.append('M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in q) + ('Z' if closed else ''))
    return ''.join(out)

def simp_lines(lines, eps=0.5):
    return [[[round(x, 1), round(y, 1)] for x, y in rdp([tuple(p) for p in l], eps)] for l in lines]

s = SRC.read_text()
i = s.index('const DATA=') + len('const DATA=')
data, _ = json.JSONDecoder().raw_decode(s[i:])
scopes = {sc['id']: sc for sc in data['scopes']}
need = {}
for river, scope, clue, wrong, tier, fact in Q:
    sc = scopes[scope]
    names = [r['n'] for r in sc['rivers']]
    assert river in names, f'{river} is not on the {scope} map'
    assert river not in wrong and len(set(wrong)) == 2, river
    need[scope] = sc
out = {
    'scopes': {k: {'name': v['name'], 'type': v['type'], 'd': simp_d(v['d']),
                   'rivers': [{'n': r['n'], 'lines': simp_lines(r['lines'])} for r in v['rivers']]} for k, v in need.items()},
    'q': [{'r': r, 's': sc, 'c': c, 'w': w, 't': t, 'f': f} for r, sc, c, w, t, f in Q],
}
dst = ROOT / 'shadow' / 'rivers' / 'data.js'
dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_text('/* Simple Rivers data, built by tools/shadow_rivers_data.py from the full Rivers game. Do not edit by hand. */\nconst SR=' +
               json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(Q), 'questions;', {t: sum(1 for q in Q if q[4] == t) for t in (1, 2, 3)}, ';', len(need), 'maps;', dst.stat().st_size // 1024, 'KB')
