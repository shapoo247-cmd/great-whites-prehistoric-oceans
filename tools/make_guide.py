#!/usr/bin/env python3
"""Writes ASSEMBLY_GUIDE.md (full instructions + per-clip table) from placement.json."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import manifest as M
R = M.R; J = json.load(open(R + '/placement.json'))
def mmss(x): return f'{int(x // 60)}:{x % 60:05.2f}'
LAYER = {'scene': 'L1 story scene (full-screen)', 'full': 'L2 full-frame graphic', 'title': 'L3 title card (full-frame)', 'tier': 'L3 tier clip (full-frame)', 'overlay': 'L4 transparent overlay'}
POS = {'O01': 'top-left', 'S01': 'lower-left', 'E01': 'right side', 'E02': 'centre (shark + heart)', 'E04': 'centre (shark, flow, red edges)', 'E05': 'right half', 'E06': 'right side (thermometer)', 'E07': 'right half (chart)', 'E08': 'right column', 'E09': 'right half (globe)', 'O02': 'bottom centre', 'F01': 'right half', 'F02': 'right half', 'F03': 'lower right', 'F04': 'centre/right', 'F05': 'right half', 'O03': 'full width (flash + rings)', 'E13': 'right half', 'E14': 'full width', 'E15': 'lower half', 'G02': 'right column', 'G04': 'right half', 'G05': 'right half', 'G06': 'centre/right'}
rows = []
for i, c in enumerate(J['clips'], 1):
    rows.append(f"| {i} | {c['id']} | `renders/{c['rel']}` | {LAYER[c['kind']]} | {mmss(c['start'])} | {mmss(c['start'] + c['dur'])} | {c['dur']:.1f} | {POS.get(c['id'], '—' if c['kind'] != 'overlay' else 'on top of footage')} | {c['what']} |")
slots = [f"| p{p['p']} | {mmss(p['start'])} | {mmss(p['end'])} | {p['vo'][:90]} |" for p in J['paragraph_slots']]
T = open(R + '/tools/guide_template.md').read().replace('{{CLIPS}}', '\n'.join(rows)).replace('{{SLOTS}}', '\n'.join(slots)).replace('{{SKIP}}', ', '.join(sorted(M.SKIP_WHEN_SCENES)))
open(R + '/ASSEMBLY_GUIDE.md', 'w').write(T); print('ASSEMBLY_GUIDE.md', len(T), 'chars')
