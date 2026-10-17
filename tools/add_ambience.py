#!/usr/bin/env python3
"""Mix sea ambience under a rendered clip's SFX: add_ambience.py clip.(mp4|mov) [gain_db]. Rewrites <clip>_SFX.wav and re-muxes audio (video untouched)."""
import sys, os, subprocess, wave, numpy as np
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
clip = sys.argv[1]; gain = float(sys.argv[2]) if len(sys.argv) > 2 else -6
base = clip.rsplit('.', 1)[0]; ext = clip.rsplit('.', 1)[1]; sfx = base + '_SFX.wav'; amb = base + '_AMB.wav'
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', clip]))
subprocess.check_call(['python3', R + '/engine/sfx/ambience.py', amb, f'{dur:.3f}', str(abs(hash(base)) % 99)])
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, 2) / 32767.0
a = rd(amb) * 10 ** (gain / 20); s = rd(sfx) if os.path.exists(sfx) else np.zeros_like(a)
n = max(len(a), len(s)); m = np.zeros((n, 2)); m[:len(a)] += a; m[:len(s)] += s
pk = np.max(np.abs(m)); m = m / pk * 0.92 if pk > 0.92 else m
os.remove(amb)
with wave.open(sfx, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(48000); w.writeframes((m * 32767).astype('<i2').tobytes())
tmp = base + '_tmp.' + ext
codec = ['-c:a', 'pcm_s16le'] if ext == 'mov' else ['-c:a', 'aac', '-b:a', '256k']
subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', clip, '-i', sfx, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', *codec, '-shortest', tmp])
os.replace(tmp, clip); print('ambience added:', clip)
