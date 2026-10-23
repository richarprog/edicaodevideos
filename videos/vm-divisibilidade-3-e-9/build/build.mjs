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
#root .ttl{top:230px;font:700 76px "Kalam"}
#root .big{top:440px;font:700 190px "Kalam"}
#root .sum{top:700px;font:700 110px "Kalam"}
#root .tab{top:880px;font:400 64px "Patrick Hand";color:${C.soft};opacity:0}
#root .tab .w{margin:0 10px}
#root .res{top:1030px;font:700 100px "Kalam";opacity:0}
#root .mid{font:700 84px "Kalam";opacity:0}
#root .no{color:${C.soft};position:relative}
#root .no i{position:absolute;left:-4px;right:-4px;top:52%;height:8px;background:${C.yellow};border-radius:4px;transform:scaleX(0);transform-origin:0 50%}
#root #as .w,#root #bs .w,#root #b9 .y,#root #c4y{opacity:0}
#root .end{top:600px;font:700 120px/1.15 "Kalam";opacity:0;white-space:normal}
#root .endsub{top:930px;font:400 62px "Patrick Hand";color:${C.soft};opacity:0}
</style>
<div id="root" data-composition-id="lousa" data-width="${W}" data-height="${H}" data-duration="${DUR}">
  <svg class="dust" viewBox="0 0 ${W} ${H}"><filter id="nz"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0"/></filter><rect width="${W}" height="${H}" filter="url(#nz)"/></svg>

  <div class="t ttl" id="ttl">Divisibilidade por <span class="y">3</span> e <span class="y">9</span></div>
  <div class="t hd" id="hdA">divide por <span class="y">9</span>?</div>
  <div class="t hd" id="hdB">e por <span class="y">3</span>?</div>
  <div class="t hd" id="hdC">por que funciona?</div>
  <div class="t hd" id="hdD">sua vez</div>

  <!-- parte A: 135 balas para 9 crianças -->
  <div class="t big" id="a">135</div>
  <div class="t s" id="ahk" style="top:680px;font:700 130px Kalam">÷ 9 = <span class="y">?</span></div>
  <div class="t sum" id="as"><span class="w" id="as0">1</span> <span class="w" id="as1">+ 3</span> <span class="w" id="as2">+ 5</span> <span class="w y" id="as3">= 9</span></div>
  <div class="t tab" id="at">tabuada do 9: <span class="w y" id="at0">9</span><span class="w">18</span><span class="w">27</span><span class="w">36</span><span class="w">…</span></div>
  <div class="t res" id="ar">135 ÷ 9 = <span class="y">15</span></div>

  <!-- parte B: 4872 -->
  <div class="t big" id="b" style="opacity:0">4872</div>
  <div class="t sum" id="bs"><span class="w" id="bs0">4</span> <span class="w" id="bs1">+ 8</span> <span class="w" id="bs2">+ 7</span> <span class="w" id="bs3">+ 2</span> <span class="w y" id="bs4">= 21</span></div>
  <div class="t mid" id="b3" style="top:860px">por 3: <span class="y">sim</span></div>
  <div class="t mid s" id="b3n" style="top:965px;font-size:64px">4872 ÷ 3 = 1624</div>
  <div class="t mid" id="b9" style="top:1055px">por 9: <span class="no">sim<i id="b9x"></i></span> <span class="y">não</span></div>

  <!-- parte C: por que funciona -->
  <div class="t mid" id="c1" style="top:430px">10 = <span class="s">9</span> + 1</div>
  <div class="t mid" id="c2" style="top:560px">100 = <span class="s">99</span> + 1</div>
  <div class="t mid" id="c3" style="top:740px">135 = 1×100 + 3×10 + 5</div>
  <div class="t mid" id="c4" style="top:870px">= <span class="s">(99 + 27)</span> + <span class="y" id="c4y">(1+3+5)</span></div>

  <!-- parte D: desafio -->
  <div class="t big" id="d" style="opacity:0;font-size:160px">729 ÷ 9 <span class="y">?</span></div>
  <div class="t hd" id="d2" style="top:780px">responde nos comentários</div>

  <div class="t end" id="end">A Voz da<br/>Matemática</div>
  <div class="t endsub" id="endsub">soma dos algarismos ÷ 3 ou ÷ 9</div>
</div>
<script>
(function () {
  const R = document.getElementById("root");
  const $ = (s) => R.querySelector(s), $$ = (s) => R.querySelectorAll(s);
  const tl = gsap.timeline({ paused: true });
  const IR = { immediateRender: false };
  const show = (el, t, d) => tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: d == null ? 0.3 : d, ease: "power1.out", ...IR }, t);
  const hide = (el, t, d) => tl.to(el, { opacity: 0, duration: d == null ? 0.3 : d, ease: "power1.in" }, t);
  const pop = (el, t, s) => tl.fromTo(el, { scale: s || 1.35 }, { scale: 1, duration: 0.45, ease: "back.out(2.5)", ...IR }, t);
  const up = (el, t) => tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", ...IR }, t);
  const W_ = ${JSON.stringify(T)};
  const wt = (s, i) => W_[s][i][0];
  // termos da soma começam invisíveis

  // A — gancho (miniatura): título + "135 ÷ 9 = ?"
  pop($("#ahk .y"), wt(0, 9), 1.5);
  hide($("#ttl"), wt(1, 0) - 0.2, 0.3);
  show($("#hdA"), wt(1, 0), 0.3);
  hide($("#ahk"), wt(1, 3), 0.3);
  [0, 2, 4].forEach((k, i) => up($("#as" + i), wt(2, k) - 0.05));
  up($("#as3"), wt(2, 5) - 0.05); pop($("#as3"), wt(2, 6), 1.3);
  show($("#at"), wt(3, 3), 0.35); pop($("#at0"), wt(3, 7), 1.6);
  up($("#ar"), wt(4, 3)); pop($("#ar .y"), wt(4, 6), 1.4);

  // B — e por 3?
  const s5 = wt(5, 0);
  hide([$("#hdA"), $("#a"), $("#ahk"), $("#as"), $("#at"), $("#ar")], s5 - 0.2, 0.3);
  show($("#hdB"), s5, 0.3);
  up($("#b"), wt(6, 0) - 0.1);
  [0, 2, 4, 6].forEach((k, i) => up($("#bs" + i), wt(7, k) - 0.05));
  up($("#bs4"), wt(7, 7) - 0.05); pop($("#bs4"), wt(7, 7), 1.3);
  up($("#b3"), wt(8, 3));
  up($("#b3n"), wt(8, 14));
  up($("#b9"), wt(9, 0));
  tl.to($("#b9x"), { scaleX: 1, duration: 0.3, ease: "power2.out" }, wt(9, 4));
  show($("#b9 .y"), wt(9, 13), 0.25); pop($("#b9 .y"), wt(9, 13), 1.4);

  // C — por que funciona
  const s10 = wt(10, 0);
  hide([$("#hdB"), $("#b"), $("#bs"), $("#b3"), $("#b3n"), $("#b9")], s10 - 0.2, 0.3);
  show($("#hdC"), s10, 0.3);
  up($("#c1"), wt(10, 4) - 0.1);
  up($("#c2"), wt(10, 10) - 0.1);
  up($("#c3"), wt(11, 0) - 0.1);
  up($("#c4"), wt(11, 1));
  show($("#c4y"), wt(11, 6), 0.3); pop($("#c4y"), wt(11, 10), 1.3);

  // D — desafio
  const s12 = wt(12, 0);
  hide([$("#hdC"), $("#c1"), $("#c2"), $("#c3"), $("#c4")], s12 - 0.2, 0.3);
  show($("#hdD"), s12, 0.3);
  up($("#d"), wt(12, 2) - 0.1); pop($("#d .y"), wt(12, 9), 1.5);
  show($("#d2"), wt(12, 10), 0.3);

  // marca
  hide([$("#hdD"), $("#d"), $("#d2")], ${END_CARD} - 0.3, 0.3);
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
