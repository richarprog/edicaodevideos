// Sincroniza o vídeo com uma narração real.
// Uso: node build/sync.mjs assets/narracao.mp3 && node build/build.mjs
// Detecta as pausas da fala (ffmpeg silencedetect), casa cada trecho de fala com uma
// frase do roteiro e distribui as palavras dentro do trecho pelo número de letras.
// A narração precisa ler as 11 frases do roteiro, com uma pausa curta entre elas.
import { execFileSync, spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const file = process.argv[2] || "assets/narracao.mp3";
const SENT = [
  "Um celular de mil e quatrocentos reais, com vinte por cento de desconto.",
  "Quanto você economiza?",
  "Imagine os mil e quatrocentos como uma barra inteira: isso é cem por cento.",
  "Agora, divida a barra em dez partes iguais.",
  "Cada parte vale cento e quarenta.",
  "Isso é dez por cento.",
  "Vinte por cento são duas partes.",
  "Cento e quarenta, mais cento e quarenta... duzentos e oitenta!",
  "Você economiza duzentos e oitenta reais, e paga mil cento e vinte.",
  "O truque: para achar dez por cento, tire um zero.",
  "Para vinte, é só dobrar.",
];

const probe = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString();
const dur = parseFloat(probe);
const log = spawnSync("ffmpeg", ["-hide_banner", "-i", file, "-af", "silencedetect=noise=-38dB:d=0.18", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const sil = [];
for (const m of log.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)) sil.push([+m[1], +m[2]]);

// trechos de fala = intervalos entre silêncios
let speech = [], t = 0;
for (const [a, b] of sil) { if (a - t > 0.12) speech.push([t, a]); t = b; }
if (dur - t > 0.12) speech.push([t, dur]);

// junta trechos até sobrarem 11, sempre unindo a menor pausa
while (speech.length > SENT.length) {
  let k = 0, best = Infinity;
  for (let i = 0; i < speech.length - 1; i++) { const g = speech[i + 1][0] - speech[i][1]; if (g < best) { best = g; k = i; } }
  speech.splice(k, 2, [speech[k][0], speech[k + 1][1]]);
}
if (speech.length < SENT.length) {
  console.error(`Encontrei só ${speech.length} trechos de fala para ${SENT.length} frases. Grave com uma pausa curta entre as frases.`);
  process.exit(1);
}

const words = SENT.map((s, i) => {
  const ws = s.split(/\s+/), [a, b] = speech[i];
  const w = ws.map((x) => x.replace(/[^\p{L}\p{N}]/gu, "").length + 1), tot = w.reduce((p, c) => p + c, 0);
  let c = a;
  return ws.map((_, k) => { const s0 = c; c += ((b - a) * w[k]) / tot; return [+s0.toFixed(3), +c.toFixed(3)]; });
});
writeFileSync("build/timing.json", JSON.stringify({ audio: file, words }, null, 1));
console.log(`ok: ${speech.length} frases sincronizadas em ${dur.toFixed(2)}s → build/timing.json`);
