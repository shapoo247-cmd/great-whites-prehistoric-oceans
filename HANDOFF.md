# Status / handoff — Great Whites Prehistoric Oceans (motion graphics)

Everything renders in the cloud from code in `engine/` (headless Chromium canvas → ffmpeg). All animals, oceans, cards and SFX are original (no stock, no samples) → monetization-safe.

## Deliverable agreed with Safdar
Graphics pack + a rough-cut video: VO with every graphic placed at its exact timestamp, labelled slots for his footage. **Show samples first, apply corrections, then finish.**

## Built (scenes in engine/scenes)
- Tier board (same TierMaker look as primate video): T00 premise board, T01–T06 placements (drop lands on the verdict word), T07 final board 14 s, T07b 3 s
- Chapter cards C01–C06 (2.0 s): era ocean + threat silhouette + rolling date + deep-time ruler
- Species ID overlays S01–S09 (ProRes 4444 alpha)
- Size comparisons Z01–Z05 (Z05 = Megalodon payoff)
- SFX library: engine/sfx/synth.py → engine/sfx/lib/*.wav

## Still to build
E01 jaw speed (0:18) · E02 electroreception (1:18.6) · E03 black shale (1:27) · E04 oxygen HUD (1:33.3) · E05 Great Dying 80–90% (2:08.5) · E06 40°C/104°F (2:16) · E07 O2 supply vs demand (2:25.4) · E08 dive profile (2:34.3) · E09 cooler water far away (3:03.7) · E10 Western Interior Seaway map (5:37.5) · E11 Tethys/Egypt map (6:54.9) · E12 great whites spread map (8:57.2) · E13 tooth chemistry overlap (9:06.3) · E14 diet (9:15.3) · E15 megalodon gone timeline (9:28)
Evidence overlays F01 (4:24.1) F02 (5:50) F03 (6:14.6) F04 (7:40.8) F05 (7:52.8) · stamps O01 (0:01.2) O02 (3:20.1) O03 (6:23.6)
Then: sample reel → corrections → render all → rough cut + PLACEMENT.md

## How to render
```
cd engine && npm install && python3 sfx/synth.py
node render.mjs <SceneId> [...]            # full clip -> renders/<out>.mp4|.mov (+ _SFX.wav)
node render.mjs --still <SceneId> 0.5,2    # preview PNGs
```
VO timings (word-level forced alignment): `timing/vo_sentences.txt`, `timing/vo_words.json`.
