// Gera index.html, compositions/barra.html e compositions/legendas.html.
// Os tempos vêm de build/timing.json (gerado a partir da narração) ou, se ele
// não existir, de uma estimativa a 2,4 palavras/s. Uso: node build/build.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const W = 1080, H = 1920;
const C = { board: "#1F3A2D", board2: "#183024", chalk: "#F2EFE4", soft: "rgba(242,239,228,.55)", yellow: "#F5D547" };

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
const END_CARD = +(send(10) + 1.4).toFixed(2);
const DUR = +(END_CARD + 3.0).toFixed(2);
const AUDIO_DUR = AUDIO ? +parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", AUDIO]).toString()).toFixed(3) : 0;

const FONTS = `
@font-face{font-family:"Kalam";src:url("assets/fonts/kalam-latin-700-normal.woff2") format("woff2");font-weight:700}
@font-face{font-family:"Kalam";src:url("assets/fonts/kalam-latin-400-normal.woff2") format("woff2");font-weight:400}
@font-face{font-family:"Patrick Hand";src:url("assets/fonts/patrick-hand-latin-400-normal.woff2") format("woff2");font-weight:400}`;

// ---------------- cena: a barra ----------------
const BX = 90, BW = 900, BY = 680, BH = 170, SEG = BW / 10;
let dividers = "", segFill = "", segLbl = "";
for (let i = 1; i < 10; i++) dividers += `<line class="dv d" pathLength="1" x1="${BX + i * SEG}" y1="${BY}" x2="${BX + i * SEG}" y2="${BY + BH}"/>`;
for (let i = 0; i < 10; i++) {
  segFill += `<rect id="f${i}" class="sf" x="${BX + i * SEG + 4}" y="${BY + 4}" width="${SEG - 8}" height="${BH - 8}"/>`;
  segLbl += `<text id="l${i}" class="sl" x="${BX + i * SEG + SEG / 2}" y="${BY + BH / 2 + 15}" text-anchor="middle">140</text>`;
}
const braceUp = (x1, x2, y, id, label, cls = "") =>
  `<g id="${id}" class="br ${cls}"><path class="d" pathLength="1" d="M${x1} ${y} q0 -26 26 -26 L${(x1 + x2) / 2 - 16} ${y - 26} q16 0 16 -22 q0 22 16 22 L${x2 - 26} ${y - 26} q26 0 26 26"/>
   <text x="${(x1 + x2) / 2}" y="${y - 70}" text-anchor="middle">${label}</text></g>`;
const brace = (x1, x2, y, id, label, cls = "") =>
  `<g id="${id}" class="br ${cls}"><path class="d" pathLength="1" d="M${x1} ${y} q0 26 26 26 L${(x1 + x2) / 2 - 16} ${y + 26} q16 0 16 22 q0 -22 16 -22 L${x2 - 26} ${y + 26} q26 0 26 -26"/>
   <text x="${(x1 + x2) / 2}" y="${y + 100}" text-anchor="middle">${label}</text></g>`;

