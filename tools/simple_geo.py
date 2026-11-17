"""Outline helpers shared by the simple-game build tools (17 Nov 2026)."""
import re

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



def clip_path(d, box, eps):
    """Clip every ring of a path to a box (x0, y0, x1, y1), then simplify: parts off the map cost nothing."""
    x0, y0, x1, y1 = box; out = []
    for ring in re.findall(r'M[^M]*', d):
        nums = list(map(float, re.findall(r'-?\d+(?:\.\d+)?', ring)))
        pts = list(zip(nums[::2], nums[1::2]))
        if len(pts) < 3: continue
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        if max(xs) < x0 or min(xs) > x1 or max(ys) < y0 or min(ys) > y1: continue
        pts = clip_ring(pts, x0, y0, x1, y1)
        if len(pts) < 3: continue
        q = rdp(pts + [pts[0]], eps)
        if len(q) >= 4: out.append(fmt(q[:-1], True))
    return ''.join(out)
