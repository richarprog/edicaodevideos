// Sincroniza o vídeo com uma narração real.
// Uso: node build/sync.mjs assets/narracao.mp3 && node build/build.mjs
// Detecta as pausas da fala (ffmpeg silencedetect), casa cada trecho de fala com uma
// frase do roteiro e distribui as palavras dentro do trecho pelo número de letras.
// A narração precisa ler as frases de build/roteiro.mjs, com uma pausa curta entre elas.
import { execFileSync, spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const file = process.argv[2] || "assets/narracao.mp3";
import { SENT } from "./roteiro.mjs";

const probe = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString();
const dur = parseFloat(probe);
// limite de silêncio relativo ao pico do áudio (funciona antes e depois de normalizar)
const vol = spawnSync("ffmpeg", ["-hide_banner", "-i", file, "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const peak = parseFloat((vol.match(/max_volume: (-?[\d.]+) dB/) || [, "0"])[1]);
const noise = (peak - 30).toFixed(1);
const log = spawnSync("ffmpeg", ["-hide_banner", "-i", file, "-af", `silencedetect=noise=${noise}dB:d=0.15`, "-f", "null", "-"], { encoding: "utf8" }).stderr;
const sil = [];
for (const m of log.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)) sil.push([+m[1], +m[2]]);

// trechos de fala = intervalos entre silêncios
let speech = [], t = 0;
for (const [a, b] of sil) { if (a - t > 0.12) speech.push([t, a]); t = b; }
if (dur - t > 0.12) speech.push([t, dur]);

// escolhe quais pausas separam as frases (programação dinâmica): a duração de cada
// frase deve ficar proporcional ao número de letras, e pausas longas são preferidas.
const n = SENT.length, m = speech.length;
if (m < n) {
  console.error(`Encontrei só ${m} trechos de fala para ${n} frases. Grave com uma pausa curta entre as frases.`);
  process.exit(1);
}
const chars = SENT.map((x) => x.replace(/[^\p{L}\p{N}]/gu, "").length);
const k = (speech[m - 1][1] - speech[0][0]) / chars.reduce((a, b) => a + b, 0);
const gapAfter = (j) => (j < m - 1 ? speech[j + 1][0] - speech[j][1] : 1);
// cost[i][j]: melhor custo pondo as frases 0..i nos trechos 0..j (frase i termina no trecho j)
const INF = 1e18, cost = [], from = [];
for (let i = 0; i < n; i++) { cost.push(new Array(m).fill(INF)); from.push(new Array(m).fill(-1)); }
const segCost = (i, a, b) => { const d = speech[b][1] - speech[a][0], e = k * chars[i]; return ((d - e) / e) ** 2 - 0.6 * gapAfter(b); };
for (let j = 0; j < m; j++) cost[0][j] = segCost(0, 0, j);
for (let i = 1; i < n; i++)
  for (let j = i; j < m; j++)
    for (let p = i - 1; p < j; p++) {
      if (cost[i - 1][p] >= INF) continue;
      const c = cost[i - 1][p] + segCost(i, p + 1, j);
      if (c < cost[i][j]) { cost[i][j] = c; from[i][j] = p; }
    }
const ends = []; let j = m - 1;
for (let i = n - 1; i >= 0; i--) { ends.unshift(j); j = from[i][j]; }
speech = ends.map((e, i) => [speech[i === 0 ? 0 : ends[i - 1] + 1][0], speech[e][1]]);

const words = SENT.map((s, i) => {
  const ws = s.split(/\s+/), [a, b] = speech[i];
  const w = ws.map((x) => x.replace(/[^\p{L}\p{N}]/gu, "").length + 1), tot = w.reduce((p, c) => p + c, 0);
  let c = a;
  return ws.map((_, k) => { const s0 = c; c += ((b - a) * w[k]) / tot; return [+s0.toFixed(3), +c.toFixed(3)]; });
});
writeFileSync("build/timing.json", JSON.stringify({ audio: file, words }, null, 1));
console.log(`ok: ${speech.length} frases sincronizadas em ${dur.toFixed(2)}s → build/timing.json`);
