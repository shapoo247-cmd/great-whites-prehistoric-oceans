import { chapterScene } from '../lib/chapter.js';
import { drawCreature } from '../lib/creatures.js';
import { lerp } from '../lib/core.js';
export default chapterScene({ n: 5, era: 'eocene', title: 'Late Eocene', mya: 37, prevMya: 85, jump: '+48 MILLION YEARS', threatLabel: 'COMPETITOR', threat: 'BASILOSAURUS', threatColor: '#ffd36a', out: '02_chapter-cards/C05_late-eocene',
  predator: (ctx, w, t, lt) => drawCreature(ctx, 'basilosaurus', { x: lerp(1900, 1500, t / 2), y: 820, len: 1900, color: w.subject(0.42), blur: 4, phase: lt * 3, flip: true, angle: -0.04 }) });
