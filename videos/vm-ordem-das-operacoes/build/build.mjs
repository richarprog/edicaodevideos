// Gera index.html, compositions/lousa.html e compositions/legendas.html.
// Os tempos vêm de build/timing.json (gerado a partir da narração) ou, se ele
// não existir, de uma estimativa a 2,4 palavras/s. Uso: node build/build.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const W = 1080, H = 1920;
const C = { board: "#1F3A2D", board2: "#183024", chalk: "#F2EFE4", soft: "rgba(242,239,228,.55)", yellow: "#F5D547" };

import { SENT } from "./roteiro.mjs";
const words = SENT.map((s) => s.split(/\s+/));

// timing: [[start,end] por palavra] por frase
let T, AUDIO = null;
if (existsSync("build/timing.json")) {
  const j = JSON.parse(readFileSync("build/timing.json", "utf8"));
  T = j.words; AUDIO = j.audio;
} else {
  T = []; let t = 0.4;
  for (const ws of words) { T.push(ws.map(() => { const a = t; t += 1 / 2.4; return [+a.toFixed(3), +t.toFixed(3)]; })); t += 0.4; }
}
const wt = (s, i) => T[s][i][0];                 // início da palavra i da frase s (0-based)
const send = (s) => T[s][T[s].length - 1][1];    // fim da frase s
const LAST = SENT.length - 1;
const END_CARD = +(send(LAST) + 0.6).toFixed(2);
const DUR = +(END_CARD + 3.0).toFixed(2);
const AUDIO_DUR = AUDIO ? +parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", AUDIO]).toString()).toFixed(3) : 0;

const FONTS = `
@font-face{font-family:"Kalam";src:url("assets/fonts/kalam-latin-700-normal.woff2") format("woff2");font-weight:700}
@font-face{font-family:"Kalam";src:url("assets/fonts/kalam-latin-400-normal.woff2") format("woff2");font-weight:400}
@font-face{font-family:"Patrick Hand";src:url("assets/fonts/patrick-hand-latin-400-normal.woff2") format("woff2");font-weight:400}`;

