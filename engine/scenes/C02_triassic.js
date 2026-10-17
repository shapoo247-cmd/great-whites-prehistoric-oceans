import { chapterScene } from '../lib/chapter.js';
import { drawCreature } from '../lib/creatures.js';
import { lerp } from '../lib/core.js';
export default chapterScene({ n: 2, era: 'triassic', title: 'Early Triassic', mya: 250, prevMya: 370, jump: '+120 MILLION YEARS', threat: 'EXTREME HEAT · LOW OXYGEN · LITTLE FOOD', out: '02_chapter-cards/C02_early-triassic', threatColor: '#ffb04a',
  predator: (ctx, w, t, lt) => drawCreature(ctx, 'greatwhite', { x: lerp(560, 640, t / 2), y: 800, len: 420, color: w.subject(0.55), blur: 5, phase: lt * 2.5 }) });
