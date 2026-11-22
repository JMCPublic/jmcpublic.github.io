"""Build shared/cities/<CC>.json for the weekly "Where are you playing?" card and the stats map.
Source: GeoNames (via the geonamescache package), towns of 15,000+ people, CC BY 4.0 (credited on the About page).
Each file: [[name, x, y], ...] (US: [name, x, y, state]) biggest first; x,y are positions on shared/wmap.json (1000 x 520),
from a fit against the capitals already in shared/places.json (accurate to a fraction of a unit)."""
import json,os,geonamescache
BX=[4.99989003e+02,2.75597820e+00,-1.29541025e-04,-2.90188764e-09]
BY=[2.60034772e+02,-3.18564073e+00,-2.15260544e-05,8.14606328e-09]
def xy(lat,lon):
    x=BX[0]+BX[1]*lon+BX[2]*lon*lat**2+BX[3]*lon*lat**4
    y=BY[0]+BY[1]*lat+BY[2]*lat**3+BY[3]*lat**5
    return round(x,1),round(y,1)
gc=geonamescache.GeonamesCache();by={}
for c in gc.get_cities().values():
    by.setdefault(c['countrycode'],[]).append(c)
out=os.path.join(os.path.dirname(__file__),'..','shared','cities');os.makedirs(out,exist_ok=True);n=0
for cc,L in by.items():
    L.sort(key=lambda c:-c['population']);seen=set();rows=[]
    for c in L:
        key=(c['name'],c.get('admin1code','')) if cc=='US' else c['name']
        if key in seen:continue
        seen.add(key);x,y=xy(float(c['latitude']),float(c['longitude']));rows.append([c['name'],x,y]+([c.get('admin1code','')] if cc=='US' else []))  # US towns carry their state (22 Nov)
    json.dump(rows,open(os.path.join(out,cc+'.json'),'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'));n+=len(rows)
print(len(by),'countries',n,'towns')
