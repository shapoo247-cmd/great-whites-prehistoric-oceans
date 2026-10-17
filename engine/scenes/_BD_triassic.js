import { Seascape } from '../lib/seascape.js';
let S; export default { duration: 5, out: 'x', setup() { S = new Seascape('triassic', 5); }, draw(ctx, t) { S.draw(ctx, t, { depth: 0.32 }); } };
