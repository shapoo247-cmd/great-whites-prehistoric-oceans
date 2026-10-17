"""Single source of truth: every graphic, where it sits on the VO timeline, and the file that holds it."""
import re, os
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
def out_of(scene):
    s = open(f'{R}/engine/scenes/{scene}.js').read()
    o = re.search(r"out:\s*'([^']+)'", s).group(1); alpha = re.search(r'alpha:\s*true', s) is not None or 'docSpecies' in s
    return o + ('.mov' if alpha else '.mp4')
def dur_of(scene):
    s = open(f'{R}/engine/scenes/{scene}.js').read()
    m = re.search(r'\bD\s*=\s*([\d.]+)', s) or re.search(r'duration:\s*([\d.]+)', s)
    return float(m.group(1)) if m else None
# (id, scene or explicit file, start seconds on VO timeline, kind, what it shows)
TIER = 'tier-system/'
ITEMS = [
 ('O01', 'N_O01_stamp-devonian', 1.20, 'overlay', 'Era stamp: LATE DEVONIAN · 370 MILLION YEARS AGO'),
 ('S01', 'N_S01_great-white', 7.30, 'overlay', 'Species ID: great white (5 m, over a ton)'),
 ('E01', 'N_E01_jaw-speed', 18.00, 'overlay', 'Jaw snap 1/50 s + suction'),
 ('T00', TIER + 'T00_premise-board.mp4', 29.20, 'tier', 'Premise board: six oceans, THRIVES / DIES pulses, dive to Pliocene'),
 ('C01', 'N_TITLE_01_late-devonian', 40.50, 'title', 'Title card: Late Devonian (Ocean 1 of 6)'),
 ('S02', 'N_S02_dunkleosteus', 47.50, 'overlay', 'Species ID: Dunkleosteus'),
 ('Z01', 'N_Z01_dunkleosteus-vs-greatwhite', 54.19, 'full', 'Size check: Dunkleosteus 3.5 m vs great white 4.5 m, armor = head & shoulders'),
 ('E02', 'D_electroreception', 78.60, 'overlay', 'Electroreception: snout sensors feel a heartbeat'),
 ('E03', 'N_E03_black-shale', 86.90, 'full', 'Black shale strata: repeated dead zones, oxygen collapsed'),
 ('E04', 'D_swim-to-breathe', 93.30, 'overlay', 'Swim = breathe; warm body burns oxygen; dead zones spread'),
 ('T01', TIER + 'T01_devonian_SURVIVES.mp4', 105.56, 'tier', 'Tier: Devonian → SURVIVES (drop on "survives")'),
 ('C02', 'N_TITLE_02_early-triassic', 117.30, 'title', 'Title card: Early Triassic (Ocean 2 of 6)'),
 ('E05', 'N_E05_great-dying', 128.50, 'overlay', 'Great Dying: 80–90% of marine species gone'),
 ('E06', 'N_E06_heat-40c', 135.30, 'overlay', 'Heat: 40°C / 104°F tropical surface water'),
 ('E07', 'N_E07_oxygen-supply-demand', 145.40, 'overlay', 'Oxygen supply falls, body demand rises'),
 ('E08', 'N_E08_dive-profile', 154.30, 'overlay', 'Dive profile: deeper, dead layer, turn back to the light'),
 ('E09', 'N_E09_cooler-far-away', 183.60, 'overlay', 'Cooler water far north/south, long swim, reserves drain'),
 ('T02', TIER + 'T02_triassic_DIES.mp4', 193.26, 'tier', 'Tier: Triassic → DIES (drop on "dies")'),
 ('O02', 'N_O02_recovery', 200.00, 'overlay', '~5 million years to recover'),
 ('C03', 'N_TITLE_03_late-jurassic', 205.43, 'title', 'Title card: Late Jurassic (Ocean 3 of 6)'),
 ('S03', 'N_S03_ichthyosaur', 216.00, 'overlay', 'Species ID: ichthyosaur'),
 ('Z02', 'N_Z02_pliosaurus-vs-greatwhite', 257.50, 'full', 'Size check: Pliosaurus up to 12 m, skull ~2 m vs person'),
 ('F01', 'N_F01_tooth-marks', 264.10, 'overlay', 'Evidence: Pliosaurus tooth marks on bones'),
 ('S04', 'N_S04_pliosaurus', 271.60, 'overlay', 'Species ID: Pliosaurus (optional, if Z02 is skipped use 4:17.5)'),
 ('G01', 'N_G01_ambush-from-below', 221.20, 'overlay', 'Ambush from below: strike behind the flipper'),
 ('G02', 'N_G02_air-breathers', 232.90, 'overlay', 'Ichthyosaurs must surface to breathe, shark waits below'),
 ('G03', 'N_G03_split-carcass', 333.40, 'overlay', 'Neither shark wins: they split the carcass'),
 ('G04', 'N_G04_dorudon-surface', 429.60, 'overlay', 'Dorudon: warm-blooded, surfaces to breathe, familiar prey'),
 ('G05', 'N_G05_empty-seas', 436.90, 'overlay', 'No mosasaurs, no pliosaurs'),
 ('G06', 'N_G06_hunts-calves', 466.80, 'overlay', 'Basilosaurus hunts calves, not sharks'),
 ('T03', TIER + 'T03_jurassic_SURVIVES.mp4', 284.60, 'tier', 'Tier: Jurassic → SURVIVES'),
 ('C04', 'N_TITLE_04_late-cretaceous', 295.23, 'title', 'Title card: Late Cretaceous (Ocean 4 of 6)'),
 ('Z03', 'N_Z03_greatwhite-vs-cretoxyrhina', 309.00, 'full', 'Checklist: same body, teeth, size (great white vs Cretoxyrhina)'),
 ('E10', 'N_E10_western-interior-seaway', 337.40, 'full', 'Map: Western Interior Seaway, Cretoxyrhina, Kansas'),
 ('F02', 'N_F02_teeth-in-backbones', 349.90, 'overlay', 'Evidence: teeth embedded in mosasaur backbones'),
 ('S06', 'N_S06_tylosaurus', 370.20, 'overlay', 'Species ID: Tylosaurus'),
 ('F03', 'N_F03_tylosaurus-stomach', 374.40, 'overlay', 'Evidence: Tylosaurus stomach contents'),
 ('O03', 'N_O03_asteroid', 383.40, 'overlay', 'Asteroid impact, mosasaurs vanish'),
 ('T04', TIER + 'T04_cretaceous_BARELY.mp4', 378.72, 'tier', 'Tier: Cretaceous → BARELY (drop on "Barely")'),
 ('C05', 'N_TITLE_05_late-eocene', 392.84, 'title', 'Title card: Late Eocene (Ocean 5 of 6)'),
 ('E11', 'N_E11_tethys-egypt', 414.80, 'full', 'Map: Tethys Sea, Egypt now desert'),
 ('S07', 'N_S07_dorudon', 423.50, 'overlay', 'Species ID: Dorudon'),
 ('Z04', 'N_Z04_basilosaurus-vs-greatwhite', 455.80, 'full', 'Size check: Basilosaurus 15–18 m vs great white and Dorudon'),
 ('F04', 'N_F04_basilosaurus-stomach', 460.70, 'overlay', 'Evidence: young Dorudon in stomach, calf skulls with bite marks'),
 ('F05', 'N_F05_shark-teeth-among-bones', 472.70, 'overlay', 'Evidence: shark teeth among its bones'),
 ('T05', TIER + 'T05_eocene_THRIVES.mp4', 482.33, 'tier', 'Tier: Eocene → THRIVES'),
 ('C06', 'N_TITLE_06_early-pliocene', 490.11, 'title', 'Title card: Early Pliocene (Ocean 6 of 6)'),
 ('S09', 'N_S09_megalodon', 511.40, 'overlay', 'Species ID: megalodon'),
 ('Z05', 'N_Z05_megalodon-payoff', 517.00, 'full', 'PAYOFF: megalodon ~16 m = three great whites'),
 ('E12', 'N_E12_great-whites-spread', 537.10, 'full', 'Map: great whites spread from the Pacific to worldwide'),
 ('E13', 'N_E13_tooth-chemistry', 546.20, 'overlay', 'Tooth chemistry: overlapping food-chain levels'),
 ('E14', 'N_E14_diet', 555.30, 'overlay', 'Diet: megalodon big meals vs great white flexible'),
 ('E15', 'N_E15_timeline-megalodon-gone', 568.00, 'overlay', 'Timeline: megalodon gone ~3.6 MYA, cause debated'),
 ('T06', TIER + 'T06_pliocene_SURVIVES.mp4', 584.50, 'tier', 'Tier: Pliocene → SURVIVES'),
 ('T07', TIER + 'T07_final-board_ENDING-14s.mp4', 594.30, 'tier', 'Final board (to the end of the VO)'),
]
EXTRA = [('S05', 'N_S05_cretoxyrhina', 'Species ID: Cretoxyrhina (not placed: the seaway map names it, use at 5:37.5 if wanted)'), ('S08', 'N_S08_basilosaurus', 'Species ID: Basilosaurus (optional, Z04 covers it)'),
         ('T07b', TIER + 'T07b_final-board_3s.mp4', 'Short 3 s version of the final board')]
def remap(o):
    return re.sub(r'^06_doc-style/', '', o).replace('01_tier-board/', 'tier-system/')
def resolve(rel):
    return remap(rel if rel.endswith(('.mp4', '.mov')) else out_of(rel))
