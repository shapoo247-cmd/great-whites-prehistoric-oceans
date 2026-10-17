// VO word timings (forced alignment). Scenes look up their cue times here so graphics stay locked to the voice.
let W = [];
export async function loadVO() {
  if (W.length) return;
  const j = await (await fetch('data/vo_words.json')).json();
  W = j.filter(x => x[0] !== '<sil>').map(x => ({ w: x[0].replace(/\(\d+\)/g, '').toLowerCase().replace(/[^a-z0-9']/g, ''), s: x[1], e: x[2] }));
}
// first occurrence of the phrase at/after `after` seconds -> { s: start of first word, e: end of last word }
export function find(phrase, after = 0) {
  const p = phrase.toLowerCase().split(/\s+/).map(x => x.replace(/[^a-z0-9']/g, ''));
  for (let i = 0; i + p.length <= W.length; i++) {
    if (W[i].s < after - 0.01) continue;
    if (p.every((x, k) => W[i + k].w === x)) return { s: W[i].s, e: W[i + p.length - 1].e };
  }
  throw new Error(`VO phrase not found: "${phrase}" after ${after}`);
}
export const s = (phrase, after = 0) => find(phrase, after).s;
export const e = (phrase, after = 0) => find(phrase, after).e;
// relative-time helper for a clip that starts at T0
export const rel = T0 => ({ s: (p, a = T0) => s(p, a) - T0, e: (p, a = T0) => e(p, a) - T0 });
