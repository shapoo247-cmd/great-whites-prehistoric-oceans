# ASSEMBLY GUIDE — how to put the whole video together (for Claude or any editor)

Video: **"Would Great Whites Survive Every Prehistoric Ocean?"** · voiceover `source/VO_Great_White.mp3` (10:08.1, 1920×1080, 30 fps).
This file tells you **exactly where every graphic, animation, sound and footage slot goes**. Nothing here needs DaVinci Resolve. Everything can be done with ffmpeg and the scripts in `tools/`.

**Golden rules**
1. Never change the start times. Every graphic is locked to a word in the voiceover (forced alignment, ±0.05 s).
2. The voiceover is the master clock. Everything is placed on the VO timeline in seconds.
3. The editor supplies only two things: (a) B-roll footage for the "footage slots", (b) music. Everything else is already rendered in `renders/`.
4. Overlays are transparent ProRes 4444 (`.mov`, alpha). Do not convert them to mp4 or you lose the transparency.

## 1. What is in the repo

| Folder | What | Format |
|---|---|---|
| `renders/title-cards/` | 6 ocean title cards (full-frame, 2.4 s) | mp4 |
| `renders/tier-system/` | tier-board clips T00–T07 (+T07b short ending) | mp4 |
| `renders/scenes/` | **animated story scenes SC01–SC15** (full-screen, animals swimming/fighting) | mp4 |
| `renders/size-comparisons/` | Z01–Z05 size checks (full-frame) | mp4 |
| `renders/full-frame/` | E03 black shale + E10/E11/E12 maps (full-frame) | mp4 |
| `renders/species-cards/` | S01–S09 name cards | mov (alpha) |
| `renders/overlays/` | E/F/G/O graphics | mov (alpha) |
| every clip | `<name>_SFX.wav` = its sound effects + sea ambience (also embedded in the clip) | wav |
| `placement.json` | machine-readable list of all clips + B-roll slots | json |
| `PLACEMENT.md` | human table + music shift points | md |

If `.mov` files look like tiny text files, run `git lfs install && git lfs pull` (they are stored with Git LFS).

## 2. Layer order (bottom → top)

| Layer | Content | Behaviour |
|---|---|---|
| **L0** base | the editor's B-roll (`p<N>.mp4`), or the labelled placeholder | fills the whole screen for every VO paragraph |
| **L1** | story scenes `renders/scenes/SC*.mp4` | full-screen, covers L0 for its duration (they ARE the B-roll for those moments) |
| **L2** | full-frame graphics: size checks, maps, black shale | covers everything below |
| **L3** | title cards and tier clips | covers everything below |
| **L4** | overlays (`.mov` alpha) and species cards | composited on top, never replace the picture |

Draw order = layer order, then start time. Where two clips overlap in time, the higher layer wins.

**Duplicates to skip when the story scenes are used:** {{SKIP}} (those overlays show the same action as a story scene). They are still delivered; they are left out of the assembled video by `rough_cut.py` unless you pass `--no-scenes`.

## 3. Audio

