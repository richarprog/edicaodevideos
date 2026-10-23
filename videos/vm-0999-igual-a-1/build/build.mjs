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
// Reta numérica da prova 2: de x=160 a x=920, y=780.
const NY = 780, NX0 = 160, NX1 = 920;
const lousa = `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8" /></head><body>
<template>
<style>
${FONTS}
#root{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:hidden;color:${C.chalk};font-family:"Kalam",cursive;
  background:radial-gradient(ellipse 60% 40% at 30% 25%,rgba(255,255,255,.06),transparent 70%),radial-gradient(ellipse 50% 35% at 75% 70%,rgba(255,255,255,.05),transparent 70%),${C.board}}
#root .dust{position:absolute;inset:0;opacity:.22}
#root svg.g{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:visible}
#root svg.g line,#root svg.g path{fill:none;stroke:${C.chalk};stroke-width:6;stroke-linecap:round;filter:url(#chalk)}
#root svg.g .d{stroke-dasharray:1;stroke-dashoffset:1}
#root svg.g .dot{fill:${C.chalk}}
#root svg.g .ydot{fill:${C.yellow}}
#root svg.g .lb{font:700 58px "Kalam";fill:${C.chalk}}
#root svg.g .gap path{stroke:${C.yellow};stroke-width:5}
#root svg.g .yq{font:700 64px "Kalam";fill:${C.yellow}}
#root .t{position:absolute;left:60px;right:60px;text-align:center;line-height:1.05;white-space:nowrap}
#root .y{color:${C.yellow}}
#root .s{color:${C.soft}}
#root .w{display:inline-block}
#root .hd{top:250px;font:400 66px "Patrick Hand";color:${C.soft};opacity:0}
#root .sub{top:250px;font:400 64px "Patrick Hand";color:${C.soft}}
#root .q{top:520px;font:700 150px "Kalam"}
#root .ln{font:700 104px "Kalam";opacity:0}
#root .tag{font:700 72px "Kalam";color:${C.yellow};opacity:0}
#root .mid{font:700 84px "Kalam";opacity:0}
#root #l3a,#root #l3b{opacity:0}
#root .end{top:600px;font:700 120px/1.15 "Kalam";opacity:0;white-space:normal}
#root .endsub{top:930px;font:700 72px "Kalam";color:${C.yellow};opacity:0}
</style>
<div id="root" data-composition-id="lousa" data-width="${W}" data-height="${H}" data-duration="${DUR}">
  <svg class="dust" viewBox="0 0 ${W} ${H}"><filter id="nz"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0"/></filter><rect width="${W}" height="${H}" filter="url(#nz)"/></svg>
  <svg class="g" viewBox="0 0 ${W} ${H}">
    <defs><filter id="chalk" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs>
    <g id="nl" opacity="0">
      <line class="d" id="nline" pathLength="1" x1="${NX0 - 60}" y1="${NY}" x2="${NX1 + 60}" y2="${NY}"/>
      <g id="gap" class="gap"><path class="d" id="gpath" pathLength="1" d="M${NX0} ${NY - 70} q0 -24 24 -24 L${(NX0 + NX1) / 2 - 16} ${NY - 94} q16 0 16 -22 q0 22 16 22 L${NX1 - 24} ${NY - 94} q24 0 24 24"/>
        <text class="yq" id="gq" x="${(NX0 + NX1) / 2}" y="${NY - 150}" text-anchor="middle" opacity="0">?</text></g>
      <g id="pa"><circle class="dot" cx="${NX0}" cy="${NY}" r="16"/>
        <text class="lb" id="la0" x="${NX0}" y="${NY + 90}" text-anchor="middle">0,9</text>
        <text class="lb" id="la1" x="${NX0}" y="${NY + 90}" text-anchor="middle" opacity="0">0,99</text>
        <text class="lb" id="la2" x="${NX0}" y="${NY + 90}" text-anchor="middle" opacity="0">0,999</text>
        <text class="lb" id="la3" x="${NX0}" y="${NY + 90}" text-anchor="middle" opacity="0">0,999...</text></g>
      <circle class="dot" cx="${NX1}" cy="${NY}" r="16"/>
      <text class="lb" x="${NX1}" y="${NY + 90}" text-anchor="middle">1</text>
      <circle class="ydot" id="merge" cx="${NX1}" cy="${NY}" r="22" opacity="0"/>
    </g>
  </svg>

  <!-- gancho -->
  <div class="t sub" id="sub">noves infinitos…</div>
  <div class="t q" id="q">0,999... = 1 <span class="w y" id="qq">?</span></div>
  <div class="t hd" id="h1">prova 1: <span class="y">frações</span></div>
  <div class="t hd" id="h2">prova 2: <span class="y">o espaço entre eles</span></div>
  <div class="t hd" id="h3">então…</div>

  <!-- prova 1 -->
  <div class="t ln" id="l1" style="top:440px">1/3 = 0,333...</div>
  <div class="t tag" id="l2" style="top:580px">× 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; × 3</div>
  <div class="t ln" id="l3" style="top:690px;opacity:1"><span class="w" id="l3a">3/3</span> <span class="w" id="l3b">= 0,999...</span></div>
  <div class="t ln" id="l4" style="top:870px"><span class="y">1</span> = 0,999...</div>

  <!-- prova 2: textos -->
  <div class="t mid" id="p2" style="top:345px;font-size:70px;line-height:1.2">números diferentes?<br/><span class="y">sempre cabe outro no meio</span></div>
  <div class="t mid" id="p3" style="top:1000px">nenhum número cabe aqui</div>
  <div class="t mid" id="p4" style="top:1000px;font-size:70px"><span class="y">0,999... e 1</span>: o mesmo ponto</div>

  <!-- conclusão -->
  <div class="t q" id="c1" style="top:520px;opacity:0">0,999... = <span class="y">1</span></div>
  <div class="t mid s" id="c2" style="top:740px;font-size:72px;white-space:normal;line-height:1.15">dois jeitos de escrever<br/>o mesmo número</div>
  <div class="t mid" id="c3" style="top:960px;font:400 66px 'Patrick Hand';white-space:normal">você achava que era menor? comenta!</div>

  <div class="t end" id="end">A Voz da<br/>Matemática</div>
  <div class="t endsub" id="endsub">0,999... = 1</div>
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
  const pop = (el, t, s) => tl.fromTo(el, { scale: s || 1.35 }, { scale: 1, duration: 0.45, ease: "back.out(2.5)", ...IR }, t);
  const up = (el, t) => tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", ...IR }, t);
  const swap = (a, b, t) => { tl.to(a, { opacity: 0, duration: 0.12 }, t); tl.to(b, { opacity: 1, duration: 0.15 }, t + 0.05); };
  const W_ = ${JSON.stringify(T)};
  const wt = (s, i) => W_[s][i][0];

  // gancho (miniatura): "0,999... = 1 ?"
  pop($("#qq"), wt(0, 9), 1.6);
  pop($("#qq"), wt(1, 10), 1.6);

  // prova 1 — frações
  const s2 = wt(2, 0);
  hide([$("#sub"), $("#q")], s2 - 0.2, 0.3);
  show($("#h1"), s2, 0.3);
  up($("#l1"), wt(2, 2) - 0.1);
  up($("#l2"), wt(3, 0)); pop($("#l2"), wt(3, 5), 1.2);
  up($("#l3a"), wt(4, 0)); up($("#l3b"), wt(4, 12));
  up($("#l4"), wt(5, 1)); pop($("#l4 .y"), wt(5, 9), 1.6);

  // prova 2 — o espaço entre eles
  const s6 = wt(6, 0);
  hide([$("#h1"), $("#l1"), $("#l2"), $("#l3"), $("#l4")], s6 - 0.2, 0.3);
  show($("#h2"), s6, 0.3);
  up($("#p2"), wt(6, 2));
  tl.set($("#nl"), { opacity: 1 }, wt(7, 0));
  draw($("#nline"), wt(7, 0), 0.6);
  draw($("#gpath"), wt(7, 4), 0.5); show($("#gq"), wt(7, 4) + 0.3, 0.2);
  // zoom: 0,9 → 0,99 → 0,999 → 0,999...
  swap($("#la0"), $("#la1"), wt(7, 6)); pop($("#nl"), wt(7, 6), 1.05);
  swap($("#la1"), $("#la2"), wt(7, 10)); pop($("#nl"), wt(7, 10), 1.05);
  swap($("#la2"), $("#la3"), wt(8, 0)); pop($("#nl"), wt(8, 0), 1.05);
  // não sobra espaço: o ponto anda até o 1 e a chave some
  hide($("#p2"), wt(8, 0), 0.25);
  up($("#p3"), wt(8, 0));
  tl.to($("#pa"), { x: ${NX1 - NX0}, duration: 1.4, ease: "power2.inOut" }, wt(8, 4));
  tl.to($("#gap"), { scaleX: 0, transformOrigin: "${NX1}px ${NY}px", opacity: 0, duration: 1.4, ease: "power2.inOut" }, wt(8, 4));
  hide($("#la3"), wt(8, 4) + 0.6, 0.3);
  hide($("#p3"), wt(9, 0) - 0.15, 0.2);
  show($("#merge"), wt(9, 0), 0.2); pop($("#merge"), wt(9, 7), 1.8);
  up($("#p4"), wt(9, 4));

  // conclusão
  const s10 = wt(10, 0);
  hide([$("#h2"), $("#nl"), $("#p4")], s10 - 0.2, 0.3);
  show($("#h3"), s10, 0.3);
  up($("#c1"), s10); pop($("#c1 .y"), wt(10, 14), 1.6);
  up($("#c2"), wt(10, 8));
  up($("#c3"), wt(11, 6));

  // marca
  hide([$("#h3"), $("#c1"), $("#c2"), $("#c3")], ${END_CARD} - 0.3, 0.3);
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
