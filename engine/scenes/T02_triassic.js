import { placementScene } from '../lib/placementScene.js';
export default placementScene({ out: '01_tier-board/T02_triassic_DIES', before: { survives: ['devonian'] }, pool: ['triassic', 'jurassic', 'cretaceous', 'eocene', 'pliocene'], oceanId: 'triassic', target: 'dies' });
