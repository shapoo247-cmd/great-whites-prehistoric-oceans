#!/usr/bin/env python3
"""Contact sheets: one still per graphic (overlays composited over a sea frame) so Safdar can approve the look before the final render."""
import os, sys, subprocess, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import manifest as M
from PIL import Image, ImageDraw, ImageFont
R = M.R; ENG = R + '/engine'; ST = os.environ.get('STILLS', '/tmp/stills'); os.makedirs(ST, exist_ok=True)
FONT = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'; FONTR = '/usr/share/fonts/opentype/inter/Inter-Regular.otf'
ERA = {'O01': 'devonian', 'S01': 'devonian', 'E01': 'devonian', 'C01': 'devonian', 'S02': 'devonian', 'Z01': 'devonian', 'E02': 'devonian', 'E03': 'devonian', 'E04': 'devonian',
       'E05': 'triassic', 'E06': 'triassic', 'E07': 'triassic', 'E08': 'triassic', 'E09': 'triassic', 'O02': 'triassic', 'S03': 'jurassic', 'Z02': 'jurassic', 'F01': 'jurassic', 'S04': 'jurassic',
       'Z03': 'cretaceous', 'F02': 'cretaceous', 'S06': 'cretaceous', 'F03': 'cretaceous', 'O03': 'cretaceous', 'S07': 'eocene', 'Z04': 'eocene', 'F04': 'eocene', 'F05': 'eocene',
       'S09': 'pliocene', 'G01': 'jurassic', 'G02': 'jurassic', 'G03': 'cretaceous', 'G04': 'eocene', 'G05': 'eocene', 'G06': 'eocene', 'G07': 'jurassic', 'G08': 'jurassic', 'Z05': 'pliocene', 'E13': 'pliocene', 'E14': 'pliocene', 'E15': 'pliocene'}
TIME = {'O01': 3.0, 'S01': 2.5, 'E01': 5.2, 'C01': 1.4, 'C02': 1.4, 'C03': 1.4, 'C04': 1.4, 'C05': 1.4, 'C06': 1.4, 'S02': 2.5, 'S03': 2.5, 'S04': 2.5, 'S06': 2.5, 'S07': 2.5, 'S09': 2.5, 'Z01': 10, 'E02': 4.3, 'E03': 5.8, 'E04': 8, 'E05': 5.5, 'E06': 5.5, 'E07': 7.8, 'E08': 9, 'E09': 8, 'O02': 2.6,
        'Z02': 5.5, 'F01': 6, 'Z03': 4.5, 'E10': 9, 'F02': 3, 'F03': 5, 'O03': 2.4, 'E11': 7, 'Z04': 4, 'F04': 5, 'F05': 3.5, 'Z05': 10, 'E12': 8.5, 'E13': 8, 'E14': 11, 'E15': 13, 'G01': 4.8, 'G02': 6.5, 'G03': 3, 'G04': 5.5, 'G05': 1.5, 'G06': 2.4, 'G07': 4.2, 'G08': 4.6}
TIERT = {'T00': 6, 'T01': 3.2, 'T02': 3.2, 'T03': 3.2, 'T04': 3.5, 'T05': 3.2, 'T06': 4, 'T07': 5}
def run(args, env=None):
    subprocess.check_call(['node', 'render.mjs', *args], cwd=ENG, env={**os.environ, **(env or {})}, stdout=subprocess.DEVNULL)
def still(scene, t, alpha):
    f = f'{ST}/{scene}_{("%g" % t).replace(".", "_")}.png'
    if not os.path.exists(f): run(['--still', scene, '%g' % t, ST], {'STILL_BG': 'transparent'} if alpha else {})
    return f
for e in ['devonian', 'triassic', 'jurassic', 'cretaceous', 'eocene', 'pliocene']:
    if not os.path.exists(f'{ST}/_BD_{e}_2.png'): run(['--still', f'_BD_{e}', '2', ST])
tiles = []
for cid, scene, start, kind, what in M.ITEMS:
    if cid in TIERT:
        f = f'{R}/renders/{M.resolve(scene)}'.replace('tier-system/', '01_tier-board/') if not os.path.exists(f'{R}/renders/{M.resolve(scene)}') else f'{R}/renders/{M.resolve(scene)}'
        p = f'{ST}/{cid}_tier.png'
        if not os.path.exists(p): subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-ss', str(TIERT[cid]), '-i', f, '-frames:v', '1', p])
        im = Image.open(p).convert('RGB')
    elif cid in TIME:
        alpha = kind == 'overlay'
        src = open(f'{ENG}/scenes/{scene}.js').read(); alpha = alpha or 'alpha: true' in src or 'docSpecies' in src
        fp = still(scene, TIME[cid], alpha); im = Image.open(fp).convert('RGBA')
        if alpha:
            bg = Image.open(f'{ST}/_BD_{ERA.get(cid, "devonian")}_2.png').convert('RGBA'); bg.alpha_composite(im); im = bg.convert('RGB')
        else: im = im.convert('RGB')
    else: continue
    tiles.append((cid, what, start, kind, im))
def mmss(x): return f'{int(x // 60)}:{x % 60:05.2f}'
W, H, GAP, LAB = 640, 360, 24, 64
GROUPS = [('A · Title cards + tier system', ['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'T00', 'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07']), ('B · Species cards', ['S01', 'S02', 'S03', 'S04', 'S06', 'S07', 'S09']),
          ('C · Ocean 1 · Late Devonian', ['O01', 'E01', 'Z01', 'E02', 'E03', 'E04']), ('D · Ocean 2 · Early Triassic', ['E05', 'E06', 'E07', 'E08', 'E09', 'O02']), ('E · Ocean 3 + 4 · Jurassic, Cretaceous', ['Z02', 'F01', 'Z03', 'E10', 'F02', 'F03', 'O03']), ('G · NEW: fills the gaps (ambush, air-breathers, carcass, Dorudon, empty seas, calves)', ['G01', 'G02', 'G03', 'G04', 'G05', 'G06', 'G07', 'G08']), ('F · Ocean 5 + 6 · Eocene, Pliocene', ['E11', 'Z04', 'F04', 'F05', 'Z05', 'E12', 'E13', 'E14', 'E15'])]
os.makedirs(R + '/samples/contact-sheets', exist_ok=True); byid = {t[0]: t for t in tiles}; out = []
for gi, (title, ids) in enumerate(GROUPS):
    items = [byid[i] for i in ids if i in byid]; cols = 3; rows = (len(items) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * (W + GAP) + GAP, 90 + rows * (H + LAB + GAP) + GAP), (14, 17, 20)); d = ImageDraw.Draw(sheet)
    d.text((GAP, 28), title, font=ImageFont.truetype(FONT, 34), fill=(255, 255, 255))
    for k, (cid, what, start, kind, im) in enumerate(items):
        x = GAP + (k % cols) * (W + GAP); y = 90 + (k // cols) * (H + LAB + GAP)
        sheet.paste(im.resize((W, H), Image.LANCZOS), (x, y)); d.rectangle([x - 1, y - 1, x + W, y + H], outline=(70, 80, 90))
        d.text((x, y + H + 8), f'{cid}  ·  {mmss(start)}  ·  {"transparent overlay" if kind == "overlay" else "full-frame"}', font=ImageFont.truetype(FONT, 20), fill=(127, 227, 255))
        d.text((x, y + H + 36), what[:70], font=ImageFont.truetype(FONTR, 17), fill=(200, 210, 215))
    fp = f'{R}/samples/contact-sheets/SHEET_{"ABCDEGF"[gi]}.png'; sheet.save(fp); out.append(fp); print(fp)