| Track | Content | Level |
|---|---|---|
| A1 | voiceover `source/VO_Great_White.mp3` | 0 dB (master) |
| A2 | every clip's `<name>_SFX.wav` placed at the clip's start time (`adelay`) | −3 dB |
| A3 | music (editor's own, licensed) | −13 dB under the voice; change feel at the music shift points in `PLACEMENT.md` |

Mix with `amix=normalize=0`, then `alimiter=limit=0.95`. Do not normalise the voice.

## 4. One command to assemble everything

```bash
# 1. get the files (Git LFS needed for .mov)
git lfs install && git lfs pull
pip install numpy scipy pillow            # only needed to re-render, not to assemble

# 2. rough cut with labelled footage slots (no footage needed)
python3 tools/rough_cut.py                # -> renders/ROUGH_CUT.mp4  + PLACEMENT.md + placement.json

# 3. final assembly with the editor's footage and music
python3 tools/rough_cut.py --broll broll/ --music music/track.mp3 --out renders/FINAL_CUT.mp4
```
Options: `--no-scenes` (leave out the story scenes, use footage there), `--broll DIR`, `--music FILE`, `--out FILE`.
It builds the video in 60-second segments and joins them, about 10–15 minutes on 2 CPUs.

### B-roll naming
Put footage in `broll/` named **`p<N>.mp4`** where `N` is the paragraph id in the table in section 6 (for example `p5.mp4` for the paragraph that starts at 0:29.2). The file is scaled/cropped to 1920×1080, looped if too short, cut if too long, its audio is ignored. Missing files stay as labelled placeholders ("FOOTAGE SLOT" with the voiceover line printed on it).

### Verify after assembling
```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 renders/FINAL_CUT.mp4     # must be ~608.1
# spot-check a frame at known moments (sync check):
ffmpeg -ss 163.5 -i renders/FINAL_CUT.mp4 -frames:v 1 check_dead_layer.png            # E08: shark in the dead layer
ffmpeg -ss 381.7 -i renders/FINAL_CUT.mp4 -frames:v 1 check_tier_barely.png           # T04: tile dropped into BARELY
ffmpeg -ss 523.5 -i renders/FINAL_CUT.mp4 -frames:v 1 check_three_whites.png          # Z05: great white no.1 appears
```

## 5. Placing a clip by hand (any tool)

For a clip with start `S` seconds and duration `L`: put it on its layer at timeline time `S`, length `L`, position 0,0, scale 100 %. ffmpeg equivalent:

```bash
# overlay (alpha mov) on top of a base video
ffmpeg -i base.mp4 -i renders/overlays/E06_heat-40C-104F.mov \
  -filter_complex "[1:v]setpts=PTS-STARTPTS+135.30/TB[o];[0:v][o]overlay=0:0:eof_action=pass:enable='between(t,135.30,145.00)'" out.mp4
# sound effects of that clip at the same time (milliseconds delay)
-i renders/overlays/E06_heat-40C-104F_SFX.wav -filter_complex "[2:a]adelay=135300|135300,volume=0.7[s]"
```
Full-frame clips use the same `setpts` + `overlay` pattern. Do not scale, speed up or retime any clip.

## 6. Complete placement table (every clip, in time order)

Times are m:ss.ff on the voiceover timeline. "Position" says which part of the screen an overlay uses (keep that area of the footage free of important action).

| # | ID | File | Layer | Start | End | Length (s) | Position | What it shows |
|---|---|---|---|---|---|---|---|---|
{{CLIPS}}

**Delivered but not placed in the assembled video:** `S05` Cretoxyrhina card (the seaway map already names it; optional at 5:37.5), `S08` Basilosaurus card (optional; Z04 covers it), `T07b` short 3 s final board.

### Footage slots (paragraphs of the voiceover)

Name your footage `p<N>.mp4` using the first column.

| Paragraph | Start | End | Voiceover |
|---|---|---|---|
{{SLOTS}}

## 7. Music shift points
See `PLACEMENT.md` (cold open 0:00, premise 0:29.2, each ocean title card, "story changes" 8:49.07, final board 9:54.3).

## 8. Re-rendering a clip (only if a clip must change)
```bash
cd engine && npm install && python3 sfx/synth.py
node render.mjs <SceneId>            # e.g. node render.mjs SC11_cretoxyrhina-fight
node render.mjs --still <SceneId> 4.5  # preview PNG
```
Scene ids = file names in `engine/scenes/` without `.js`. Start times live in `tools/manifest.py`; after changing anything run `python3 tools/rough_cut.py` again.

## 9. Style rules (keep when changing anything)
- Documentary look: lit, shaded animals; rich sea backgrounds. No flat clip-art. Very little text (a few words or numbers).
- Facts on screen must match the script. Do not exaggerate animal behaviour.
- Original assets only (no stock, no samples).