// ---------------- cena: a lousa ----------------
const lousa = `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8" /></head><body>
<template>
<style>
${FONTS}
#root{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:hidden;color:${C.chalk};font-family:"Kalam",cursive;
  background:radial-gradient(ellipse 60% 40% at 30% 25%,rgba(255,255,255,.06),transparent 70%),radial-gradient(ellipse 50% 35% at 75% 70%,rgba(255,255,255,.05),transparent 70%),${C.board}}
#root .dust{position:absolute;inset:0;opacity:.22}
#root .t{position:absolute;left:60px;right:60px;text-align:center;line-height:1.05;white-space:nowrap}
#root .y{color:${C.yellow}}
#root .s{color:${C.soft}}
#root .w{display:inline-block}
#root .hd{top:250px;font:400 66px "Patrick Hand";color:${C.soft};opacity:0}
#root .ttl{top:250px;font:400 66px "Patrick Hand";color:${C.soft}}
#root .q{top:520px;font:700 122px "Kalam"}
#root .row{font:700 82px "Kalam";opacity:0}
#root .eq{font:700 110px "Kalam";opacity:0}
#root .box{display:inline-block;position:relative}
#root .box i{position:absolute;left:-18px;right:-18px;top:-6px;bottom:-10px;border:6px solid ${C.yellow};border-radius:22px;opacity:0}
#root .no{position:relative;display:inline-block}
#root .no i{position:absolute;left:-10px;right:-10px;top:50%;height:9px;background:${C.yellow};border-radius:5px;transform:scaleX(0);transform-origin:0 50%}
#root .st{font:700 84px "Kalam";opacity:0}
#root .st small{font:400 54px "Patrick Hand";color:${C.soft};margin-left:22px}
#root .ch2{font:400 66px "Patrick Hand";color:${C.soft};opacity:0}
#root .end{top:600px;font:700 120px/1.15 "Kalam";opacity:0;white-space:normal}
#root .endsub{top:930px;font:700 70px "Kalam";color:${C.yellow};opacity:0}
</style>
<div id="root" data-composition-id="lousa" data-width="${W}" data-height="${H}" data-duration="${DUR}">
  <svg class="dust" viewBox="0 0 ${W} ${H}"><filter id="nz"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0"/></filter><rect width="${W}" height="${H}" filter="url(#nz)"/></svg>

  <!-- gancho (miniatura) -->
  <div class="t ttl" id="ttl">ordem das operações</div>
  <div class="t q" id="q">2 + 3 × 4 = <span class="w y" id="qq">20?</span></div>

  <div class="t hd" id="hA">na vida real</div>
  <div class="t hd" id="hB">o certo</div>
  <div class="t hd" id="hC">a ordem certa</div>
  <div class="t hd" id="hD">quer o 20?</div>
  <div class="t hd" id="hE">sua vez</div>

  <!-- A: a compra -->
  <div class="t row" id="a1" style="top:430px">1 refri: R$ 2</div>
  <div class="t row" id="a2" style="top:560px">3 lanches × R$ 4 <span class="w" id="a2b" style="opacity:0">= R$ 12</span></div>
  <div class="t row" id="a3" style="top:720px;font-size:68px">total: R$ 2 + R$ 12 = <span class="w y" id="a3y">R$ 14</span></div>

  <!-- B: a conta certa e a errada -->
  <div class="t eq" id="b1" style="top:420px">2 + <span class="box">3 × 4<i id="bx"></i></span></div>
  <div class="t eq" id="b2" style="top:580px">= 2 + 12 = <span class="w y" id="b2y">14</span></div>
  <div class="t eq s" id="b3" style="top:800px;font-size:90px"><span class="no">(2 + 3) × 4 = 20<i id="b3x"></i></span></div>
  <div class="t row" id="b4" style="top:930px;font-size:66px">5 lanches? <span class="y">você não comprou!</span></div>

  <!-- C: a ordem -->
  <div class="t st" id="c1" style="top:420px">1º &nbsp;( )<small>parênteses</small></div>
  <div class="t st" id="c2" style="top:560px">2º &nbsp;x² &nbsp;√<small>potências e raízes</small></div>
  <div class="t st" id="c3" style="top:700px">3º &nbsp;× &nbsp;÷<small>da esquerda → direita</small></div>
  <div class="t st" id="c4" style="top:840px">4º &nbsp;+ &nbsp;−<small>soma e subtração</small></div>

  <!-- D: parênteses -->
  <div class="t q" id="d1" style="top:520px;opacity:0"><span class="w y" id="dp1">(</span>2 + 3<span class="w y" id="dp2">)</span> × 4 = 20</div>
  <div class="t ch2" id="d2" style="top:760px">agora sim: 5 × 4</div>

  <!-- E: desafio -->
  <div class="t q" id="e1" style="top:520px;font-size:104px;opacity:0">10 − 2 × 3 + 4 = <span class="w y" id="e1y">?</span></div>
  <div class="t ch2" id="e2" style="top:760px">responde nos comentários</div>
  <div class="t ch2" id="e3" style="top:880px;font-size:58px">salva para não esquecer a ordem</div>

  <div class="t end" id="end">A Voz da<br/>Matemática</div>
  <div class="t endsub" id="endsub">( ) → x² → × ÷ → + −</div>
</div>
<script>
(function () {
  const R = document.getElementById("root");
  const $ = (s) => R.querySelector(s);
  const tl = gsap.timeline({ paused: true });
  const IR = { immediateRender: false };
  const show = (el, t, d) => tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: d == null ? 0.3 : d, ease: "power1.out", ...IR }, t);
  const hide = (el, t, d) => tl.to(el, { opacity: 0, duration: d == null ? 0.3 : d, ease: "power1.in" }, t);
  const pop = (el, t, s) => tl.fromTo(el, { scale: s || 1.35 }, { scale: 1, duration: 0.45, ease: "back.out(2.5)", ...IR }, t);
  const up = (el, t) => tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", ...IR }, t);
  const W_ = ${JSON.stringify(T)};
  const wt = (s, i) => W_[s][i][0];

  // gancho: "2 + 3 × 4 = 20?" já na miniatura
  pop($("#qq"), wt(0, 6), 1.5);

  // A — a compra
  const s1 = wt(1, 0);
  hide([$("#ttl"), $("#q")], s1 - 0.2, 0.3);
  show($("#hA"), s1, 0.3);
  up($("#a1"), wt(1, 4));
  up($("#a2"), wt(1, 9));
  show($("#a2b"), wt(2, 5), 0.3);
  up($("#a3"), wt(2, 7)); pop($("#a3y"), wt(2, 12), 1.5);

  // B — por isso × vem antes; o erro de somar primeiro
  const s3 = wt(3, 0);
  hide([$("#hA"), $("#a1"), $("#a2"), $("#a3")], s3 - 0.2, 0.3);
  show($("#hB"), s3, 0.3);
  up($("#b1"), s3);
  show($("#bx"), wt(3, 3), 0.25);
  up($("#b2"), wt(3, 5)); pop($("#b2y"), wt(3, 7), 1.5);
  up($("#b3"), wt(4, 4));
  tl.to($("#b3x"), { scaleX: 1, duration: 0.3, ease: "power2.out" }, wt(4, 10));
  up($("#b4"), wt(4, 12));

  // C — a ordem
  const s5 = wt(5, 0);
  hide([$("#hB"), $("#b1"), $("#b2"), $("#b3"), $("#b4")], s5 - 0.2, 0.3);
  show($("#hC"), s5, 0.3);
  up($("#c1"), wt(5, 6) - 0.1);
  up($("#c2"), wt(6, 1) - 0.1);
  up($("#c3"), wt(7, 1) - 0.1);
  up($("#c4"), wt(8, 2) - 0.1);

  // D — parênteses mudam a conta
  const s9 = wt(9, 0);
  hide([$("#hC"), $("#c1"), $("#c2"), $("#c3"), $("#c4")], s9 - 0.2, 0.3);
  show($("#hD"), s9, 0.3);
  up($("#d1"), wt(9, 8) - 0.1);
  pop($("#dp1"), wt(9, 12), 1.6); pop($("#dp2"), wt(9, 13), 1.6);
  up($("#d2"), wt(9, 9));

  // E — desafio
  const s10 = wt(10, 0);
  hide([$("#hD"), $("#d1"), $("#d2")], s10 - 0.2, 0.3);
  show($("#hE"), s10, 0.3);
  up($("#e1"), wt(10, 4) - 0.1); pop($("#e1y"), wt(10, 12), 1.6);
  show($("#e2"), wt(10, 13), 0.3);
  show($("#e3"), wt(11, 0), 0.3);

  // marca
  hide([$("#hE"), $("#e1"), $("#e2"), $("#e3")], ${END_CARD} - 0.3, 0.3);
  tl.fromTo($("#end"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", ...IR }, ${END_CARD});
  show($("#endsub"), ${END_CARD} + 0.6, 0.4);

  tl.seek(0);
  window.__timelines["lousa"] = tl;
})();
</script>
</template></body></html>
`;

