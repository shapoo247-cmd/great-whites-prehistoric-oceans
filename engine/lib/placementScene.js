import { Board, placement } from './tierboard.js';
// Factory for the six tier-placement clips (same design, same animation, same SFX language).
export function placementScene(cfg) {
  let board, anim;
  const tPick = cfg.tPick ?? 0.62, tDrop = cfg.tDrop ?? 1.6;
  const tOutA = cfg.tOutA ?? tDrop + 1.9;
  const sfx = [
    { name: 'ui_pick', t: tPick, gain: -3 },
    { name: 'whoosh_fast', t: tPick + 0.02, gain: -12 },
    { name: 'verdict_' + cfg.target, t: tDrop - 0.01, gain: 0 },
    { name: 'whoosh_slow', t: tOutA - 0.1, gain: -16 },
  ];
  if (cfg.hover) sfx.push({ name: 'ui_tick', t: cfg.hover.tArrive, gain: -6 }, { name: 'whoosh_fast', t: cfg.hover.tLeave, gain: -14 });
  return {
    duration: cfg.duration ?? tOutA + 2.6, out: cfg.out, sfx,
    async setup() { board = new Board(); await board.init(); anim = placement({ ...cfg, tPick, tDrop, tOutA }); },
    draw(ctx, t) { const { st, cam } = anim(t); board.draw(ctx, st, cam); },
  };
}
