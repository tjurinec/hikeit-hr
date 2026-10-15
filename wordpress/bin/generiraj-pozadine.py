#!/usr/bin/env python3
"""Generira pozadine teme: izohipse (agencija) i IT motive (razvoj) kao SVG pločice koje se ponavljaju okomito.
Izohipse: marching squares na periodičnom visinskom polju (linije se ne križaju i pločica se savršeno nastavlja).
Uporaba: python3 bin/generiraj-pozadine.py   → wp-content/themes/hikeit/assets/{izohipse,it}-{svijetla,tamna}.svg"""
import math, os, random
IZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../wp-content/themes/hikeit/assets')

# ---------------- izohipse ----------------
W, H = 1600, 2100
NX, NY = 240, 315; sx, sy = W / NX, H / NY
hills = [(0.80, 0.07, 0.24, 0.045, 1.0), (0.18, 0.24, 0.24, 0.05, 0.9), (0.62, 0.41, 0.26, 0.05, 0.8), (0.12, 0.58, 0.22, 0.045, 0.9),
         (0.84, 0.74, 0.24, 0.05, 1.0), (0.38, 0.90, 0.26, 0.05, 0.85)]
waves = [(2.1, 1, 0.7, 0.05), (3.7, 3, 2.1, 0.035), (6.3, 5, 4.4, 0.02)]   # cijeli brojevi po y => periodično
def h(x, y):
    u, v = x / W, y / H; z = 0
    for cx, cy, a, b, amp in hills:
        for k in (-1, 0, 1):
            z += amp * math.exp(-(((u - cx) / a) ** 2 + ((v - cy + k) / b) ** 2))
    for fx, fy, ph, am in waves:
        z += am * math.sin(fx * 6.283 * u + fy * 6.283 * v + ph)
    return z
G = [[h(i * sx, (j % NY) * sy) for i in range(NX + 1)] for j in range(NY + 1)]
def contours(L):
    seg = []
    def pt(kind, i, j):
        if kind == 'h': t = (L - G[j][i]) / (G[j][i + 1] - G[j][i]); return (('h', i, j), ((i + t) * sx, j * sy))
        t = (L - G[j][i]) / (G[j + 1][i] - G[j][i]); return (('v', i, j), (i * sx, (j + t) * sy))
    for j in range(NY):
        for i in range(NX):
            tl, tr, br, bl = G[j][i], G[j][i + 1], G[j + 1][i + 1], G[j + 1][i]
            c = (tl > L) + 2 * (tr > L) + 4 * (br > L) + 8 * (bl > L)
            if c in (0, 15): continue
            T = lambda: pt('h', i, j); B = lambda: pt('h', i, j + 1); Lf = lambda: pt('v', i, j); R = lambda: pt('v', i + 1, j)
            tab = {1: [(Lf, T)], 2: [(T, R)], 3: [(Lf, R)], 4: [(R, B)], 5: [(Lf, T), (R, B)], 6: [(T, B)], 7: [(Lf, B)], 8: [(B, Lf)],
                   9: [(T, B)], 10: [(T, R), (B, Lf)], 11: [(R, B)], 12: [(Lf, R)], 13: [(T, R)], 14: [(Lf, T)]}
            for a, b in tab[c]: seg.append((a(), b()))
    adj, pos = {}, {}
    for (ka, pa), (kb, pb) in seg:
        pos[ka] = pa; pos[kb] = pb; adj.setdefault(ka, []).append(kb); adj.setdefault(kb, []).append(ka)
    seen, lines = set(), []
    def trace(start, close):
        line = [start]; seen.add(start); cur, prev = start, None
        while True:
            nxt = [n for n in adj[cur] if n != prev and n not in seen]
            if not nxt: break
            prev, cur = cur, nxt[0]; seen.add(cur); line.append(cur)
        if close: line.append(start)
        lines.append([pos[k] for k in line])
    for s in adj:
        if s not in seen and len(adj[s]) == 1: trace(s, False)
    for s in adj:
        if s not in seen: trace(s, True)
    return lines
def path(pts):
    if len(pts) < 4: return ''
    pts = pts[::3] + [pts[-1]]
    d = f'M{pts[0][0]:.0f},{pts[0][1]:.0f}'
    for k in range(1, len(pts) - 1):
        d += f' Q{pts[k][0]:.0f},{pts[k][1]:.0f} {(pts[k][0] + pts[k + 1][0]) / 2:.0f},{(pts[k][1] + pts[k + 1][1]) / 2:.0f}'
    return d + f' L{pts[-1][0]:.0f},{pts[-1][1]:.0f}'
