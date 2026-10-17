import { chapterScene } from '../lib/chapter.js';
import { drawCreature } from '../lib/creatures.js';
import { lerp } from '../lib/core.js';
export default chapterScene({ n: 6, era: 'pliocene', title: 'Early Pliocene', mya: 4, prevMya: 37, jump: '+33 MILLION YEARS', threat: 'MEGALODON', out: '02_chapter-cards/C06_early-pliocene', depth: 0.42,
  sfx: [{ name: 'impact_dark', t: 0.05, gain: -6 }],
  predator: (ctx, w, t, lt) => drawCreature(ctx, 'megalodon', { x: lerp(1700, 1250, t / 2), y: 840, len: 1900, color: w.subject(0.2), blur: 4, phase: lt * 2, flip: true }) });
