"""Underwater ambience: deep sea hum + soft water movement + occasional distant bubbles. usage: ambience.py out.wav seconds [seed]"""
import sys, wave, numpy as np
from scipy.signal import butter, sosfilt
SR = 48000; out, dur = sys.argv[1], float(sys.argv[2]); rng = np.random.default_rng(int(sys.argv[3]) if len(sys.argv) > 3 else 1)
n = int(dur * SR); t = np.arange(n) / SR
def lp(x, f, o=4): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)
# deep hum: stacked low sines with slow beating + swelling
hum = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * a for f, a in [(41, 0.5), (55.3, 0.35), (82.4, 0.2), (110.7, 0.1)])
hum *= 0.65 + 0.35 * np.sin(2 * np.pi * 0.11 * t + 1.0) * np.sin(2 * np.pi * 0.07 * t)
# water movement: low-passed noise with slow amplitude waves
mv = lp(rng.standard_normal(n), 420) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.17 * t + 2) ** 2)
air = bp(rng.standard_normal(n), 900, 2600) * 0.06 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.23 * t))
x = hum * 0.35 + mv * 0.9 + air
# distant bubbles
for _ in range(int(dur * 0.9)):
    s = int(rng.uniform(0, n - 6000)); f0 = rng.uniform(500, 1400); d = np.arange(5000) / SR
    b = np.sin(2 * np.pi * (f0 * (1 + 4 * d)) * d) * np.exp(-d * 30) * rng.uniform(0.02, 0.08); x[s:s + 5000] += b
x = lp(x, 6000, 2); x /= np.max(np.abs(x)); x *= 0.5
fi = int(1.0 * SR); x[:fi] *= np.linspace(0, 1, fi); x[-fi:] *= np.linspace(1, 0, fi)
st = np.stack([x, np.roll(x, 240) * 0.95], 1)
with wave.open(out, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
