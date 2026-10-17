"""Place SFX cues on a timeline -> stereo wav. usage: mix.py cues.json out.wav"""
import json, sys, wave, os, numpy as np
SR = 48000; LIB = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lib')
spec = json.load(open(sys.argv[1])); n = int(round(spec['duration'] * SR)); out = np.zeros((n, 2))
cache = {}
for c in spec['cues']:
    name = c['name']
    if name not in cache:
        with wave.open(os.path.join(LIB, name + '.wav')) as w: cache[name] = np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, 2) / 32767.0
    x = cache[name] * (10 ** (c.get('gain', 0) / 20)); st = int(round(c['t'] * SR))
    if st < 0: x = x[-st:]; st = 0
    m = min(len(x), n - st)
    if m > 0: out[st:st + m] += x[:m]
fade = int(0.01 * SR); out[-fade:] *= np.linspace(1, 0, fade)[:, None]
pk = np.max(np.abs(out));
if pk > 0.97: out *= 0.97 / pk
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
