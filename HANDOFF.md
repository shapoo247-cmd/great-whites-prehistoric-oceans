# Status / handoff — Great Whites Prehistoric Oceans (motion graphics)

**State: FINAL RENDERS DONE (documentary style), rough cut built.** Everything is original (drawn/synthesized in code) → monetization-safe.

## Deliverables (all in `renders/`)
- `title-cards/` 6 ocean title cards (full-frame mp4, ~2.4 s)
- `tier-system/` T00–T07 tier clips, one mp4 per tier placement + final boards (TierMaker look)
- `species-cards/` S01–S09 (ProRes 4444 alpha .mov)
- `overlays/` E/F/G/O graphics (ProRes 4444 alpha .mov) — place above B-roll
- `full-frame/` E03 black shale, E10/E11/E12 maps (mp4)
- `size-comparisons/` Z01–Z05 (mp4)
- every clip has `<name>_SFX.wav` (sound effects + sea ambience) and the sound embedded
- `renders/ROUGH_CUT.mp4` = VO + all graphics at exact timestamps + labelled footage slots
- `PLACEMENT.md` = timestamp table + music shift points
- `renders/_first-draft-old-style/` = the first (rejected, PowerPoint-like) draft, kept for reference only
- `samples/contact-sheets/` = one still per animation (approval sheets A–G)

## Client feedback that shaped the final look (keep following)
- Documentary / studio look, NOT PowerPoint. Rich sea backgrounds (lib/seascape.js), shaded lit animals (lib/doc.js `lit`), soft bloom (host.html).
- LESS TEXT: a few key words/numbers only, never sentences or subtitles.
- Overlays = transparent ProRes 4444 .mov (alpha). Big .mov are stored with Git LFS.
- Every cue is read from the VO word timings (engine/lib/vo.js, engine/data/vo_words.json) so graphics stay synced.

## How to work
```
cd engine && npm install && pip install scipy numpy && python3 sfx/synth.py
node render.mjs <SceneId> [...]            # -> renders/... (+ _SFX.wav, ambience added automatically)
node render.mjs --still <SceneId> 2.5      # preview PNG
python3 tools/contact_sheet.py             # approval sheets
python3 tools/rough_cut.py                 # ROUGH_CUT.mp4 + PLACEMENT.md (reads tools/manifest.py)
```
`tools/manifest.py` = single source of truth for start times. Scenes: `engine/scenes/N_*.js` (new style), `D_*.js` (2 early ones), `T*.js` (tier boards).
