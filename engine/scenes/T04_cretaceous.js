import { placementScene } from '../lib/placementScene.js';
// Fake-out: hovers over SURVIVES on "It survives." then drops into BARELY on "Barely." (1.19 s later)
export default placementScene({ out: 'tier-system/T04_cretaceous_BARELY', before: { survives: ['devonian', 'jurassic'], dies: ['triassic'] }, pool: ['cretaceous', 'eocene', 'pliocene'], oceanId: 'cretaceous', target: 'barely', hover: { tier: 'survives', tArrive: 1.6, tLeave: 2.45 }, tDrop: 2.79, tOutA: 3.55, duration: 4.65 });
