import { chapterScene } from '../lib/chapter.js';
import { drawCreature } from '../lib/creatures.js';
import { lerp } from '../lib/core.js';
export default chapterScene({ n: 1, era: 'devonian', title: 'Late Devonian', mya: 370, prevMya: 0, jump: '370 MILLION YEARS BACK', threat: 'DUNKLEOSTEUS + LOW-OXYGEN DEAD ZONES', out: '02_chapter-cards/C01_late-devonian',
  predator: (ctx, w, t, lt) => drawCreature(ctx, 'dunkleosteus', { x: lerp(1500, 1180, t / 2), y: 760, len: 820, color: w.subject(0.42), blur: 4, phase: lt * 4, flip: true }) });
