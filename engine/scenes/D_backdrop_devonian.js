// helper: Devonian seascape backdrop (used only to preview transparent overlays)
import { Seascape } from '../lib/seascape.js';
let S; export default { duration: 12.2, out: '06_doc-style/_backdrop_devonian', setup() { S = new Seascape('devonian', 5); }, draw(ctx, t) { S.draw(ctx, t, { depth: 0.32 }); } };
