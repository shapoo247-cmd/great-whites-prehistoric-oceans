# Great Whites × Prehistoric Oceans — motion graphics job (client: Safdar)

Video: "Would Great Whites Survive Every Prehistoric Ocean?" — VO `source/VO_Great_White.mp3` (10:08), locked script `source/script.txt`, client brief `source/editing-brief.txt` (read it).

## What Safdar wants (agreed)
1. **Samples first, then his corrections, then finish.** Do not render the whole remaining list before he approves a sample.
2. Final delivery = **graphics pack + rough cut**: every graphic as its own clip in `renders/`, plus `renders/ROUGH_CUT.mp4` = VO + every graphic placed at its exact timestamp, with labelled placeholder slots where his own footage goes, plus `PLACEMENT.md` (timestamp table).
3. Everything is done in this cloud session; results go to this repo. He is a freelance editor (DaVinci Resolve free / CapCut), English is his second language — keep replies short and plain.

## Hard rules
- Original assets only (no stock, no samples): animals/oceans/SFX are drawn/synthesized in code → monetization-safe.
- Facts on screen must match the script; don't exaggerate animal behaviour or add claims the VO doesn't support.
- Full-frame clips: H.264 MP4 1080p30 (`alpha: false`). Overlays: ProRes 4444 `.mov` with alpha (`alpha: true`). SFX embedded in the clip AND saved next to it as `<name>_SFX.wav`.
- Tier board must keep the same TierMaker look as the primate video (`reference/primate-tier-board/`): #262626 bg, #1b1b1b panel, label column 240 px, Inter labels, Anton tile text, pointing-hand drag-and-drop, zoom in → drop → zoom out. Tiers top→bottom: THRIVES #7fff7f, SURVIVES #bfff7f, BARELY #ffdf7f, DIES #ff7f7f.