ds, L, mx = [], 0.10, max(max(r) for r in G)
while L < mx: ds += [path(l) for l in contours(L)]; L += 0.065
ds = [d for d in ds if d]
def svg_iz(stroke, op):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"><g fill="none" stroke="{stroke}" stroke-opacity="{op}" stroke-width="1.2" '
            'stroke-linecap="round" stroke-linejoin="round">' + ''.join(f'<path d="{d}"/>' for d in ds) + '</g></svg>')
open(f'{IZ}/izohipse-svijetla.svg', 'w').write(svg_iz('#1A1718', 0.10)); open(f'{IZ}/izohipse-tamna.svg', 'w').write(svg_iz('#FFFFFF', 0.09))
print('izohipse:', len(ds), 'linija')

# ---------------- IT motivi (strujne staze, serveri, oznake) ----------------
random.seed(12)
W2, H2, C = 1600, 2400, 40; NX2, NY2 = W2 // C, H2 // C
occ, traces, nodes = set(), [], []
racks = [(3, 3, 2, 4), (33, 13, 2, 4), (21, 1, 2, 3), (8, 16, 2, 4), (38, 30, 2, 4), (14, 40, 2, 4), (30, 52, 2, 3), (4, 56, 2, 4)]
for x, y, w, hh in racks: occ |= {(x + i, y + j) for i in range(-1, w + 2) for j in range(-1, hh + 2)}
dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
free = lambda c: 1 <= c[0] < NX2 - 1 and 1 <= c[1] < NY2 - 1 and c not in occ
att = 0
while len(traces) < 92 and att < 20000:
    att += 1
    s = (random.randrange(NX2), random.randrange(NY2))
    if not free(s): continue
    d = random.choice(dirs); p = [s]; cur = s; used = {s}
    for _ in range(random.randint(4, 12)):
        if random.random() < 0.25: d = random.choice([x for x in dirs if x != (-d[0], -d[1])])
        nxt = (cur[0] + d[0], cur[1] + d[1])
        if not free(nxt) or nxt in used: break
        cur = nxt; p.append(cur); used.add(cur)
    if len(p) < 4: continue
    occ |= used | {(c[0] + dx, c[1] + dy) for c in p for dx, dy in dirs}
    traces.append(p)
pt2 = lambda c: (c[0] * C + C / 2, c[1] * C + C / 2)
dd = ''
for p in traces:
    pts = [pt2(c) for c in p]; out = [pts[0]]
    for a, b, c in zip(pts, pts[1:], pts[2:]):
        if (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) != 0: out.append(b)
    out.append(pts[-1]); dd += 'M' + ' L'.join(f'{x:.0f},{y:.0f}' for x, y in out); nodes += [out[0], out[-1]]
labels = [('&lt;/&gt;', 1230, 110), ('{ }', 150, 560), ('01', 700, 835), ('$_', 1450, 420), ('::', 930, 240), ('git', 330, 90), ('&lt;?php', 40, 330), ('200 OK', 1100, 780),
          ('sudo', 1300, 1250), ('ssh', 200, 1400), ('404', 900, 1700), ('npm i', 1250, 2050), ('docker', 150, 2250), ('SELECT *', 700, 1500), ('main()', 1100, 2300), ('chmod', 480, 1900)]
def svg_it(ink, acc, op):
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W2} {H2}"><g fill="none" stroke="{ink}" stroke-opacity="{op}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="{dd}"/>'
    for cx, cy in nodes: s += f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="5"/>'
    for x, y, w, hh in racks:
        X, Y, RW, RH = x * C, y * C, w * C, hh * C; n = hh * 2
        s += f'<rect x="{X}" y="{Y}" width="{RW}" height="{RH}" rx="6"/>'
        for k in range(1, n): yy = Y + k * RH / n; s += f'<line x1="{X}" y1="{yy:.0f}" x2="{X + RW}" y2="{yy:.0f}"/>'
        for k in range(n):
            yy = Y + (k + 0.5) * RH / n
            s += f'<circle cx="{X + 16}" cy="{yy:.0f}" r="3.5" stroke="{acc}" stroke-opacity="{op * 2.4:.2f}"/><line x1="{X + 32}" y1="{yy:.0f}" x2="{X + RW - 16}" y2="{yy:.0f}" stroke-dasharray="7 6"/>'
    s += f'</g><g fill="{ink}" fill-opacity="{op * 1.5:.2f}" font-family="monospace" font-size="22">'
    for t, x, y in labels: s += f'<text x="{x}" y="{y}">{t}</text>'
    return s + '</g></svg>'
open(f'{IZ}/it-svijetla.svg', 'w').write(svg_it('#1A1718', '#CC2A1E', 0.10)); open(f'{IZ}/it-tamna.svg', 'w').write(svg_it('#FFFFFF', '#F05648', 0.09))
print('IT:', len(traces), 'tragova')
