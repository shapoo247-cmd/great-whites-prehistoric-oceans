import { placementScene } from '../lib/placementScene.js';
export default placementScene({ out: '01_tier-board/T03_jurassic_SURVIVES', before: { survives: ['devonian'], dies: ['triassic'] }, pool: ['jurassic', 'cretaceous', 'eocene', 'pliocene'], oceanId: 'jurassic', target: 'survives' });
