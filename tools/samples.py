"""Render sample motion graphics: chapter card, size-comparison graphic, tier board.
Usage: python3 tools/samples.py [outdir]"""
import math, random, subprocess, sys, os, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS = 1920, 1080, 30
OUT = sys.argv[1] if len(sys.argv) > 1 else "renders"
os.makedirs(OUT, exist_ok=True)
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def font(sz, bold=True): return ImageFont.truetype(FB if bold else FR, sz)

# ---------- easing ----------
def clamp(x): return max(0.0, min(1.0, x))
def prog(t, a, b): return clamp((t - a) / (b - a))
def out_cubic(x): return 1 - (1 - x) ** 3
def out_back(x):
    c1, c3 = 1.4, 2.4
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
def in_out(x): return x * x * (3 - 2 * x)

# ---------- shapes (drawn 2x, downsampled) ----------
def bez(p0, p1, p2, p3, n=24):
    return [tuple((1-t)**3*a + 3*(1-t)**2*t*b + 3*(1-t)*t**2*c + t**3*d
                  for a, b, c, d in zip(p0, p1, p2, p3)) for t in np.linspace(0, 1, n)]

def shark_img(length, color, tail_swing=0.0):
    """Side-view shark silhouette facing right. length in px."""
    S = 2; w = int(length * S); h = int(length * 0.42 * S)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    L = w; cy = h * 0.5; sw = tail_swing * L * 0.05
    top = bez((L, cy), (L*.86, cy-L*.09), (L*.55, cy-L*.13), (L*.30, cy-L*.07))
    top += bez((L*.30, cy-L*.07), (L*.18, cy-L*.045), (L*.08, cy-L*.03+sw*.3), (L*.0+sw*.2, cy-L*.16+sw))
    tail_b = [(L*.045+sw*.5, cy+sw*.6)]
    bot = bez((L*.0+sw*.2, cy+L*.15+sw), (L*.08, cy+L*.03+sw*.3), (L*.18, cy+L*.03), (L*.34, cy+L*.055))
    bot += bez((L*.34, cy+L*.055), (L*.55, cy+L*.09), (L*.86, cy+L*.07), (L, cy+L*.015))
    poly = top + tail_b + bot
    d.polygon(poly, fill=color)
    d.polygon([(L*.50, cy-L*.115), (L*.44, cy-L*.255), (L*.39, cy-L*.105)], fill=color)   # dorsal
    d.polygon([(L*.60, cy+L*.075), (L*.50, cy+L*.20), (L*.47, cy+L*.07)], fill=color)    # pectoral
    d.polygon([(L*.20, cy+L*.035), (L*.17, cy+L*.075), (L*.14, cy+L*.03)], fill=color)
    return im.resize((w // S, h // S), Image.LANCZOS)

def dunk_img(length, color):
    """Stubby armoured placoderm, facing right."""
    S = 2; w = int(length * S); h = int(length * 0.50 * S)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    L = w; cy = h * .5
    body = bez((L*.0, cy), (L*.10, cy-L*.07), (L*.35, cy-L*.19), (L*.62, cy-L*.18))
    body += bez((L*.62, cy-L*.18), (L*.82, cy-L*.17), (L*.97, cy-L*.10), (L*.99, cy-L*.01))
    body += bez((L*.99, cy-L*.01), (L*.97, cy+L*.07), (L*.80, cy+L*.19), (L*.60, cy+L*.19))
    body += bez((L*.60, cy+L*.19), (L*.35, cy+L*.19), (L*.10, cy+L*.07), (L*.0, cy))
    d.polygon(body, fill=color)
    d.polygon([(L*.02, cy), (L*-.0+L*.07, cy-L*.14), (L*.12, cy)], fill=color)
    d.polygon([(L*.02, cy), (L*.07, cy+L*.14), (L*.12, cy)], fill=color)
    d.polygon([(L*.48, cy-L*.17), (L*.40, cy-L*.30), (L*.33, cy-L*.16)], fill=color)
    # armour plate edge + jaw notch
    plate = Image.new("RGBA", im.size, (0, 0, 0, 0)); pd = ImageDraw.Draw(plate)
    pd.arc([L*.50, cy-L*.20, L*1.05, cy+L*.20], 100, 260, fill=(255, 255, 255, 70), width=int(L*.012))
    pd.line([(L*.99, cy+L*.02), (L*.74, cy+L*.05)], fill=(0, 0, 0, 160), width=int(L*.014))
    im = Image.alpha_composite(im, plate)
    return im.resize((w // S, h // S), Image.LANCZOS)

# ---------- backgrounds ----------
def vgrad(top, bot):
    a = np.linspace(0, 1, H)[:, None, None]
    arr = np.array(top)[None, None, :] * (1 - a) + np.array(bot)[None, None, :] * a
    return np.repeat(arr, W, axis=1).astype(np.uint8)

def vignette():
    y, x = np.ogrid[:H, :W]
    r = np.sqrt(((x - W/2) / (W/2))**2 + ((y - H/2) / (H/2))**2)
    return (np.clip(r - .45, 0, 1) ** 1.6 * 0.85)[:, :, None]
VIG = vignette()

def ocean_bg(top, bot, t, rays=True, particles=None, ray_col=(120, 190, 170)):
    arr = vgrad(top, bot).astype(np.float32)
    if rays:
        y, x = np.mgrid[:H, :W]
        for i, ph in enumerate((0.0, 1.7, 3.1, 4.4)):
            cx = (i * 560 - 200) + 60 * math.sin(t * .5 + ph)
            m = np.exp(-((x - cx - y * .55) / 90.0) ** 2) * (1 - y / H) * (.10 + .04 * math.sin(t + ph))
            arr += m[:, :, None] * np.array(ray_col)[None, None, :]
    if particles:
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
        for (px, py, sp, r, a) in particles:
            x = (px - t * sp) % (W + 40) - 20; y = py + 14 * math.sin(t * .8 + px)
            d.ellipse([x - r, y - r, x + r, y + r], fill=(220, 240, 230, a))
        base = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGBA")
        arr = np.array(Image.alpha_composite(base, layer.filter(ImageFilter.GaussianBlur(1)))).astype(np.float32)[:, :, :3]
    arr *= (1 - VIG)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGBA")

def make_particles(n, seed):
    r = random.Random(seed)
    return [(r.uniform(0, W), r.uniform(0, H), r.uniform(15, 90), r.uniform(1, 3.2), r.randint(40, 120)) for _ in range(n)]

def text_c(d, xy, s, f, fill, anchor="mm", shadow=True):
    if shadow: d.text((xy[0] + 3, xy[1] + 4), s, font=f, fill=(0, 0, 0, 150), anchor=anchor)
    d.text(xy, s, font=f, fill=fill, anchor=anchor)

def spaced(d, cx, y, s, f, fill, track):
    widths = [d.textlength(c, font=f) for c in s]; total = sum(widths) + track * (len(s) - 1)
    x = cx - total / 2
    for c, w_ in zip(s, widths):
        d.text((x, y), c, font=f, fill=fill, anchor="lm"); x += w_ + track

# ---------- video writer ----------
def write_video(name, frames_fn, dur, sfx=None):
    n = int(dur * FPS)
    path = os.path.join(OUT, name)
    wav = path + ".wav"
    if sfx: write_wav(wav, dur, sfx)
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-"]
    if sfx: cmd += ["-i", wav]
    cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p"]
    if sfx: cmd += ["-c:a", "aac", "-b:a", "192k", "-shortest"]
    cmd += ["-movflags", "+faststart", path]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n):
        p.stdin.write(frames_fn(i / FPS, dur).convert("RGB").tobytes())
    p.stdin.close(); p.wait()
    if sfx: os.remove(wav)
    print("wrote", path)

# ---------- synthesized placeholder SFX ----------
SR = 44100
def write_wav(path, dur, events):
    buf = np.zeros(int(dur * SR))
    rng = np.random.default_rng(1)
    for kind, t0, *a in events:
        i0 = int(t0 * SR)
        if kind == "whoosh":
            L = int(a[0] * SR); t = np.linspace(0, 1, L); n = rng.standard_normal(L)
            k = np.exp(-((t - .5) / .22) ** 2)
            # moving lowpass via cumulative smoothing of varying strength
            y = np.zeros(L); s = 0
            for j in range(L):
                al = .02 + .35 * k[j]; s += al * (n[j] - s); y[j] = s
            y *= k * 2.8
        elif kind == "hit":
            L = int(a[0] * SR); t = np.arange(L) / SR
            f = 38 + 90 * np.exp(-t * 25)
            y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6) * 1.1
            y += rng.standard_normal(L) * np.exp(-t * 40) * .35
        elif kind == "ding":
            L = int(a[0] * SR); t = np.arange(L) / SR
            y = (np.sin(2*np.pi*660*t) + .5*np.sin(2*np.pi*990*t)) * np.exp(-t * 5) * .5
        elif kind == "drone":
            L = int(a[0] * SR); t = np.arange(L) / SR
            y = (np.sin(2*np.pi*55*t) + .6*np.sin(2*np.pi*82.5*t + 1)) * .12 * np.minimum(1, np.minimum(t * 2, (a[0] - t) * 2))
        buf[i0:i0 + len(y)] += y[: len(buf) - i0]
    buf = np.tanh(buf * .9)
    pcm = (buf * 32767 * .8).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

# =====================================================================
# 1. CHAPTER / TITLE CARD  - Late Devonian
# =====================================================================
PART1 = make_particles(70, 3)
def title_frame(t, dur):
    bg = ocean_bg((30, 62, 58), (6, 18, 22), t, particles=PART1)
    # zoom drift
    z = 1.0 + .04 * (t / dur)
    bg = bg.resize((int(W * z), int(H * z)), Image.BILINEAR).crop((int(W*z-W)//2, int(H*z-H)//2, int(W*z-W)//2 + W, int(H*z-H)//2 + H))
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    # shark silhouette crossing behind the text
    sx = -500 + 2600 * prog(t, 0, dur)
    sh = shark_img(520, (4, 12, 14, 235), math.sin(t * 9))
    lay.alpha_composite(sh, (int(sx), int(740 + 18 * math.sin(t * 3))))
    d = ImageDraw.Draw(lay)
    # horizontal band wipe
    bw = out_cubic(prog(t, 0.0, 0.35))
    band_h = 340
    band = Image.new("RGBA", (W, band_h), (4, 12, 14, int(150 * bw)))
    lay.alpha_composite(band, (0, 370))
    lw = int(W * .46 * out_cubic(prog(t, .05, .5)))
    d.rectangle([W/2 - lw, 370, W/2 + lw, 374], fill=(120, 230, 200, 255))
    d.rectangle([W/2 - lw, 370 + band_h - 4, W/2 + lw, 370 + band_h], fill=(120, 230, 200, 255))
    a = lambda x0, x1: int(255 * out_cubic(prog(t, x0, x1)))
    # chapter tag
    tag = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(tag)
    pass
    tag.putalpha(tag.getchannel("A").point(lambda v: v * a(.15, .4) // 255)); lay.alpha_composite(tag)
    # big title slides up
    ty = 500 + int(40 * (1 - out_cubic(prog(t, .1, .55))))
    big = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(big)
    text_c(bd, (W/2, ty), "LATE DEVONIAN", font(150), (245, 250, 246, 255))
    big.putalpha(big.getchannel("A").point(lambda v: v * a(.1, .5) // 255)); lay.alpha_composite(big)
    sub = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sub)
    text_c(sd, (W/2, 620), "370 MYA", font(64), (120, 230, 200, 255))
    sub.putalpha(sub.getchannel("A").point(lambda v: v * a(.3, .65) // 255)); lay.alpha_composite(sub)
    out = Image.alpha_composite(bg, lay)
    # flash on entry + fade out
    if t < .12: out = Image.blend(out, Image.new("RGBA", (W, H), (255, 255, 255, 255)), .5 * (1 - t / .12))
    fo = prog(t, dur - .2, dur)
    if fo > 0: out = Image.blend(out, Image.new("RGBA", (W, H), (0, 0, 0, 255)), fo)
    return out

# =====================================================================
# 2. MOTION GRAPHIC - size comparison
# =====================================================================
PART2 = make_particles(60, 9)
def size_frame(t, dur):
    bg = ocean_bg((22, 52, 50), (5, 14, 18), t, particles=PART2)
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    ppm = 170  # px per metre
    x0 = 200
    gp = out_cubic(prog(t, 0, .6))
    for m in range(0, 6):
        x = x0 + m * ppm
        d.line([(x, 250), (x, 250 + int(790 * gp))], fill=(120, 230, 200, 38), width=2)
    hp = out_cubic(prog(t, .1, .6))
    hd = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hdd = ImageDraw.Draw(hd)
    hd.putalpha(hd.getchannel("A").point(lambda v: int(v * hp)))
    lay.alpha_composite(hd)

    def animal(img, length_m, y, name, sub, col, t0):
        p = out_back(prog(t, t0, t0 + .8)); L = length_m * ppm
        x = x0 - 700 * (1 - p)
        a = int(255 * clamp(p * 1.5))
        im = img.copy(); im.putalpha(im.getchannel("A").point(lambda v: v * a // 255))
        lay.alpha_composite(im, (int(x), int(y)))
        bp = out_cubic(prog(t, t0 + .7, t0 + 1.3))
        by = y + img.height + 14
        xe = x0 + L * bp
        d.line([(x0, by), (xe, by)], fill=col, width=4)
        d.line([(x0, by - 11), (x0, by + 11)], fill=col, width=4)
        d.line([(xe, by - 11), (xe, by + 11)], fill=col, width=4)
        lp = prog(t, t0 + .9, t0 + 1.4)
        d.text((xe + 24, by), f"{length_m:.1f} m", font=font(44), fill=col + (int(255 * lp),), anchor="lm")
        tx = x0 + L + 60; ty = y + img.height / 2 - 20
        d.text((tx, ty), name, font=font(46), fill=(245, 250, 246, a), anchor="lm")

    gw_len, dk_len = 4.5, 3.5
    animal(shark_img(gw_len * ppm, (214, 232, 228, 255), math.sin(t * 8)), gw_len, 270, "GREAT WHITE", "", (120, 230, 200), .5)
    animal(dunk_img(dk_len * ppm, (196, 150, 98, 255)), dk_len, 690, "DUNKLEOSTEUS", "", (240, 170, 90), 1.4)
    cp = 0
    if cp > 0:
        bx, by_ = 1560, 640
        w_, h_ = int(400 * cp), int(190 * cp)
        d.rounded_rectangle([bx - w_/2, by_ - h_/2, bx + w_/2, by_ + h_/2], 18, fill=(4, 14, 16, 230), outline=(240, 170, 90, 255), width=3)
        if cp > .85:
            d.text((bx, by_ - 38), "ARMOUR =", font=font(36), fill=(240, 170, 90, 255), anchor="mm")
            d.text((bx, by_ + 10), "HEAD + SHOULDERS", font=font(36), fill=(245, 250, 246, 255), anchor="mm")
            d.text((bx, by_ + 58), "the rest is just fish", font=font(28, False), fill=(190, 215, 208, 255), anchor="mm")
    out = Image.alpha_composite(bg, lay)
    fo = prog(t, dur - .25, dur)
    if fo > 0: out = Image.blend(out, Image.new("RGBA", (W, H), (0, 0, 0, 255)), fo)
    return out

# =====================================================================
# 3. TIER BOARD
# =====================================================================
TIERS = [("THRIVES", (88, 214, 141)), ("SURVIVES", (163, 228, 90)), ("BARELY", (247, 200, 80)), ("DIES", (235, 87, 87))]
BX, BY, LBLW, ROWH, ROWW = 260, 170, 300, 160, 1400
def tier_card(size, glow=0):
    c = Image.new("RGBA", (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    g = vgrad((40, 90, 84), (8, 24, 28))[:size, :size] if False else None
    arr = np.linspace(0, 1, size)[:, None, None]
    grad = (np.array((46, 104, 96)) * (1 - arr) + np.array((8, 26, 30)) * arr)
    img = Image.fromarray(np.repeat(grad, size, axis=1).astype(np.uint8)).convert("RGBA")
    c = img
    d = ImageDraw.Draw(c)
    sh = shark_img(size * .8, (4, 12, 14, 210)); c.alpha_composite(sh, (int(size * .1), int(size * .56)))
    d.rectangle([0, 0, size - 1, size - 1], outline=(120, 230, 200, 255), width=4)
    f1, f2 = font(int(size * .17)), font(int(size * .12))
    for s, f, y in (("LATE", f2, size * .14), ("DEVONIAN", f1, size * .30)):
        d.text((size/2 + 2, y + 3), s, font=f, fill=(0, 0, 0, 180), anchor="mm")
        d.text((size/2, y), s, font=f, fill=(245, 250, 246, 255), anchor="mm")
    return c

PART3 = make_particles(40, 5)
CARD = tier_card(ROWH - 16)
def tier_frame(t, dur):
    bg = Image.new("RGBA", (W, H), (20, 22, 26, 255))
    arr = np.array(bg).astype(np.float32); arr[:, :, :3] *= (1 - VIG * .6); bg = Image.fromarray(arr.astype(np.uint8))
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    # title
    tp = out_cubic(prog(t, 0, .5))
    # rows slide in staggered
    landed = prog(t, 2.35, 2.5) >= 1
    row_hit = out_cubic(prog(t, 2.35, 2.55))
    pulse = math.sin(prog(t, 2.35, 3.2) * math.pi) if t > 2.35 else 0
    for i, (name, col) in enumerate(TIERS):
        p = out_back(prog(t, .15 + i * .12, .65 + i * .12))
        x = BX - 700 * (1 - p); y = BY + i * ROWH
        d.rectangle([x, y, x + ROWW, y + ROWH - 4], fill=(31, 33, 38, 255))
        d.rectangle([x, y + ROWH - 4, x + ROWW, y + ROWH], fill=(15, 16, 19, 255))
        lc = col
        if name == "SURVIVES" and pulse > 0:
            lc = tuple(int(c + (255 - c) * pulse * .45) for c in col)
            d.rectangle([x, y, x + ROWW, y + ROWH - 4], fill=tuple(int(a + (b - a) * pulse * .35) for a, b in zip((31, 33, 38), col)) + (255,))
        d.rectangle([x, y, x + LBLW, y + ROWH - 4], fill=lc + (255,))
        d.text((x + LBLW / 2, y + ROWH / 2 - 2), name, font=font(46), fill=(25, 25, 25, 255), anchor="mm")
    # card flight: appear at tray, hover, drag to SURVIVES slot
    tx, ty = BX + ROWW / 2 - CARD.width / 2, BY + 4 * ROWH + 28   # tray start
    sx, sy = BX + LBLW + 24, BY + 1 * ROWH + 6                       # slot
    # tray label
    tray_a = int(255 * tp)
    d.rounded_rectangle([BX, BY + 4 * ROWH + 20, BX + ROWW, BY + 4 * ROWH + 20 + 168], 14, fill=(26, 28, 33, tray_a))
    if t < 2.4:
        cp = out_back(prog(t, 1.0, 1.5))
        mv = in_out(prog(t, 1.7, 2.35))
        cx = tx + (sx - tx) * mv; cy = ty + (sy - ty) * mv - 90 * math.sin(mv * math.pi)
        sc = (.5 + .5 * cp) * (1 + .12 * math.sin(mv * math.pi))
        c = CARD.resize((int(CARD.width * sc), int(CARD.height * sc)), Image.LANCZOS)
        shadow = Image.new("RGBA", c.size, (0, 0, 0, 120)).filter(ImageFilter.GaussianBlur(8))
        lay.alpha_composite(shadow, (int(cx + CARD.width/2 - c.width/2 + 10), int(cy + CARD.height/2 - c.height/2 + 18)))
        lay.alpha_composite(c, (int(cx + CARD.width/2 - c.width/2), int(cy + CARD.height/2 - c.height/2)))
    else:
        s = 1 + .10 * math.sin(prog(t, 2.35, 2.8) * math.pi) * (1 - prog(t, 2.35, 2.8))
        c = CARD.resize((int(CARD.width * s), int(CARD.height * s)), Image.LANCZOS)
        lay.alpha_composite(c, (int(sx + CARD.width/2 - c.width/2), int(sy + CARD.height/2 - c.height/2)))
        # impact ring
        rp = prog(t, 2.35, 2.95)
        if 0 < rp < 1:
            r = 90 + 330 * out_cubic(rp)
            cx, cy = sx + CARD.width / 2, sy + CARD.height / 2
            d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(163, 228, 90, int(220 * (1 - rp))), width=6)
    # verdict stamp text
    vp = out_back(prog(t, 2.6, 3.1))
    if vp > 0:
        f = font(int(64 * vp) + 1)
        vd = Image.new("RGBA", (W, H), (0, 0, 0, 0)); vdd = ImageDraw.Draw(vd)
        pass
        vd.putalpha(vd.getchannel("A").point(lambda v: int(v * clamp(vp))))
        lay.alpha_composite(vd)
    out = Image.alpha_composite(bg, lay)
    # white flash on impact
    if 2.35 <= t < 2.5: out = Image.blend(out, Image.new("RGBA", (W, H), (255, 255, 255, 255)), .18 * (1 - (t - 2.35) / .15))
    fo = prog(t, dur - .25, dur)
    if fo > 0: out = Image.blend(out, Image.new("RGBA", (W, H), (0, 0, 0, 255)), fo)
    return out

if __name__ == "__main__":
    write_video("sample_1_title_card_late_devonian.mp4", title_frame, 2.5,
                [("drone", 0, 2.5), ("whoosh", 0.0, .5), ("hit", .12, .9)])
    write_video("sample_2_motion_graphic_size_comparison.mp4", size_frame, 6.0,
                [("drone", 0, 6.0), ("whoosh", .5, .6), ("whoosh", 1.4, .6), ("hit", 3.05, .6)])
    write_video("sample_3_tier_board_devonian_survives.mp4", tier_frame, 5.0,
                [("whoosh", .15, .6), ("whoosh", 1.7, .65), ("hit", 2.35, 1.0), ("ding", 2.45, 1.2)])
