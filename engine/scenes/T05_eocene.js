import { placementScene } from '../lib/placementScene.js';
export default placementScene({ out: '01_tier-board/T05_eocene_THRIVES', before: { survives: ['devonian', 'jurassic'], dies: ['triassic'], barely: ['cretaceous'] }, pool: ['eocene', 'pliocene'], oceanId: 'eocene', target: 'thrives' });
