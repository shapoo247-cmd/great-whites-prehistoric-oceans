import { placementScene } from '../lib/placementScene.js';
// Question "So would a great white survive megalodon's ocean?" -> tile hovers -> drops on "It already did."
export default placementScene({ out: '01_tier-board/T06_pliocene_SURVIVES', before: { survives: ['devonian', 'jurassic'], dies: ['triassic'], barely: ['cretaceous'], thrives: ['eocene'] }, pool: ['pliocene'], oceanId: 'pliocene', target: 'survives', tPick: 0.9, hover: { tier: 'survives', tArrive: 2.4, tLeave: 3.95 }, tDrop: 4.26, duration: 8.6 });
