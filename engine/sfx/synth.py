"""Original sound-effect library, synthesized from scratch (no samples) -> monetization-safe.
Run: python3 synth.py  -> writes sfx/lib/*.wav (48 kHz stereo)."""
import numpy as np, os
from scipy.signal import butter, sosfilt, fftconvolve
SR = 48000
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lib')
rng = np.random.default_rng(7)

def t_(d): return np.arange(int(SR * d)) / SR
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def env(n, a, d, curve=3.0):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na) ** 2
    rest = n - na; e[na:] = np.exp(-curve * np.linspace(0, 1, rest) * (rest / SR) / max(d, 1e-3)); return e
def norm(x, peak=0.89): m = np.max(np.abs(x)) + 1e-9; return x / m * peak
def reverb(x, dur=1.6, mix=0.25, damp=3000):
    ir = rng.standard_normal(int(SR * dur)) * np.exp(-np.linspace(0, 7, int(SR * dur))); ir = lp(ir, damp)
    w = fftconvolve(x, ir)[:len(x) + int(SR * dur)]; w = w / (np.max(np.abs(w)) + 1e-9) * np.max(np.abs(x))
    y = np.zeros(len(w)); y[:len(x)] += x * (1 - mix); return y + w * mix
def stereo(x, width=0.0):
    if width <= 0: return np.stack([x, x], 1)
    d = int(SR * 0.012 * width); r = np.concatenate([np.zeros(d), x])[:len(x)]
    return np.stack([x, x * (1 - width * .3) + r * width * .3], 1)
def sweep_noise(d, f0, f1, q=0.6):
    n = int(SR * d); x = rng.standard_normal(n); out = np.zeros(n); blk = 512
    for i in range(0, n, blk):
        f = f0 * (f1 / f0) ** (i / n); lo, hi = max(30, f * (1 - q / 2)), min(SR / 2 - 100, f * (1 + q / 2))
        out[i:i + blk] = bp(x[max(0, i - 2048):i + blk], lo, hi)[-len(x[i:i + blk]):]
    return out
def sine_drop(d, f0, f1, curve=4.0):
    tt = t_(d); f = f1 + (f0 - f1) * np.exp(-curve * tt / d * 3); ph = 2 * np.pi * np.cumsum(f) / SR; return np.sin(ph)
def save(name, x, width=0.4, rv=None):
    if rv: x = reverb(x, *rv)
    s = stereo(norm(x), width); os.makedirs(OUT, exist_ok=True)
    import wave
    with wave.open(os.path.join(OUT, name + '.wav'), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(s, -1, 1) * 32767).astype('<i2').tobytes())

# --- whooshes
def whoosh(d, f0, f1, shape=0.45):
    n = int(SR * d); x = sweep_noise(d, f0, f1, 0.9); tt = np.linspace(0, 1, n)
    e = np.where(tt < shape, (tt / shape) ** 2, np.exp(-(tt - shape) / (1 - shape) * 4)); return x * e
save('whoosh_fast', whoosh(0.55, 300, 2400, 0.55), 0.6, (0.6, 0.15))
save('whoosh_slow', whoosh(1.3, 180, 1500, 0.6), 0.7, (1.0, 0.2))
save('whoosh_water', lp(whoosh(1.0, 120, 900, 0.5), 1400) + 0.3 * whoosh(1.0, 60, 300, 0.5), 0.6, (1.4, 0.3, 1500))
# --- impacts
def boom(d=2.2, f0=95, f1=32):
    n = int(SR * d); body = sine_drop(d, f0, f1) * env(n, 0.004, 0.9)
    click = hp(rng.standard_normal(n), 2000) * env(n, 0.0005, 0.02) * 0.35
    thump = lp(rng.standard_normal(n), 220) * env(n, 0.002, 0.18) * 2.0
    return body + click + thump
save('impact_deep', boom(), 0.2, (1.8, 0.25, 1200))
save('impact_hit', boom(1.2, 140, 45) + 0.5 * lp(rng.standard_normal(int(SR * 1.2)), 900) * env(int(SR * 1.2), 0.001, 0.12), 0.3, (0.8, 0.2, 2500))
n = int(SR * 3.0); save('impact_dark', sine_drop(3.0, 70, 26, 2) * env(n, 0.01, 1.6) + 0.5 * lp(rng.standard_normal(n), 140) * env(n, 0.004, 0.6) + 0.15 * np.sin(2 * np.pi * 41.2 * t_(3.0)) * np.sin(2 * np.pi * 43.7 * t_(3.0)) * env(n, 0.2, 1.4), 0.3, (2.4, 0.35, 900))
# --- riser
n = int(SR * 1.6); tt = t_(1.6)
r = sweep_noise(1.6, 200, 5000, 0.5) * (tt / 1.6) ** 2.5 + 0.25 * np.sin(2 * np.pi * np.cumsum(80 + 400 * (tt / 1.6) ** 2) / SR) * (tt / 1.6) ** 2
r[-int(SR * 0.03):] *= np.linspace(1, 0, int(SR * 0.03)); save('riser', r, 0.6, (0.5, 0.15))
# --- UI: pick / drop / tick
n = int(SR * 0.12); save('ui_pick', hp(rng.standard_normal(n), 2500) * env(n, 0.0003, 0.012) + 0.5 * np.sin(2 * np.pi * 1800 * t_(0.12)) * env(n, 0.0003, 0.02), 0.1)
n = int(SR * 0.9); drop = lp(rng.standard_normal(n), 600) * env(n, 0.001, 0.05) * 1.4 + sine_drop(0.9, 150, 60, 6) * env(n, 0.002, 0.18) + 0.3 * hp(rng.standard_normal(n), 1500) * env(n, 0.0005, 0.015)
save('ui_drop', drop, 0.2, (0.5, 0.12, 4000))
n = int(SR * 0.05); save('ui_tick', np.sin(2 * np.pi * 2600 * t_(0.05)) * env(n, 0.0002, 0.008) + 0.4 * hp(rng.standard_normal(n), 4000) * env(n, 0.0002, 0.004), 0.0)
n = int(SR * 0.08); save('ui_type', hp(rng.standard_normal(n), 3000) * env(n, 0.0002, 0.006) * 0.7 + 0.3 * np.sin(2 * np.pi * 900 * t_(0.08)) * env(n, 0.0002, 0.01), 0.0)
# --- tonal verdict stingers (simple synth chords, original)
def tone(freqs, d, a=0.01, dec=1.2, partials=(1, 2, 3), pw=(1, .35, .15), det=0.0):
    tt = t_(d); y = np.zeros(len(tt))
    for f in freqs:
        for k, w in zip(partials, pw): y += w * np.sin(2 * np.pi * f * k * (1 + det * (k - 1)) * tt)
    return y * env(len(tt), a, dec)
