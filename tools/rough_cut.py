#!/usr/bin/env python3
"""ROUGH_CUT.mp4 + PLACEMENT.md: VO + every graphic at its exact timestamp, labelled footage slots where Safdar's own footage goes.
usage: rough_cut.py [--md-only]"""
import os, re, sys, subprocess, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import manifest as M
R = M.R; RN = R + '/renders'; TMP = os.environ.get('CUT_TMP', '/tmp/cut'); os.makedirs(TMP, exist_ok=True)
VO = R + '/source/VO_Great_White.mp3'; FONT = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'; FONTR = '/usr/share/fonts/opentype/inter/Inter-Regular.otf'
def probe(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def mmss(x): return f'{int(x // 60)}:{x % 60:05.2f}'
VO_END = 608.1
clips = []
for cid, scene, start, kind, what in M.ITEMS:
    if cid in ('S04',) and False: continue
    rel = M.resolve(scene); f = f'{RN}/{rel}'
    if not os.path.exists(f): print('MISSING', cid, rel); continue
    clips.append(dict(id=cid, file=f, rel=rel, start=start, dur=probe(f), kind=kind, what=what))
clips.sort(key=lambda c: c['start'])
# paragraphs for the footage-slot labels
paras = {}
for line in open(R + '/timing/vo_sentences.txt'):
    m = re.match(r'\[(\d+):([\d.]+) - (\d+):([\d.]+)\] \(p(\d+)\) (.*)', line)
    if not m: continue
    a = int(m[1]) * 60 + float(m[2]); b = int(m[3]) * 60 + float(m[4]); p = int(m[5]); paras.setdefault(p, [a, b, []]); paras[p][0] = min(paras[p][0], a); paras[p][1] = max(paras[p][1], b); paras[p][2].append(m[6])
PARAS = [(v[0], v[1], ' '.join(v[2])) for k, v in sorted(paras.items())]
def vo_line(t):
    best = ''
    for line in open(R + '/timing/vo_sentences.txt'):
        m = re.match(r'\[(\d+):([\d.]+) - (\d+):([\d.]+)\] \(p\d+\) (.*)', line)
        if m and int(m[1]) * 60 + float(m[2]) - 0.3 <= t: best = m[5]
    return best
ERA = [(0, '0x2c3b27'), (117, '0x4a3a1c'), (205, '0x123a52'), (295, '0x145250'), (393, '0x1d4a3c'), (490, '0x0d2335')]
def era_color(t): return [c for s, c in ERA if t >= s][-1]
def wrap(s, n=64):
    out, cur = [], ''
    for w in s.split():
        if len(cur) + len(w) + 1 > n: out.append(cur); cur = w
        else: cur = (cur + ' ' + w).strip()
    return '\n'.join(out + [cur])
def segment(i, a, b):
    d = b - a; inp = ['-f', 'lavfi', '-i', f'color=c={era_color(a)}:s=1920x1080:r=30:d={d:.3f}', '-ss', f'{a}', '-t', f'{d:.3f}', '-i', VO]
    fc = ['[0:v]noise=alls=10:allf=t,vignette=PI/4']
    for k, (pa, pb, txt) in enumerate(PARAS):
        if pb < a or pa > b: continue
        sa, sb = max(pa - a, 0), min(pb - a, d)
        tf = f'{TMP}/p{k}.txt'; open(tf, 'w').write(f'{mmss(pa)} - {mmss(pb)}\n{wrap(txt)}')
        fc[-1] += f",drawtext=fontfile={FONT}:text='FOOTAGE SLOT':fontsize=30:fontcolor=white@0.5:x=(w-text_w)/2:y=h/2-110:enable='between(t,{sa:.3f},{sb:.3f})'"
        fc[-1] += f",drawtext=fontfile={FONTR}:textfile={tf}:fontsize=34:line_spacing=10:fontcolor=white@0.9:x=(w-text_w)/2:y=h/2-40:enable='between(t,{sa:.3f},{sb:.3f})'"
    fc[-1] += '[base]'
    last = 'base'; aud = ['[1:a]volume=1.0[vo]']; mix = ['[vo]']; n = 2
    for c in clips:
        e = c['start'] + c['dur']
        if e <= a or c['start'] >= b: continue
        off = max(a - c['start'], 0); st = max(c['start'] - a, 0); vis = min(e, b) - max(c['start'], a)
        inp += ['-ss', f'{off:.3f}', '-i', c['file']]; v = n; n += 1
        fc.append(f"[{v}:v]setpts=PTS-STARTPTS+{st:.3f}/TB[c{v}]"); fc.append(f"[{last}][c{v}]overlay=0:0:eof_action=pass:enable='between(t,{st:.3f},{st + vis:.3f})'[o{v}]"); last = f'o{v}'
        sfx = c['file'].rsplit('.', 1)[0] + '_SFX.wav'
        if os.path.exists(sfx):
            inp += ['-ss', f'{off:.3f}', '-i', sfx]; k = n; n += 1; ms = int(st * 1000)
            aud.append(f"[{k}:a]adelay={ms}|{ms},volume=0.7[s{k}]"); mix.append(f'[s{k}]')
    fc += aud + [''.join(mix) + f"amix=inputs={len(mix)}:normalize=0:duration=first,alimiter=limit=0.95[a]"]
    out = f'{TMP}/seg{i:02d}.mp4'
    subprocess.check_call(['ffmpeg', '-y', '-v', 'error', *inp, '-filter_complex', ';'.join(fc), '-map', f'[{last}]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p', '-r', '30', '-g', '30', '-c:a', 'aac', '-b:a', '192k', '-t', f'{d:.3f}', out])
    return out
def placement_md():
    L = ['# PLACEMENT — where every graphic goes on the VO timeline', '',
         'Times are on the `VO_Great_White.mp3` timeline (m:ss.ff). Every graphic is a separate file in `renders/`. `ROUGH_CUT.mp4` shows all of them in place.', '',
         '- **overlay** = transparent ProRes 4444 `.mov` (alpha). Put it on a track ABOVE your B-roll.',
         '- **full** / **title** / **tier** = full-frame `.mp4`. It replaces the B-roll for its duration.',
         '- Each clip has its own sound effects inside and as `<name>_SFX.wav` (sea ambience is mixed under them).', '',
         '| # | ID | File | Type | Start | End | Length | What it shows | VO at that moment |', '|---|---|---|---|---|---|---|---|---|']
    for i, c in enumerate(clips, 1):
        L.append(f"| {i} | {c['id']} | `renders/{c['rel']}` | {c['kind']} | {mmss(c['start'])} | {mmss(c['start'] + c['dur'])} | {c['dur']:.1f}s | {c['what']} | {vo_line(c['start'])} |")
    L += ['', '## Not placed in the rough cut (files still delivered)', '']
    for cid, scene, what in M.EXTRA:
        try: L.append(f"- **{cid}** `renders/{M.resolve(scene)}` — {what}")
        except Exception: pass
    L += ['', '## Music shift points (music is yours)', '', '| Time | Shift |', '|---|---|', '| 0:00.00 | Cold open: tense, low |', '| 0:29.20 | Premise board: build, "six oceans" |']
    for c in clips:
        if c['kind'] == 'title': L.append(f"| {mmss(c['start'])} | New ocean ({c['what'].split('(')[0].replace('Title card: ', '').strip()}): change the music feel here |")
    L += ['| 8:49.07 | "This is where the story changes": calmer, thoughtful |', '| 9:54.30 | Final board / ending: resolve |', '',
          '## Visual reset', '', 'Every ocean starts with a full-frame title card, every verdict is a full-frame tier clip, and size checks / maps are full-frame, so the picture resets about every 20–40 s.', '']
    open(R + '/PLACEMENT.md', 'w').write('\n'.join(L)); print('PLACEMENT.md written', len(clips), 'clips')
if __name__ == '__main__':
    placement_md()
    if '--md-only' in sys.argv: sys.exit()
    segs = []; a = 0; i = 0
    while a < VO_END:
        b = min(a + 60, VO_END); print('segment', i, a, b, flush=True); segs.append(segment(i, a, b)); a = b; i += 1
    open(f'{TMP}/list.txt', 'w').write(''.join(f"file '{s}'\n" for s in segs))
    subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', f'{TMP}/list.txt', '-c', 'copy', '-movflags', '+faststart', RN + '/ROUGH_CUT.mp4']); print('ROUGH_CUT', probe(RN + '/ROUGH_CUT.mp4'))
