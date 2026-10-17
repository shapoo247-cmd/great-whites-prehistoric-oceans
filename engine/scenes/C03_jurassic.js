import { chapterScene } from '../lib/chapter.js';
import { drawCreature } from '../lib/creatures.js';
import { lerp } from '../lib/core.js';
export default chapterScene({ n: 3, era: 'jurassic', title: 'Late Jurassic', mya: 150, prevMya: 250, jump: '+100 MILLION YEARS', threat: 'PLIOSAURUS', out: '02_chapter-cards/C03_late-jurassic',
  predator: (ctx, w, t, lt) => drawCreature(ctx, 'pliosaurus', { x: lerp(1650, 1250, t / 2), y: 790, len: 1250, color: w.subject(0.4), blur: 4, phase: lt * 3, flip: true }) });