// ---------------- legendas ----------------
// grupos de até 4 palavras, quebrando no fim da frase
const groups = [];
T.forEach((ws, s) => {
  for (let i = 0; i < ws.length; i += 4) {
    const idx = ws.slice(i, i + 4).map((_, k) => i + k);
    groups.push({ text: idx.map((k) => words[s][k]).join(" "), start: ws[idx[0]][0], end: ws[idx[idx.length - 1]][1] });
  }
});
groups.forEach((g, i) => { const nx = groups[i + 1]; g.end = Math.min(nx ? nx.start : g.end + 0.4, g.end + 0.35); });
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const legendas = `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8" /></head><body>
<template>
<style>
${FONTS}
#root{position:absolute;inset:0;width:${W}px;height:${H}px;pointer-events:none}
#root .cg{position:absolute;left:0;right:0;top:1190px;text-align:center;font:400 62px/1.1 "Patrick Hand";color:${C.chalk};opacity:0;padding:0 90px}
</style>
<div id="root" data-composition-id="legendas" data-width="${W}" data-height="${H}" data-duration="${DUR}">
${groups.map((g, i) => `  <div class="cg" id="c${i}">${esc(g.text)}</div>`).join("\n")}
</div>
<script>
(function () {
  const tl = gsap.timeline({ paused: true });
  const G = ${JSON.stringify(groups.map((g) => [+g.start.toFixed(3), +g.end.toFixed(3)]))};
  G.forEach(([a, b], i) => {
    const el = document.getElementById("c" + i);
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.12, immediateRender: false }, Math.max(0.1, a));
    tl.to(el, { opacity: 0, duration: 0.1, ease: "power2.in" }, b - 0.1);
    tl.set(el, { opacity: 0, visibility: "hidden" }, b);
  });
  tl.seek(0);
  window.__timelines["legendas"] = tl;
})();
</script>
</template></body></html>
`;

// ---------------- raiz ----------------
const index = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<script src="assets/vendor/gsap.min.js"></script>
<style>*{margin:0;padding:0;box-sizing:border-box} html,body{width:${W}px;height:${H}px;overflow:hidden;background:${C.board}}
#main{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style>
</head>
<body>
<div id="main" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">
  <div id="lousa" class="clip" data-composition-id="lousa" data-composition-src="compositions/lousa.html" data-start="0" data-duration="${DUR}" data-track-index="1" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>
  <div id="legendas" class="clip" data-composition-id="legendas" data-composition-src="compositions/legendas.html" data-start="0" data-duration="${DUR}" data-track-index="2" data-track-kind="captions" data-width="${W}" data-height="${H}" style="z-index:2"></div>
${AUDIO ? `  <audio id="narracao" src="${AUDIO}" data-start="0" data-duration="${AUDIO_DUR}" data-track-index="10" data-volume="1"></audio>\n` : ""}</div>
<script>window.__timelines["main"] = gsap.timeline({ paused: true });</script>
</body>
</html>
`;

writeFileSync("compositions/lousa.html", lousa);
writeFileSync("compositions/legendas.html", legendas);
writeFileSync("index.html", index);
console.log(`duração ${DUR}s · fim da narração ${send(LAST)}s · ${groups.length} grupos de legenda · áudio: ${AUDIO || "nenhum (tempos estimados)"}`);