n = int(SR * 2.5)
save('verdict_survives', lp(tone([146.8, 220.0, 293.7], 2.5, 0.005, 1.0), 3000) * 0.6 + np.pad(drop, (0, n - len(drop))) * 0.9, 0.5, (2.0, 0.3, 3000))
save('verdict_thrives', lp(tone([196.0, 293.7, 392.0, 587.3], 2.5, 0.005, 1.3), 5000) * 0.6 + np.pad(drop, (0, n - len(drop))) * 0.8 + 0.2 * sweep_noise(2.5, 3000, 9000, 0.4) * env(n, 0.05, 0.6), 0.6, (2.2, 0.35, 6000))
save('verdict_barely', lp(tone([146.8, 207.7], 2.5, 0.005, 0.9), 2200) * 0.6 * (1 + 0.35 * np.sin(2 * np.pi * 6 * t_(2.5))) + np.pad(drop, (0, n - len(drop))) * 0.9, 0.5, (1.8, 0.3, 2500))
nd = int(SR * 3.0); dd = boom(3.0, 80, 28)
save('verdict_dies', lp(tone([73.4, 87.3, 110.0], 3.0, 0.004, 1.6, det=0.003), 900) * 0.7 + dd * 0.9, 0.4, (2.6, 0.35, 1100))
# --- sonar ping / data blips / heartbeat / alarm / stamp / bubbles
n = int(SR * 2.2); save('sonar_ping', np.sin(2 * np.pi * 1180 * t_(2.2)) * env(n, 0.002, 0.5) + 0.3 * np.sin(2 * np.pi * 2360 * t_(2.2)) * env(n, 0.002, 0.25), 0.5, (2.0, 0.45, 5000))
n = int(SR * 0.15); save('data_blip', np.sin(2 * np.pi * 1320 * t_(0.15)) * env(n, 0.001, 0.035) + 0.5 * np.sin(2 * np.pi * 1980 * t_(0.15)) * env(n, 0.001, 0.02), 0.2, (0.3, 0.15, 6000))
def beat(d=0.9):
    n = int(SR * d); x = np.zeros(n)
    for off, amp in ((0, 1.0), (0.22, 0.7)):
        k = int(off * SR); m = n - k; x[k:] += amp * sine_drop(m / SR, 70, 38, 8) * env(m, 0.003, 0.09)
    return lp(x, 300)
save('heartbeat', beat(), 0.1, (0.6, 0.15, 800))
n = int(SR * 0.6); save('alarm_low', bp(np.sign(np.sin(2 * np.pi * 330 * t_(0.6))), 250, 1600) * env(n, 0.005, 0.25) * 0.6, 0.3, (0.8, 0.3, 3000))
n = int(SR * 1.2); stamp = lp(rng.standard_normal(n), 1800) * env(n, 0.0008, 0.05) * 1.3 + sine_drop(1.2, 120, 50, 7) * env(n, 0.001, 0.2) + 0.4 * hp(rng.standard_normal(n), 3000) * env(n, 0.0004, 0.01)
save('stamp', stamp, 0.3, (0.9, 0.2, 3500))
def bubbles(d=1.0, k=14):
    n = int(SR * d); x = np.zeros(n)
    for i in range(k):
        st = int(rng.uniform(0, d * 0.7) * SR); dd = rng.uniform(0.03, 0.09); m = int(dd * SR); f0 = rng.uniform(400, 1300)
        tt = np.arange(m) / SR; f = f0 * (1 + 2.5 * tt / dd); seg = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / dd * 4) * rng.uniform(.3, 1)
        x[st:st + m] += seg[:max(0, min(m, n - st))]
    return x
save('bubbles', bubbles(), 0.7, (0.8, 0.25, 5000))
# --- underwater rumble bed (3 s, loopable-ish) and time-warp transition
n = int(SR * 3.0); rum = lp(rng.standard_normal(n), 120, 4) * 2 + 0.3 * lp(rng.standard_normal(n), 600) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.4 * t_(3.0)))
rum *= np.minimum(1, np.minimum(t_(3.0) / 0.4, (3.0 - t_(3.0)) / 0.6)); save('rumble_bed', rum, 0.8)
n = int(SR * 2.0); tt = t_(2.0)
warp = whoosh(2.0, 120, 3000, 0.18) * 0.8 + boom(2.0, 110, 30) * 0.9 + 0.25 * np.sin(2 * np.pi * np.cumsum(900 - 700 * tt / 2) / SR) * env(n, 0.02, 0.5) + 0.4 * bubbles(2.0, 10)
save('chapter_hit', warp, 0.6, (2.0, 0.3, 2500))
print('ok', sorted(os.listdir(OUT)))
