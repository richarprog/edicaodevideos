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
// Parte 1: régua com quebra de eixo (188–208 | 515–535), 20 px por unidade.
const RY = 760;
const xL = (v) => 90 + (v - 188) * 20, xR = (v) => 590 + (v - 515) * 20;
let ticks = "";
for (let v = 188; v <= 208; v++) ticks += `<line x1="${xL(v)}" y1="${RY}" x2="${xL(v)}" y2="${RY + (v % 5 ? 14 : 28)}" style="stroke-width:3"/>` + (v % 5 ? "" : `<text class="tk" x="${xL(v)}" y="${RY + 66}" text-anchor="middle">${v}</text>`);
for (let v = 515; v <= 535; v++) ticks += `<line x1="${xR(v)}" y1="${RY}" x2="${xR(v)}" y2="${RY + (v % 5 ? 14 : 28)}" style="stroke-width:3"/>` + (v % 5 ? "" : `<text class="tk" x="${xR(v)}" y="${RY + 66}" text-anchor="middle">${v}</text>`);
const X1 = xL(198), X2 = xR(523);
// Parte 2: colunas do complemento
const CX = [330, 540, 750];
const cell = (x, y, t, cls, id) => `<div class="cell ${cls}" ${id ? `id="${id}"` : ""} style="left:${x - 80}px;top:${y}px">${t}</div>`;