const barra = `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8" /></head><body>
<template>
<style>
${FONTS}
#root{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:hidden;color:${C.chalk};font-family:"Kalam",cursive;
  background:radial-gradient(ellipse 60% 40% at 30% 25%,rgba(255,255,255,.06),transparent 70%),radial-gradient(ellipse 50% 35% at 75% 70%,rgba(255,255,255,.05),transparent 70%),${C.board}}
#root .dust{position:absolute;inset:0;opacity:.22}
#root svg.g{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:visible}
#root svg.g path,#root svg.g line,#root svg.g rect.o{fill:none;stroke:${C.chalk};stroke-width:6;stroke-linecap:round;stroke-linejoin:round;filter:url(#chalk)}
#root svg.g .d{stroke-dasharray:1;stroke-dashoffset:1}
#root svg.g .dv{stroke-width:5}
#root svg.g .sf{fill:${C.yellow};opacity:0}
#root svg.g .sl{font:700 44px "Kalam";fill:${C.chalk};opacity:0}
#root svg.g .br path{stroke:${C.yellow};stroke-width:5}
#root svg.g .br text{font:700 56px "Kalam";fill:${C.yellow};opacity:0}
#root svg.g .br.w path{stroke:${C.chalk}} #root svg.g .br.w text{fill:${C.chalk}}
#root .t{position:absolute;left:60px;right:60px;text-align:center;line-height:1;white-space:nowrap}
#root .hd{top:230px;font:400 76px "Patrick Hand";color:${C.soft}}
#root .hd .y{display:inline-block}
#root .y{color:${C.yellow}}
#root .w{display:inline-block}
#root .tag{position:absolute;left:560px;top:800px;width:360px;height:130px;border:6px solid ${C.chalk};border-radius:18px;
  display:flex;align-items:center;justify-content:center;font:700 74px "Kalam";transform-origin:0 0;filter:url(#chalk)}
#root .badge{position:absolute;left:700px;top:330px;width:220px;height:220px;border-radius:50%;background:${C.yellow};color:${C.board};
  display:flex;align-items:center;justify-content:center;font:700 78px "Kalam";transform:rotate(-10deg)}
#root .eq{top:880px;font:700 110px "Kalam";opacity:0}
#root .eq2{top:1010px;font:700 140px "Kalam";opacity:0;color:${C.yellow}}
#root .res{font:700 84px "Kalam";opacity:0}
#root #phone{transform-origin:345px 640px}
#root .big{top:740px;font:700 190px "Kalam";opacity:0}
#root .big .z{display:inline-block;position:relative}
#root .cut{position:absolute;left:-6px;right:-6px;top:52%;height:12px;background:${C.yellow};transform:rotate(-20deg) scaleX(0);transform-origin:0 50%;border-radius:6px}
#root .end{top:600px;font:700 120px/1.15 "Kalam";opacity:0;white-space:normal}
#root .endsub{top:960px;font:400 64px "Patrick Hand";color:${C.soft};opacity:0}
</style>
<div id="root" data-composition-id="barra" data-width="${W}" data-height="${H}" data-duration="${DUR}">
  <svg class="dust" viewBox="0 0 ${W} ${H}"><filter id="nz"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0"/></filter><rect width="${W}" height="${H}" filter="url(#nz)"/></svg>
  <svg class="g" viewBox="0 0 ${W} ${H}">
    <defs><filter id="chalk" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs>
    <g id="phone"><rect class="o" x="180" y="330" width="330" height="620" rx="46"/><line x1="300" y1="370" x2="390" y2="370"/><path d="M215 410 h260 v460 h-260 z" style="stroke-width:3;opacity:.6"/><path d="M300 905 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0" style="stroke-width:4"/><path d="M510 640 C540 700 560 760 600 800" style="stroke-width:4"/></g>
    <g id="bar"><rect id="barbox" class="o d" pathLength="1" x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="8"/>${segFill}${dividers}${segLbl}</g>
    ${braceUp(BX, BX + BW, BY - 20, "b100", "R$ 1.400 = 100%", "w")}
    ${brace(BX + 4, BX + SEG - 4, BY + BH + 20, "b10", "10%")}
    ${brace(BX + 4, BX + 2 * SEG - 4, BY + BH + 20, "b20", "R$ 280")}
    ${brace(BX + 2 * SEG + 4, BX + BW - 4, BY + BH + 20, "b80", "R$ 1.120", "w")}
  </svg>
  <div class="t hd" id="h1">desconto = <span class="y">?</span></div>
  <div class="tag" id="tag">R$ 1.400</div>
  <div class="badge" id="badge">-20%</div>
  <div class="t eq" id="eq"><span class="w" id="e1">140</span> <span class="w" id="e2">+ 140</span></div>
  <div class="t eq2" id="eq2">= 280</div>
  <div class="t res" id="r1" style="top:1030px">você economiza <span class="y">R$ 280</span></div>
  <div class="t res" id="r2" style="top:1030px">você paga <span class="y">R$ 1.120</span></div>
  <div class="t big" id="k1"><span>140</span><span class="z">0<span class="cut" id="cut"></span></span></div>
  <div class="t res" id="k2" style="top:970px">10% = 140</div>
  <div class="t res" id="k3" style="top:1075px">× 2 &nbsp;→&nbsp; <span class="y">20% = 280</span></div>
  <div class="t end" id="end">A Voz da<br/>Matemática</div>
  <div class="t endsub" id="endsub">20% = 10% × 2</div>
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
  const pop = (el, t, s) => tl.fromTo(el, { scale: s || 1.25 }, { scale: 1, duration: 0.45, ease: "back.out(2.5)", ...IR }, t);
  const W_ = ${JSON.stringify(T)};
  const wt = (s, i) => W_[s][i][0];

  // 1 — gancho: celular, etiqueta e selo já na tela (miniatura)
  pop($("#badge"), wt(0, 8), 1.18);
  pop($("#h1 .y"), wt(1, 0), 1.6);
  pop($("#badge"), wt(1, 2), 1.12);

  // 2 — a etiqueta vira a barra
  const s2 = wt(2, 0);
  hide($("#h1"), s2, 0.3);
  tl.to($("#phone"), { opacity: 0, y: -60, duration: 0.6, ease: "power2.in" }, s2 + 0.1);
  tl.to($("#badge"), { opacity: 0, scale: 0.6, duration: 0.5, ease: "power2.in" }, s2 + 0.1);
  tl.to($("#tag"), { x: ${BX} - 560, y: ${BY} - 800, duration: 0.9, ease: "power2.inOut" }, s2 + 0.3);
  tl.to($("#tag"), { width: ${BW}, height: ${BH}, duration: 0.9, ease: "power2.inOut" }, wt(2, 9) - 0.6);
  draw($("#barbox"), wt(2, 9) + 0.2, 0.5);
  tl.to($("#tag"), { opacity: 0, duration: 0.3 }, wt(2, 9) + 0.5);
  draw($$("#b100 path"), wt(2, 12) - 0.1, 0.5); show($$("#b100 text"), wt(2, 12), 0.35);

  // 3 — dez partes
  $$(".dv").forEach((el, i) => draw(el, wt(3, 2) + i * 0.17, 0.3, "power2.out"));
  $$(".sl").forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out", ...IR }, wt(4, 3) + i * 0.09));
  draw($$("#b10 path"), wt(5, 2) - 0.1, 0.4); show($$("#b10 text"), wt(5, 2), 0.3);
  tl.fromTo($("#f0"), { opacity: 0 }, { opacity: 0.35, duration: 0.3, ...IR }, wt(5, 2));

  // 4 — duas partes = 20%
  hide($$("#b10 path, #b10 text"), wt(6, 0), 0.25);
  tl.to($("#f0"), { opacity: 1, duration: 0.25 }, wt(6, 4) - 0.05);
  tl.fromTo($("#f1"), { opacity: 0 }, { opacity: 1, duration: 0.25, ...IR }, wt(6, 4) + 0.15);
  tl.to([$("#l0"), $("#l1")], { fill: "${C.board}", duration: 0.2 }, wt(6, 4));
  show($("#eq"), wt(7, 0) - 0.1, 0.01);
  tl.fromTo($("#e1"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ...IR }, wt(7, 0) - 0.1);
  tl.fromTo($("#e2"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ...IR }, wt(7, 3) - 0.1);
  tl.fromTo($("#eq2"), { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", ...IR }, wt(7, 6) - 0.1);

  // 5 — economia e preço final
  hide([$("#eq"), $("#eq2")], wt(8, 0) - 0.15, 0.25);
  show($("#r1"), wt(8, 1), 0.35);
  draw($$("#b20 path"), wt(8, 2), 0.4); show($$("#b20 text"), wt(8, 2) + 0.1, 0.3);
  hide($$("#b100 path, #b100 text"), wt(8, 2), 0.3);
  hide($("#r1"), wt(8, 8) - 0.2, 0.2); show($("#r2"), wt(8, 8), 0.3);
  draw($$("#b80 path"), wt(8, 8) - 0.1, 0.5); show($$("#b80 text"), wt(8, 8), 0.3);

  // 6 — o truque: tira um zero, depois dobra
  const s9 = wt(9, 0);
  hide([$("#r2")], s9 - 0.1, 0.25);
  hide($$("#b20, #b80"), s9 - 0.1, 0.25);
  tl.to($("#bar"), { opacity: 0.3, y: -300, duration: 0.6, ease: "power2.inOut" }, s9);
  show($("#k1"), wt(9, 1), 0.35);
  tl.to($("#cut"), { scaleX: 1, duration: 0.35, ease: "power2.out" }, wt(9, 8));
  tl.to($("#k1 .z"), { y: 260, rotation: 25, opacity: 0, duration: 0.7, ease: "power2.in" }, wt(9, 9) + 0.15);
  tl.fromTo($("#k2"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ...IR }, wt(9, 9) + 0.6);
  tl.fromTo($("#k3"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ...IR }, wt(10, 3));
  pop($("#k3 .y"), wt(10, 4), 1.3);

  // 7 — marca
  hide([$("#k1"), $("#k2"), $("#k3"), $("#bar")], ${END_CARD} - 0.3, 0.3);
  tl.fromTo($("#end"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", ...IR }, ${END_CARD});
  show($("#endsub"), ${END_CARD} + 0.6, 0.4);

  tl.seek(0);
  window.__timelines["barra"] = tl;
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
  <div id="barra" class="clip" data-composition-id="barra" data-composition-src="compositions/barra.html" data-start="0" data-duration="${DUR}" data-track-index="1" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>
  <div id="legendas" class="clip" data-composition-id="legendas" data-composition-src="compositions/legendas.html" data-start="0" data-duration="${DUR}" data-track-index="2" data-track-kind="captions" data-width="${W}" data-height="${H}" style="z-index:2"></div>
${AUDIO ? `  <audio id="narracao" src="${AUDIO}" data-start="0" data-duration="${AUDIO_DUR}" data-track-index="10" data-volume="1"></audio>\n` : ""}</div>
<script>window.__timelines["main"] = gsap.timeline({ paused: true });</script>
</body>
</html>
`;

writeFileSync("compositions/barra.html", barra);
writeFileSync("compositions/legendas.html", legendas);
writeFileSync("index.html", index);
console.log(`duração ${DUR}s · fim da narração ${send(10)}s · ${groups.length} grupos de legenda · áudio: ${AUDIO || "nenhum (tempos estimados)"}`);
