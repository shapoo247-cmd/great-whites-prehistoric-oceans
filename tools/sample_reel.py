#!/usr/bin/env python3
"""Build samples/SAMPLE_REEL.mp4: three VO excerpts, graphics at exact timestamps, labelled footage slots."""
import subprocess, os, sys
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..')); RN = R + '/renders'; OUT = R + '/samples'; TMP = os.environ.get('REEL_TMP', '/tmp/reel'); os.makedirs(TMP, exist_ok=True)
VO = R + '/source/VO_Great_White.mp3'; FONT = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))

def segment(name, v0, v1, clips, slots, bg='0x2c3b27'):
    d = v1 - v0
    inp = ['-f', 'lavfi', '-i', f'color=c={bg}:s=1920x1080:r=30:d={d:.3f}', '-ss', f'{v0}', '-t', f'{d:.3f}', '-i', VO]
    fc = ["[0:v]noise=alls=14:allf=t,vignette=PI/4"]
    for (a, b, label) in slots:
        fc[-1] += f",drawbox=x=0:y=0:w=iw:h=ih:color=black@0:t=fill:enable='between(t,{a:.3f},{b:.3f})'"
        fc[-1] += f",drawtext=fontfile={FONT}:text='FOOTAGE SLOT':fontsize=34:fontcolor=white@0.55:x=(w-text_w)/2:y=h/2-70:enable='between(t,{a:.3f},{b:.3f})'"
        fc[-1] += f",drawtext=fontfile={FONT}:text='{label}':fontsize=44:fontcolor=white@0.9:x=(w-text_w)/2:y=h/2-10:enable='between(t,{a:.3f},{b:.3f})'"
    fc[-1] += "[base]"
    last = 'base'; aud = ['[1:a]volume=1.0[vo]']; amix = ['[vo]']
    for i, (f, start) in enumerate(clips):
        idx = 2 + i; inp += ['-i', f]; cd = dur(f); s = start - v0
        fc.append(f"[{idx}:v]setpts=PTS-STARTPTS+{s:.3f}/TB[c{i}]")
        fc.append(f"[{last}][c{i}]overlay=0:0:eof_action=pass:enable='between(t,{s:.3f},{s+cd:.3f})'[v{i}]"); last = f'v{i}'
        sfx = f.rsplit('.', 1)[0] + '_SFX.wav'
        if os.path.exists(sfx):
            k = len(inp) // 2; inp += ['-i', sfx]
            aud.append(f"[{k}:a]adelay={int(max(s,0)*1000)}|{int(max(s,0)*1000)},volume=0.8[s{i}]"); amix.append(f'[s{i}]')
    fc += aud + [''.join(amix) + f"amix=inputs={len(amix)}:normalize=0:duration=first,alimiter=limit=0.95[a]"]
    out = f'{TMP}/{name}.mp4'
    subprocess.check_call(['ffmpeg', '-y', '-v', 'error', *inp, '-filter_complex', ';'.join(fc), '-map', f'[{last}]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '256k', '-t', f'{d:.3f}', out])
    return out

t = lambda m, s: m * 60 + s
A = segment('A', 29.2, 112.3, [
    (f'{RN}/01_tier-board/T00_premise-board.mp4', 29.20), (f'{RN}/02_chapter-cards/C01_late-devonian.mp4', 40.50),
    (f'{RN}/03_species-cards/S02_dunkleosteus.mov', 47.50), (f'{RN}/04_size-comparisons/Z01_dunkleosteus-vs-greatwhite.mp4', 54.19),
    (f'{RN}/05_environment/E02_electroreception.mov', 78.60), (f'{RN}/05_environment/E03_black-shale.mp4', 86.90),
    (f'{RN}/05_environment/E04_oxygen-hud.mov', 93.30), (f'{RN}/01_tier-board/T01_devonian_SURVIVES.mp4', 105.56)],
    [(42.5, 54.19, 'Dunkleosteus rises, lunges, misses'), (74.8, 86.9, 'Shark circles back in murky water'), (93.3, 105.56, 'Great white swimming, low-oxygen water'), (111.66, 112.3, 'Next ocean')])
B = segment('B', 516.4, 529.0, [(f'{RN}/04_size-comparisons/Z05_MEGALODON-vs-greatwhite.mp4', 517.0)], [(516.4, 517.0, 'Megalodon')], bg='0x0f2230')
t07 = f'{RN}/01_tier-board/T07_final-board_ENDING-14s.mp4'
Cc = segment('C', 608.1 - dur(t07), 608.1, [(t07, 608.1 - dur(t07))], [], bg='0x0f2230')
lst = f'{TMP}/list.txt'; open(lst, 'w').write(''.join(f"file '{x}'\n" for x in (A, B, Cc)))
subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', OUT + '/SAMPLE_REEL.mp4'])
print('reel', dur(OUT + '/SAMPLE_REEL.mp4'), 's')
