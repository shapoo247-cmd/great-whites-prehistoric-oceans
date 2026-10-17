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

**Duplicates to skip when the story scenes are used:** G01, G03, G07, G08 (those overlays show the same action as a story scene). They are still delivered; they are left out of the assembled video by `rough_cut.py` unless you pass `--no-scenes`.

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
| 1 | SC01 | `renders/scenes/SC01_cruising-and-rising.mp4` | L1 story scene (full-screen) | 0:00.00 | 0:16.30 | 16.3 | — | Story: great white cruising a murky sea, Dunkleosteus rises from below |
| 2 | O01 | `renders/overlays/O01_stamp-late-devonian.mov` | L4 transparent overlay | 0:01.20 | 0:06.60 | 5.4 | top-left | Era stamp: LATE DEVONIAN · 370 MILLION YEARS AGO |
| 3 | S01 | `renders/species-cards/S01_great-white.mov` | L4 transparent overlay | 0:07.30 | 0:12.30 | 5.0 | lower-left | Species ID: great white (5 m, over a ton) |
| 4 | SC02 | `renders/scenes/SC02_dunkleosteus-lunge.mp4` | L1 story scene (full-screen) | 0:16.20 | 0:28.40 | 12.2 | — | Story: Dunkleosteus lunges, jaws snap, great white twists away |
| 5 | E01 | `renders/overlays/E01_jaw-speed.mov` | L4 transparent overlay | 0:18.00 | 0:25.40 | 7.4 | right side | Jaw snap 1/50 s + suction |
| 6 | T00 | `renders/tier-system/T00_premise-board.mp4` | L3 tier clip (full-frame) | 0:29.20 | 0:40.50 | 11.3 | — | Premise board: six oceans, THRIVES / DIES pulses, dive to Pliocene |
| 7 | C01 | `renders/title-cards/TITLE_01_late-devonian.mp4` | L3 title card (full-frame) | 0:40.50 | 0:42.90 | 2.4 | — | Title card: Late Devonian (Ocean 1 of 6) |
| 8 | SC03 | `renders/scenes/SC03_great-white-circles-dunkleosteus-backs-off.mp4` | L1 story scene (full-screen) | 0:41.60 | 0:53.80 | 12.2 | — | Story: great white circles low, Dunkleosteus backs off |
| 9 | S02 | `renders/species-cards/S02_dunkleosteus.mov` | L4 transparent overlay | 0:47.50 | 0:52.50 | 5.0 | on top of footage | Species ID: Dunkleosteus |
| 10 | Z01 | `renders/size-comparisons/Z01_dunkleosteus-vs-greatwhite.mp4` | L2 full-frame graphic | 0:54.19 | 1:14.79 | 20.6 | — | Size check: Dunkleosteus 3.5 m vs great white 4.5 m, armor = head & shoulders |
| 11 | E02 | `renders/overlays/E02_electroreception.mov` | L4 transparent overlay | 1:18.60 | 1:24.20 | 5.6 | centre (shark + heart) | Electroreception: snout sensors feel a heartbeat |
| 12 | E03 | `renders/full-frame/E03_black-shale-dead-zones.mp4` | L2 full-frame graphic | 1:26.90 | 1:33.40 | 6.5 | — | Black shale strata: repeated dead zones, oxygen collapsed |
| 13 | E04 | `renders/overlays/E04_swim-to-breathe.mov` | L4 transparent overlay | 1:33.30 | 1:45.50 | 12.2 | centre (shark, flow, red edges) | Swim = breathe; warm body burns oxygen; dead zones spread |
| 14 | T01 | `renders/tier-system/T01_devonian_SURVIVES.mp4` | L3 tier clip (full-frame) | 1:45.56 | 1:51.66 | 6.1 | — | Tier: Devonian → SURVIVES (drop on "survives") |
| 15 | C02 | `renders/title-cards/TITLE_02_early-triassic.mp4` | L3 title card (full-frame) | 1:57.30 | 1:59.70 | 2.4 | — | Title card: Early Triassic (Ocean 2 of 6) |
| 16 | SC04 | `renders/scenes/SC04_triassic-hot-water-great-white-slows.mp4` | L1 story scene (full-screen) | 1:59.20 | 2:08.60 | 9.4 | — | Story: hot Triassic water, great white slows, gills working |
| 17 | E05 | `renders/overlays/E05_great-dying-80-90.mov` | L4 transparent overlay | 2:08.50 | 2:15.30 | 6.8 | right half | Great Dying: 80–90% of marine species gone |
| 18 | E06 | `renders/overlays/E06_heat-40C-104F.mov` | L4 transparent overlay | 2:15.30 | 2:25.00 | 9.7 | right side (thermometer) | Heat: 40°C / 104°F tropical surface water |
| 19 | E07 | `renders/overlays/E07_oxygen-supply-vs-demand.mov` | L4 transparent overlay | 2:25.40 | 2:34.20 | 8.8 | right half (chart) | Oxygen supply falls, body demand rises |
| 20 | SC05 | `renders/scenes/SC05_dive-into-dead-layer-turns-back.mp4` | L1 story scene (full-screen) | 2:34.30 | 2:50.90 | 16.6 | — | Story: dive into the dead layer, turns back toward the light |
| 21 | E08 | `renders/overlays/E08_dive-profile-dead-layer.mov` | L4 transparent overlay | 2:34.30 | 2:56.60 | 22.3 | right column | Dive profile: deeper, dead layer, turn back to the light |
| 22 | E09 | `renders/overlays/E09_cooler-water-far-away.mov` | L4 transparent overlay | 3:03.60 | 3:12.90 | 9.3 | right half (globe) | Cooler water far north/south, long swim, reserves drain |
| 23 | T02 | `renders/tier-system/T02_triassic_DIES.mp4` | L3 tier clip (full-frame) | 3:13.26 | 3:19.36 | 6.1 | — | Tier: Triassic → DIES (drop on "dies") |
| 24 | O02 | `renders/overlays/O02_five-million-years-recovery.mov` | L4 transparent overlay | 3:20.00 | 3:23.60 | 3.6 | bottom centre | ~5 million years to recover |
| 25 | C03 | `renders/title-cards/TITLE_03_late-jurassic.mp4` | L3 title card (full-frame) | 3:25.43 | 3:27.83 | 2.4 | — | Title card: Late Jurassic (Ocean 3 of 6) |
| 26 | SC07 | `renders/scenes/SC07_new-great-white-drops-in-hunting.mp4` | L1 story scene (full-screen) | 3:27.40 | 3:36.40 | 9.0 | — | Story: a new great white drops into the Jurassic, already hunting |
| 27 | SC08 | `renders/scenes/SC08_ichthyosaur-breathes-great-white-ambush.mp4` | L1 story scene (full-screen) | 3:33.00 | 3:52.80 | 19.8 | — | Story: ichthyosaur breathes, great white strikes from below |
| 28 | S03 | `renders/species-cards/S03_ichthyosaur.mov` | L4 transparent overlay | 3:36.00 | 3:41.00 | 5.0 | on top of footage | Species ID: ichthyosaur |
| 29 | G02 | `renders/overlays/G02_air-breathers-must-surface.mov` | L4 transparent overlay | 3:52.90 | 4:01.50 | 8.6 | right column | Ichthyosaurs must surface to breathe, shark waits below |
| 30 | SC09 | `renders/scenes/SC09_pliosaurus-takes-the-kill.mp4` | L1 story scene (full-screen) | 4:01.50 | 4:16.70 | 15.2 | — | Story: blood carries, Pliosaurus takes the kill, great white lets go |
| 31 | Z02 | `renders/size-comparisons/Z02_pliosaurus-vs-greatwhite.mp4` | L2 full-frame graphic | 4:17.50 | 4:25.30 | 7.8 | — | Size check: Pliosaurus up to 12 m, skull ~2 m vs person |
| 32 | F01 | `renders/overlays/F01_pliosaurus-tooth-marks.mov` | L4 transparent overlay | 4:24.10 | 4:31.70 | 7.6 | right half | Evidence: Pliosaurus tooth marks on bones |
| 33 | SC10 | `renders/scenes/SC10_great-white-circles-once-turns-away.mp4` | L1 story scene (full-screen) | 4:31.50 | 4:36.90 | 5.4 | — | Story: great white circles once, turns away |
| 34 | S04 | `renders/species-cards/S04_pliosaurus.mov` | L4 transparent overlay | 4:31.60 | 4:36.60 | 5.0 | on top of footage | Species ID: Pliosaurus (optional, if Z02 is skipped use 4:17.5) |
| 35 | T03 | `renders/tier-system/T03_jurassic_SURVIVES.mp4` | L3 tier clip (full-frame) | 4:44.60 | 4:50.70 | 6.1 | — | Tier: Jurassic → SURVIVES |
| 36 | C04 | `renders/title-cards/TITLE_04_late-cretaceous.mp4` | L3 title card (full-frame) | 4:55.23 | 4:57.63 | 2.4 | — | Title card: Late Cretaceous (Ocean 4 of 6) |
| 37 | SC11 | `renders/scenes/SC11_great-white-vs-cretoxyrhina-over-the-carcass.mp4` | L1 story scene (full-screen) | 4:57.40 | 5:36.80 | 39.4 | — | Story: great white vs Cretoxyrhina fight over the carcass |
| 38 | Z03 | `renders/size-comparisons/Z03_greatwhite-vs-cretoxyrhina.mp4` | L2 full-frame graphic | 5:09.00 | 5:14.50 | 5.5 | — | Checklist: same body, teeth, size (great white vs Cretoxyrhina) |
| 39 | E10 | `renders/full-frame/E10_western-interior-seaway-map.mp4` | L2 full-frame graphic | 5:37.40 | 5:50.10 | 12.7 | — | Map: Western Interior Seaway, Cretoxyrhina, Kansas |
| 40 | F02 | `renders/overlays/F02_teeth-in-mosasaur-backbones.mov` | L4 transparent overlay | 5:49.90 | 5:54.50 | 4.6 | right half | Evidence: teeth embedded in mosasaur backbones |
| 41 | SC12 | `renders/scenes/SC12_tylosaurus-slams-the-carcass-sharks-scatter.mp4` | L1 story scene (full-screen) | 6:00.30 | 6:11.70 | 11.4 | — | Story: Tylosaurus slams the carcass, both sharks scatter |
| 42 | S06 | `renders/species-cards/S06_tylosaurus.mov` | L4 transparent overlay | 6:10.20 | 6:15.20 | 5.0 | on top of footage | Species ID: Tylosaurus |
| 43 | F03 | `renders/overlays/F03_tylosaurus-stomach.mov` | L4 transparent overlay | 6:14.40 | 6:20.60 | 6.2 | lower right | Evidence: Tylosaurus stomach contents |
| 44 | T04 | `renders/tier-system/T04_cretaceous_BARELY.mp4` | L3 tier clip (full-frame) | 6:18.72 | 6:23.37 | 4.7 | — | Tier: Cretaceous → BARELY (drop on "Barely") |
| 45 | O03 | `renders/overlays/O03_asteroid-impact.mov` | L4 transparent overlay | 6:23.40 | 6:28.00 | 4.6 | full width (flash + rings) | Asteroid impact, mosasaurs vanish |
| 46 | C05 | `renders/title-cards/TITLE_05_late-eocene.mp4` | L3 title card (full-frame) | 6:32.84 | 6:35.24 | 2.4 | — | Title card: Late Eocene (Ocean 5 of 6) |
| 47 | SC13 | `renders/scenes/SC13_great-white-takes-the-whale-calf.mp4` | L1 story scene (full-screen) | 6:38.40 | 6:54.00 | 15.6 | — | Story: great white takes the whale calf, clean kill |
| 48 | E11 | `renders/full-frame/E11_tethys-sea-egypt-map.mp4` | L2 full-frame graphic | 6:54.80 | 7:03.50 | 8.7 | — | Map: Tethys Sea, Egypt now desert |
| 49 | S07 | `renders/species-cards/S07_dorudon.mov` | L4 transparent overlay | 7:03.50 | 7:08.50 | 5.0 | on top of footage | Species ID: Dorudon |
| 50 | G04 | `renders/overlays/G04_dorudon-warm-surfaces.mov` | L4 transparent overlay | 7:09.60 | 7:16.80 | 7.2 | right half | Dorudon: warm-blooded, surfaces to breathe, familiar prey |
| 51 | G05 | `renders/overlays/G05_no-mosasaurs-no-pliosaurs.mov` | L4 transparent overlay | 7:16.20 | 7:24.10 | 7.9 | right half | No mosasaurs, no pliosaurs |
| 52 | SC14 | `renders/scenes/SC14_basilosaurus-slides-past-takes-a-calf.mp4` | L1 story scene (full-screen) | 7:24.80 | 7:36.40 | 11.6 | — | Story: Basilosaurus slides past the shark and takes a calf |
| 53 | Z04 | `renders/size-comparisons/Z04_basilosaurus-vs-greatwhite-vs-dorudon.mp4` | L2 full-frame graphic | 7:35.80 | 7:40.70 | 4.9 | — | Size check: Basilosaurus 15–18 m vs great white and Dorudon |
| 54 | F04 | `renders/overlays/F04_basilosaurus-stomach-and-bite-marks.mov` | L4 transparent overlay | 7:40.70 | 7:47.00 | 6.3 | centre/right | Evidence: young Dorudon in stomach, calf skulls with bite marks |
| 55 | G06 | `renders/overlays/G06_hunts-calves-not-sharks.mov` | L4 transparent overlay | 7:46.80 | 7:50.20 | 3.4 | centre/right | Basilosaurus hunts calves, not sharks |
| 56 | F05 | `renders/overlays/F05_shark-teeth-among-bones.mov` | L4 transparent overlay | 7:52.70 | 7:58.10 | 5.4 | right half | Evidence: shark teeth among its bones |
| 57 | T05 | `renders/tier-system/T05_eocene_THRIVES.mp4` | L3 tier clip (full-frame) | 8:02.33 | 8:08.43 | 6.1 | — | Tier: Eocene → THRIVES |
| 58 | C06 | `renders/title-cards/TITLE_06_early-pliocene.mp4` | L3 title card (full-frame) | 8:10.11 | 8:12.51 | 2.4 | — | Title card: Early Pliocene (Ocean 6 of 6) |
| 59 | SC15 | `renders/scenes/SC15_megalodon-rises-into-the-blood.mp4` | L1 story scene (full-screen) | 8:12.20 | 8:36.80 | 24.6 | — | Story: megalodon rises into the blood, carcass jerks sideways |
| 60 | S09 | `renders/species-cards/S09_megalodon.mov` | L4 transparent overlay | 8:31.40 | 8:36.40 | 5.0 | on top of footage | Species ID: megalodon |
| 61 | Z05 | `renders/size-comparisons/Z05_MEGALODON-payoff-16m-three-great-whites.mp4` | L2 full-frame graphic | 8:37.00 | 8:48.60 | 11.6 | — | PAYOFF: megalodon ~16 m = three great whites |
| 62 | E12 | `renders/full-frame/E12_great-whites-spread-worldwide-map.mp4` | L2 full-frame graphic | 8:57.10 | 9:06.30 | 9.2 | — | Map: great whites spread from the Pacific to worldwide |
| 63 | E13 | `renders/overlays/E13_tooth-chemistry-overlap.mov` | L4 transparent overlay | 9:06.20 | 9:15.10 | 8.9 | right half | Tooth chemistry: overlapping food-chain levels |
| 64 | E14 | `renders/overlays/E14_diet-megalodon-vs-great-white.mov` | L4 transparent overlay | 9:15.30 | 9:27.90 | 12.6 | full width | Diet: megalodon big meals vs great white flexible |
| 65 | E15 | `renders/overlays/E15_timeline-megalodon-gone-3-6-mya.mov` | L4 transparent overlay | 9:28.00 | 9:44.30 | 16.3 | lower half | Timeline: megalodon gone ~3.6 MYA, cause debated |
| 66 | T06 | `renders/tier-system/T06_pliocene_SURVIVES.mp4` | L3 tier clip (full-frame) | 9:44.50 | 9:53.10 | 8.6 | — | Tier: Pliocene → SURVIVES |
| 67 | T07 | `renders/tier-system/T07_final-board_ENDING-14s.mp4` | L3 tier clip (full-frame) | 9:54.30 | 10:08.30 | 14.0 | — | Final board (to the end of the VO) |

