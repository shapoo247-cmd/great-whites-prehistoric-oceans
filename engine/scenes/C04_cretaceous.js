import { chapterScene } from '../lib/chapter.js';
import { drawCreature } from '../lib/creatures.js';
import { lerp } from '../lib/core.js';
export default chapterScene({ n: 4, era: 'cretaceous', title: 'Late Cretaceous', mya: 85, prevMya: 150, jump: '+65 MILLION YEARS', threatLabel: 'THREATS', threat: 'CRETOXYRHINA + TYLOSAURUS', out: '02_chapter-cards/C04_late-cretaceous',
  predator: (ctx, w, t, lt) => { drawCreature(ctx, 'tylosaurus', { x: lerp(1500, 1150, t / 2), y: 810, len: 1200, color: w.subject(0.45), blur: 5, phase: lt * 3, flip: true }); drawCreature(ctx, 'cretoxyrhina', { x: lerp(380, 520, t / 2), y: 250, len: 380, color: w.subject(0.55), blur: 4, phase: lt * 5 }); } });