const lousa = `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8" /></head><body>
<template>
<style>
${FONTS}
#root{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:hidden;color:${C.chalk};font-family:"Kalam",cursive;
  background:radial-gradient(ellipse 60% 40% at 30% 25%,rgba(255,255,255,.06),transparent 70%),radial-gradient(ellipse 50% 35% at 75% 70%,rgba(255,255,255,.05),transparent 70%),${C.board}}
#root .dust{position:absolute;inset:0;opacity:.22}
#root svg.g{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:visible}
#root svg.g path,#root svg.g line{fill:none;stroke:${C.chalk};stroke-width:6;stroke-linecap:round;stroke-linejoin:round;filter:url(#chalk)}
#root svg.g .d{stroke-dasharray:1;stroke-dashoffset:1}
#root svg.g .tk{font:400 30px "Patrick Hand";fill:${C.soft}}
#root svg.g .ml{font:700 60px "Kalam";fill:${C.chalk}}
#root svg.g .yl{font:700 64px "Kalam";fill:${C.yellow}}
#root svg.g .dot{fill:${C.chalk}}
#root svg.g .gap path{stroke:${C.yellow};stroke-width:5}
#root svg.g .plus{font:700 54px "Kalam";fill:${C.yellow}}
#root .t{position:absolute;left:60px;right:60px;text-align:center;line-height:1.05;white-space:nowrap}
#root .y{color:${C.yellow}}
#root .ttl{top:230px;font:700 74px "Kalam"}
#root .ttl small{display:block;font:400 56px "Patrick Hand";color:${C.soft};margin-top:10px}
#root .hd{top:250px;font:400 66px "Patrick Hand";color:${C.soft};opacity:0}
#root .q{top:560px;font:700 150px "Kalam"}
#root .eq{top:960px;font:700 108px "Kalam";opacity:0}
#root .big{top:420px;font:700 116px "Kalam";opacity:0}
#root .cell{position:absolute;width:160px;text-align:center;font:700 120px/1 "Kalam";opacity:0}
#root .cell.s{color:${C.soft};font-size:92px}
#root .cell.r{color:${C.yellow}}
#root .box{position:absolute;width:170px;height:400px;top:620px;border:5px solid ${C.yellow};border-radius:20px;opacity:0}
#root .minus{position:absolute;left:150px;top:770px;font:700 110px "Kalam";opacity:0}
#root .sum{font:700 78px "Kalam";opacity:0}
#root .end{top:600px;font:700 120px/1.15 "Kalam";opacity:0;white-space:normal}
#root .endsub{top:930px;font:400 62px "Patrick Hand";color:${C.soft};opacity:0}
</style>
<div id="root" data-composition-id="lousa" data-width="${W}" data-height="${H}" data-duration="${DUR}">
  <svg class="dust" viewBox="0 0 ${W} ${H}"><filter id="nz"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0"/></filter><rect width="${W}" height="${H}" filter="url(#nz)"/></svg>
  <svg class="g" viewBox="0 0 ${W} ${H}">
    <defs><filter id="chalk" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs>
    <g id="ruler" opacity="0">
      <line class="d rl" pathLength="1" x1="70" y1="${RY}" x2="510" y2="${RY}"/>
      <line class="d rr" pathLength="1" x1="570" y1="${RY}" x2="1010" y2="${RY}"/>
      <path d="M510 ${RY} l12 -18 l12 36 l12 -36 l12 36 l12 -18" style="stroke-width:4;opacity:.7"/>
      ${ticks}
    </g>
    <g id="mk" opacity="0">
      <g id="gap" class="gap"><path class="d" pathLength="1" d="M${X1} 640 q0 -26 26 -26 L${(X1 + X2) / 2 - 16} 614 q16 0 16 -22 q0 22 16 22 L${X2 - 26} 614 q26 0 26 26"/>
        <text id="gq" class="yl" x="${(X1 + X2) / 2}" y="560" text-anchor="middle">?</text>
        <text id="g325" class="yl" x="${(X1 + X2) / 2}" y="560" text-anchor="middle" opacity="0">325</text></g>
      <circle class="dot" cx="${X1}" cy="${RY}" r="14"/><circle class="dot" cx="${X2}" cy="${RY}" r="14"/>
      <text id="n198" class="ml" x="${X1}" y="${RY - 34}" text-anchor="middle">198</text>
      <text id="n523" class="ml" x="${X2}" y="${RY - 34}" text-anchor="middle">523</text>
      <text id="n200" class="ml" x="${X1}" y="${RY - 34}" text-anchor="middle" opacity="0">200</text>
      <text id="n525" class="ml" x="${X2}" y="${RY - 34}" text-anchor="middle" opacity="0">525</text>
    </g>
    <text id="p1" class="plus" x="${X1 + 20}" y="${RY + 130}" text-anchor="middle" opacity="0">+2</text>
    <text id="p2" class="plus" x="${X2 + 20}" y="${RY + 130}" text-anchor="middle" opacity="0">+2</text>
  </svg>
  <div class="t ttl" id="ttl">Jeitos diferentes<br/>de subtrair<small>números naturais</small></div>
  <div class="t q" id="q">523 − 198 = <span class="y">?</span></div>
  <div class="t hd" id="hd1">jeito 1: <span class="y">compensação</span></div>
  <div class="t eq" id="eq1">523 − 198</div>
  <div class="t eq" id="eq2">525 − 200 = <span class="y">325</span></div>
  <div class="t hd" id="hd2">jeito 2: <span class="y">complemento</span></div>
  <div class="t big" id="c1">1000 − 368 <span id="c1r" class="y" style="opacity:0">= 632</span></div>
  ${CX.map((x, i) => `<div class="box" id="bx${i}" style="left:${x - 85}px"></div>`).join("")}
  ${cell(CX[0], 650, "9", "s", "a0")}${cell(CX[1], 650, "9", "s", "a1")}${cell(CX[2], 650, "10", "s", "a2")}
  <div class="minus" id="mn">−</div>
  ${cell(CX[0], 780, "3", "", "b0")}${cell(CX[1], 780, "6", "", "b1")}${cell(CX[2], 780, "8", "", "b2")}
  <svg class="g" viewBox="0 0 ${W} ${H}"><line id="uline" class="d" pathLength="1" x1="170" y1="915" x2="850" y2="915"/></svg>
  ${cell(CX[0], 935, "6", "r", "r0")}${cell(CX[1], 935, "3", "r", "r1")}${cell(CX[2], 935, "2", "r", "r2")}
  <div class="t sum" id="sm1" style="top:520px">523 − 198 → 525 − 200</div>
  <div class="t sum" id="sm2" style="top:700px">tudo do <span class="y">9</span>, o último do <span class="y">10</span></div>
  <div class="t hd" id="ch0" style="top:470px">sua vez:</div>
  <div class="t q" id="ch1" style="top:600px;font-size:118px;opacity:0">10.000 − 4.738 = <span class="y">?</span></div>
  <div class="t hd" id="ch2" style="top:820px">responde nos comentários</div>
  <div class="t end" id="end">A Voz da<br/>Matemática</div>
  <div class="t endsub" id="endsub">subtrair sem pedir emprestado</div>
</div>
<script>
(function () {
  const R = document.getElementById("root");
  const $ = (s) => R.querySelector(s), $$ = (s) => R.querySelectorAll(s);
  const tl = gsap.timeline({ paused: true });
  const IR = { immediateRender: false };
  const draw = (el, t, d, e) => tl.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: e || "power1.inOut", ...IR }, t);
  const show = (el, t, d) => tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: d == null ? 0.3 : d, ease: "power1.out", ...IR }, t);
  const hide = (el, t, d) => tl.to(el, { opacity: 0, duration: d == null ? 0.3 : d, ease: "power1.in" }, t);
  const pop = (el, t, s) => tl.fromTo(el, { scale: s || 1.3 }, { scale: 1, duration: 0.45, ease: "back.out(2.5)", ...IR }, t);
  const up = (el, t) => tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", ...IR }, t);
  const W_ = ${JSON.stringify(T)};
  const wt = (s, i) => W_[s][i][0];

  // gancho: título e a conta já na tela (miniatura)
  pop($("#q .y"), wt(0, 11), 1.5);

  // jeito 1 — compensação
  hide($("#ttl"), wt(1, 0) - 0.2, 0.3);
  show($("#hd1"), wt(1, 0), 0.35);
  tl.to($("#q"), { opacity: 0, y: 380, scale: 0.7, duration: 0.5, ease: "power2.in" }, wt(1, 2));
  tl.set($("#ruler"), { opacity: 1 }, wt(2, 3));
  draw($("#ruler .rl"), wt(2, 3), 0.6); draw($("#ruler .rr"), wt(2, 3) + 0.2, 0.6);
  tl.fromTo($$("#ruler line:not(.d), #ruler text, #ruler path"), { opacity: 0 }, { opacity: 1, duration: 0.4, ...IR }, wt(2, 5));
  show($("#mk"), wt(2, 5), 0.01);
  tl.fromTo($$("#mk .dot, #mk #n198, #mk #n523"), { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.12, ...IR }, wt(2, 5));
  up($("#eq1"), wt(2, 6));
  draw($("#gap path"), wt(2, 10), 0.6);
  tl.fromTo($("#gq"), { opacity: 0 }, { opacity: 1, duration: 0.3, ...IR }, wt(2, 10) + 0.4);
  // andam juntos: +2 nos dois (40 px), a chave vai junto
  tl.to($("#mk"), { x: 40, duration: 1.0, ease: "power2.inOut" }, wt(3, 3));
  show($$("#p1, #p2"), wt(4, 1), 0.3);
  pop($$("#p1, #p2"), wt(4, 2), 1.4);
  tl.to($$("#n198, #n523"), { opacity: 0, duration: 0.2 }, wt(5, 1) - 0.1);
  tl.to($$("#n200, #n525"), { opacity: 1, duration: 0.25 }, wt(5, 1));
  hide($("#eq1"), wt(5, 0), 0.2);
  up($("#eq2"), wt(5, 1));
  hide($$("#p1, #p2"), wt(5, 1), 0.3);
  hide($("#gq"), wt(6, 1) - 0.1, 0.1);
  tl.fromTo($("#g325"), { opacity: 0 }, { opacity: 1, duration: 0.2, ...IR }, wt(6, 1));
  pop($("#eq2 .y"), wt(6, 1), 1.4);

  // jeito 2 — complemento
  const s7 = wt(7, 0);
  hide([$("#hd1"), $("#ruler"), $("#mk"), $("#eq2")], s7 - 0.2, 0.3);
  show($("#hd2"), s7, 0.35);
  up($("#c1"), wt(8, 0) - 0.1);
  ["#b0", "#b1", "#b2"].forEach((id, i) => up($(id), wt(8, 2) + i * 0.15));
  show($("#mn"), wt(8, 2), 0.3);
  ["#a0", "#a1"].forEach((id, i) => up($(id), wt(9, 4) - 0.1 + i * 0.12));
  up($("#a2"), wt(9, 9) - 0.1);
  draw($("#uline"), wt(9, 9) + 0.3, 0.5);
  [0, 4, 8].forEach((k, i) => {
    show($("#bx" + i), wt(10, k) - 0.05, 0.2);
    tl.fromTo($("#r" + i), { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)", ...IR }, wt(10, k + 3) - 0.05);
    hide($("#bx" + i), wt(10, k + 3) + 0.35, 0.2);
  });
  tl.to($("#c1r"), { opacity: 1, duration: 0.3 }, wt(11, 1));
  pop($("#c1r"), wt(11, 1), 1.4);

  // resumo
  const s12 = wt(12, 0);
  hide($$("#hd2, #c1, .cell, #mn, #uline"), s12 - 0.2, 0.3);
  up($("#sm1"), wt(12, 1));
  up($("#sm2"), wt(12, 6));

  // desafio
  const s13 = wt(13, 0);
  hide($$("#sm1, #sm2"), s13 - 0.2, 0.3);
  show($("#ch0"), s13, 0.3);
  up($("#ch1"), wt(13, 4) - 0.1);
  pop($("#ch1 .y"), wt(13, 13), 1.5);
  show($("#ch2"), wt(13, 14), 0.3);

  // marca
  hide($$("#ch0, #ch1, #ch2"), ${END_CARD} - 0.3, 0.3);
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