**Delivered but not placed in the assembled video:** `S05` Cretoxyrhina card (the seaway map already names it; optional at 5:37.5), `S08` Basilosaurus card (optional; Z04 covers it), `T07b` short 3 s final board.

### Footage slots (paragraphs of the voiceover)

Name your footage `p<N>.mp4` using the first column.

| Paragraph | Start | End | Voiceover |
|---|---|---|---|
| p0 | 0:00.07 | 0:06.82 | A modern great white is cruising through a murky sea, 370 million years before its species |
| p1 | 0:07.44 | 0:09.92 | Five meters long. Over a ton. |
| p2 | 0:10.88 | 0:15.34 | And something is rising underneath it — a fish with its head sealed in bone. |
| p3 | 0:16.27 | 0:17.11 | It lunges. |
| p4 | 0:17.98 | 0:28.17 | Its jaws snap open in about a fiftieth of a second, fast enough to suck prey straight in.  |
| p5 | 0:29.23 | 0:40.51 | This is the first of six prehistoric oceans. Some it rules. One it can't survive at all. A |
| p6 | 0:41.70 | 0:46.55 | The great white doesn't flee. It circles low, under the armor, and comes back. |
| p7 | 0:47.56 | 0:50.47 | This time, Dunkleosteus is the one that backs off. |
| p8 | 0:51.50 | 1:02.47 | The armored fish is Dunkleosteus. A 2023 study puts it at around three and a half meters,  |
| p9 | 1:03.16 | 1:22.24 | On paper, the great white is slightly bigger. In practice, the gap is wider than that. The |
| p10 | 1:23.07 | 1:24.24 | And there's plenty to eat. |
| p11 | 1:25.13 | 1:42.20 | The problem is the water. Late Devonian rocks are full of black shale, the record of repea |
| p12 | 1:43.00 | 1:45.88 | When those dead zones spread, there's nowhere to hide. |
| p13 | 1:47.06 | 1:49.02 | It survives. For now. |
| p14 | 1:50.48 | 1:57.30 | Those dead zones are a warning. About 120 million years later, the entire ocean turns agai |
| p15 | 1:59.28 | 2:01.39 | The surface water feels like a hot tub. |
| p16 | 2:02.50 | 2:07.66 | The great white slows. Its gills are working harder, and every pass brings in less. |
| p17 | 2:08.65 | 2:21.34 | This is the ocean after the Great Dying. Somewhere between 80 and 90 percent of marine spe |
| p18 | 2:21.94 | 2:33.79 | That's far hotter than any sea it has ever swum. Its warm body was built for cold water. H |
| p19 | 2:34.40 | 2:36.95 | So it dives, looking for cooler water. |
| p20 | 2:37.91 | 2:49.48 | Deeper. Then deeper still. It doesn't get cooler. It gets worse. The shark drops into a de |
| p21 | 2:50.34 | 2:56.25 | In this ocean, the heat reaches far below the surface, and oxygen-starved water spreads th |
| p22 | 2:56.88 | 3:03.20 | And there's almost nothing worth eating. The big predators are gone. Most of what survives |
| p23 | 3:03.76 | 3:12.68 | Cooler water exists far to the north and south. But it's a long swim through empty sea, an |
| p24 | 3:13.67 | 3:18.56 | This is where the great white dies. Not to a predator. To the ocean itself. |
| p25 | 3:20.14 | 3:25.43 | The seas take about 5 million years to recover. And when they do, reptiles own them. |
| p26 | 3:27.47 | 3:32.35 | A new great white drops in, 100 million years later. It's already hunting. |
| p27 | 3:33.13 | 3:40.78 | Above it, a shape breaks the surface to breathe. An ichthyosaur. Dolphin-shaped, fast, and |
| p28 | 3:41.36 | 3:50.34 | The great white comes straight up from below, the way it hits seals today. It connects beh |
| p29 | 3:51.30 | 4:00.87 | That ambush works here. Ichthyosaurs breathe air. Sooner or later, every one of them has t |
| p30 | 4:01.54 | 4:03.31 | And this sea is full of food. |
| p31 | 4:04.42 | 4:05.60 | But blood carries. |
| p32 | 4:06.50 | 4:08.75 | Something much bigger is coming up the trail. |
| p33 | 4:09.87 | 4:13.51 | Then jaws close on the carcass, one body-length from the shark. |
| p34 | 4:14.06 | 4:15.37 | The great white lets go. |
| p35 | 4:16.37 | 4:23.51 | Pliosaurus. Up to 12 meters long, with a skull about two meters from snout to back — longe |
| p36 | 4:24.19 | 4:30.55 | Fossil bones from this sea carry its tooth marks: ichthyosaurs, plesiosaurs, even other pl |
| p37 | 4:31.60 | 4:35.28 | The shark circles once at the edge of the red water, then turns away. |
| p38 | 4:36.23 | 4:45.15 | That's the pattern here. The great white can still catch ichthyosaurs. It just can't alway |
| p39 | 4:46.09 | 4:48.94 | It survives. But it just lost the top spot. |
| p40 | 4:50.51 | 4:55.23 | The next ocean is more crowded. And one of the hunters in it looks a lot like a great whit |
| p41 | 4:57.40 | 5:02.89 | Another great white drops in, 65 million years later. And it's already fighting. |
| p42 | 5:03.76 | 5:13.67 | It's tearing into a dead mosasaur when a second shark slams into the carcass from the othe |
| p43 | 5:14.33 | 5:23.16 | They collide over the meat. Jaws snap inches apart. The great white twists, rakes a flank, |
| p44 | 5:24.21 | 5:33.80 | The second pass is harder. Teeth drag across skin on both sides. Then both sharks peel awa |
| p45 | 5:34.44 | 5:36.66 | Neither one wins. They split it. |
| p46 | 5:37.59 | 5:43.79 | This warm, shallow sea runs straight through the middle of North America, and the other sh |
| p47 | 5:44.38 | 5:53.08 | Nearly complete skeletons from Kansas show a body built almost exactly like a great white' |
| p48 | 5:54.07 | 5:59.54 | That's the cost of meeting an equal. Every carcass is shared. Every hunt has a rival. |
| p49 | 6:00.32 | 6:02.23 | And a shared meal draws attention. |
| p50 | 6:03.34 | 6:09.63 | A bony snout slams into the carcass from below, hard enough to knock it sideways. Both sha |
| p51 | 6:10.21 | 6:18.92 | Tylosaurus. A mosasaur, a giant marine lizard. One was found with a plesiosaur in its stom |
| p52 | 6:20.22 | 6:22.11 | It survives. Barely. |
| p53 | 6:23.72 | 6:32.84 | Then the asteroid hits. The mosasaurs vanish. And over the next 30 million years, the ocea |
| p54 | 6:34.47 | 6:40.21 | A new great white drops in, nearly 50 million years later. And this time, it eats. |
| p55 | 6:41.17 | 6:50.98 | A young whale drifts up to breathe in warm, shallow water. The shark comes from below and  |
| p56 | 6:51.97 | 6:53.91 | Clean kill. First try. |
| p57 | 6:54.98 | 7:02.25 | This is the Tethys Sea, along a coastline that's now desert in Egypt. And it's full of exa |
| p58 | 7:03.52 | 7:16.36 | The calf is Dorudon, a whale that grows to about five meters and comes to these shallows t |
| p59 | 7:17.01 | 7:23.71 | No mosasaurs. No pliosaurs. The giant marine reptiles are gone, and nothing has taken thei |
| p60 | 7:24.79 | 7:27.81 | But the blood draws something long. Very long. |
| p61 | 7:28.57 | 7:33.60 | It slides past the shark without turning, finds a calf of its own, and clamps down on the  |
| p62 | 7:34.58 | 7:46.32 | Basilosaurus. A whale too, but serpent-shaped and 15 to 18 meters long. One was found with |
| p63 | 7:46.93 | 7:48.93 | It hunts calves, not sharks. |
| p64 | 7:49.87 | 7:57.76 | And that same fossil holds one more detail. Mixed in with its bones were shark teeth. When |
| p65 | 7:59.11 | 8:04.73 | It isn't the biggest predator here. It doesn't need to be. Here, the great white thrives. |
| p66 | 8:06.25 | 8:10.11 | But the whales keep getting bigger. And so does the shark that eats them. |
| p67 | 8:12.19 | 8:19.69 | A new great white drops in, 33 million years later. It's on a dead whale in cool Pacific w |
| p68 | 8:20.32 | 8:24.26 | Then a shadow passes underneath. It takes a long time to pass. |
| p69 | 8:25.28 | 8:30.53 | The great white leaves the carcass. Instantly. No circling. No second pass. |
| p70 | 8:31.47 | 8:36.37 | Megalodon rises into the blood, and the whole carcass jerks sideways in its jaws. |
| p71 | 8:37.40 | 8:47.78 | One well-studied megalodon skeleton from Belgium works out to about 16 meters long. That's |
| p72 | 8:49.07 | 8:54.32 | And this is where the story changes. Because this is the one ocean where we don't have to  |
| p73 | 8:55.12 | 9:05.48 | Great whites really were here. They show up in the Pacific around six million years ago, a |
| p74 | 9:06.36 | 9:14.76 | Chemistry in their teeth shows the two sharks fed at overlapping levels of the food chain. |
| p75 | 9:15.39 | 9:26.82 | But they weren't built the same. Megalodon needed enormous meals to keep a body that size  |
| p76 | 9:28.06 | 9:31.86 | As the oceans cooled and prey shifted, that flexibility mattered. |
| p77 | 9:32.68 | 9:43.43 | By about 3.6 million years ago, megalodon was gone. Whether great whites helped push it ou |
| p78 | 9:44.59 | 9:47.26 | So would a great white survive megalodon's ocean? |
| p79 | 9:48.30 | 9:49.19 | It already did. |
| p80 | 9:50.23 | 9:51.94 | It never had to beat megalodon. |
| p81 | 9:52.71 | 9:54.19 | It just had to outlast it. |
| p82 | 9:56.21 | 9:58.27 | So what do you think — did we get it right? |
| p83 | 9:59.10 | 10:07.60 | Because if these oceans prove anything, it's that survival was never just about being the  |

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