## Engine (`engine/`)
Headless Chromium canvas → PNG via `canvas.toBlob` → POST to local server → ffmpeg. ~55 ms/frame for simple scenes; shaded creatures with blur are slower (~0.5 s/frame). Machine has 2 CPUs: render in the background (`run_in_background`) and keep working.
```
cd engine && npm install && python3 sfx/synth.py      # first time in a fresh container
node render.mjs <SceneId> [...]                        # -> renders/<out>.mp4|.mov + _SFX.wav
node render.mjs --still <SceneId> 0.5,2.0             # preview PNGs into the scratchpad
```
Chromium: `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` (change in render.mjs if the image differs).
- `lib/water.js` realistic era water (ERAS: devonian murky olive, triassic hot amber haze, jurassic blue, cretaceous turquoise, eocene warm teal, pliocene cold navy). Layers: background → snowLayer(far) → subjects → midground → snowLayer(near) → post (vignette+grain).
- `lib/creatures.js` original side-profile silhouettes: greatwhite, megalodon, cretoxyrhina, dunkleosteus, ichthyosaur, pliosaurus, tylosaurus, dorudon, basilosaurus, + humanPath. style 'shaded' (museum look) or flat colour (fog silhouettes).
- `lib/tierboard.js` + `lib/placementScene.js` tier board; `lib/chapter.js` chapter cards; `lib/species.js` species overlays; `lib/sizecomp.js` size comparisons; `lib/ui.js` HUD kit (Anton names / Inter data; colours C.gw #7fe3ff, C.threat #ff6a5c, C.prey #ffd36a, C.rival #ffa64d); `lib/maps.js` world-atlas + d3-geo dark relief maps (import map in host.html).
- VO word timings: `timing/vo_words.json`, sentences `timing/vo_sentences.txt` (forced alignment, accurate to ~0.05 s).

## Built + rendered (clip START times on the VO timeline)
| Clip | Start | Note |
|---|---|---|
| T00 premise board (11.3 s) | 0:29.20 | tiles pop on "six oceans", THRIVES pulses "Some it rules", DIES "One it can't survive", dives into Pliocene tile (megalodon shadow) |
| C01 Late Devonian (2 s) | 0:40.50 | |
| T01 Devonian → SURVIVES | 1:45.56 | drop at 1.60 s = "survives" 1:47.16 |
| C02 Early Triassic | 1:57.30 | |
| T02 Triassic → DIES | 3:13.26 | drop on "dies" 3:14.86 |
| C03 Late Jurassic | 3:25.43 | |
| T03 Jurassic → SURVIVES | 4:44.60 | drop on "survives" 4:46.20 |
| C04 Late Cretaceous | 4:55.23 | |
| T04 Cretaceous → BARELY | 6:18.72 | hovers SURVIVES on "It survives", drops BARELY on "Barely" 6:21.51 |
| C05 Late Eocene | 6:32.84 | |
| T05 Eocene → THRIVES | 8:02.33 | drop on "thrives" 8:03.93 |
| C06 Early Pliocene | 8:10.11 | |
| T06 Pliocene → SURVIVES | 9:44.50 | hovers during the question, drops on "did" 9:48.76 |
| T07 final board (14 s) | 9:54.30 | to end; T07b = 3 s version |
| S01 great white | 0:07.30 | "Five meters long. Over a ton." |
| S02 Dunkleosteus | 0:47.50 | "This time, Dunkleosteus is the one that backs off." |
| Z01 Dunk vs GW (20.6 s) | 0:54.19 | 3.5 m / 4.5 m / +1 m / armor = head & shoulders / just fish |
| S03 ichthyosaur | 3:36.00 | |
| Z02 Pliosaurus vs GW + skull vs person | 4:17.50 | (S04 overlaps — use S04 only if Z02 is not used, or later at 4:31.6) |
| Z03 GW vs Cretoxyrhina checklist | 5:09.00 | |
| S06 Tylosaurus | 6:10.20 | |
| S07 Dorudon | 7:03.50 | |
| Z04 Basilosaurus vs GW + Dorudon | 7:35.80 | (S08 overlaps — optional) |
| S09 megalodon | 8:31.40 | |
| Z05 MEGALODON payoff (11.6 s) | 8:37.00 | 16 m, three great whites nose to tail, "some estimates go higher" |
S05 Cretoxyrhina overlaps the planned seaway map (5:37.5) — map label can name it instead.

## Still to build (planned start → content)
E01 jaw speed overlay 0:18.0 ("jaws snap open in ~1/50 s", "suck prey straight in" 0:21.9) · E02 electroreception overlay 1:18.6 (pulse rings, heartbeat) · E03 black shale strata full-frame 1:27.0 ("black shale" 1:28.8, "dead zones" 1:31.0, "oxygen collapsed" 1:31.7) · E04 oxygen/ram-ventilation HUD overlay 1:33.3 ("can't rest" 1:34.1, "keep swimming" 1:37.4, "warm body burns" 1:39.1, "dead zones spread" 1:43.0) · E05 Great Dying 80–90% 2:08.5 ("80 and 90" 2:12.0) · E06 heat 40°C/104°F vs great-white water 2:15.4 ("40" 2:17.8, "104" 2:19.7, "far hotter" 2:22.2) · E07 O2 supply vs demand 2:25.4 ("built for cold" 2:26.4, "holds less oxygen" 2:30.7, "demands more" 2:32.8) · E08 dive profile 2:34.3 ("so it dives" 2:34.4, "deeper still" 2:39.1, "doesn't get cooler" 2:40.5, "dead layer" 2:44.3, "turns back" 2:47.8, "heat reaches far below" 2:51.5) · E09 cooler water far N/S 3:03.7 ("long swim" 3:07.1, "burns through reserves" 3:10.8) · O02 "~5 million years to recover" 3:20.1 · F01 tooth marks (ichthyosaurs 4:27.1 / plesiosaurs / other pliosaurs 4:29.2) 4:24.1 · E10 Western Interior Seaway map 5:37.5 (Kansas 5:45.7) · F02 teeth embedded in mosasaur backbones 5:50.0 · O03 asteroid 6:23.6 · E11 Tethys/Egypt map 6:54.9 ("now desert" 6:57.6) · F04 Basilosaurus stomach: ≥2 young Dorudon + calf skulls with bite marks 7:40.8 · F05 shark teeth among its bones 7:52.8 · E12 great whites: Pacific ~6 MYA → worldwide by ~4 MYA, alongside megalodon 8:57.2 · E13 tooth chemistry overlapping food-chain levels 9:06.3 (same seas 9:11.3 / same prey 9:12.4 / competitors 9:13.9) · E14 diet: megalodon big meals vs GW seals/fish/dolphins/dead whale 9:15.3 · E15 timeline: GW ~6 MYA, megalodon gone ~3.6 MYA, cause debated 9:28.0 · O01 "LATE DEVONIAN · 370 MILLION YEARS AGO" stamp 0:01.2
Brief also wants a visual reset every 20–40 s and music shifts per chapter (music is Safdar's — licensed; just mark the shift points in PLACEMENT.md).

## Sample reel (next step)
`samples/SAMPLE_REEL.mp4` (~90 s, with VO where synced): VO 0:29.2–1:52 rough-cut excerpt (T00 → C01 → placeholder → S02 → Z01 → … → T01) + Z05 with its VO + T07 with the ending VO. Push, post to Safdar, wait for corrections.

## Rough cut method
ffmpeg: base = per-era placeholder loops (dim water + "FOOTAGE: <shot from brief>" label via ASS/drawtext, Inter at /usr/share/fonts/opentype/inter) → overlay each clip with `setpts=PTS-STARTPTS+START/TB` and `enable='between(t,START,END)'` → audio = VO + each clip's SFX (`adelay`) via `amix` (normalize=0), VO on top.
