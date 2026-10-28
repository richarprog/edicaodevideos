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
// tabela: 7 colunas km..mm; casa i vai de TX + i*CW até TX + (i+1)*CW; fronteira k fica em TX + k*CW
const UN = ["km", "hm", "dam", "m", "dm", "cm", "mm"];
const TX = 60, CW = 137, TY = 480, HH = 90, CH = 170;
const bx = (k) => TX + k * CW;
const cell = (id, col, ch, cls = "") => `<div class="dg ${cls}" id="${id}" style="left:${bx(col)}px">${ch}</div>`;
const comma = (id, k) => `<div class="cm" id="${id}" style="left:${bx(k) - 20}px">,</div>`;
const hop = (id, k, n) => `<div class="hop" id="${id}" style="left:${bx(k) - 40}px">${n}</div>`;
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
#root .w{display:inline-block}
#root .hd{top:250px;font:400 66px "Patrick Hand";color:${C.soft};opacity:0}
#root .ttl{top:250px;font:400 66px "Patrick Hand";color:${C.soft}}
#root .q{top:600px;font:700 140px "Kalam"}
#root .q2{top:318px;font:700 112px "Kalam";opacity:0}
#root .col{position:absolute;top:${TY}px;width:${CW}px;height:${HH + CH}px;border:4px solid rgba(242,239,228,.6);border-left-width:0;opacity:0}
#root .col.first{border-left-width:4px}
#root .col b{display:block;height:${HH}px;line-height:${HH}px;text-align:center;font:700 54px "Kalam";border-bottom:4px solid rgba(242,239,228,.6)}
#root .hl{position:absolute;top:${TY}px;width:${CW}px;height:${HH + CH}px;background:rgba(242,239,228,.13);opacity:0}
#root .dg{position:absolute;top:${TY + HH}px;width:${CW}px;height:${CH}px;line-height:${CH}px;text-align:center;font:700 120px "Kalam";opacity:0}
#root .dg.z{color:${C.yellow}}
#root .cm{position:absolute;top:${TY + HH + 18}px;width:40px;text-align:center;font:700 130px/1 "Kalam";color:${C.yellow};opacity:0}
#root .hop{position:absolute;top:${TY + HH + CH + 18}px;width:80px;text-align:center;font:700 60px "Kalam";color:${C.soft};opacity:0}
#root .rl{font:400 64px "Patrick Hand";opacity:0}
#root .res{top:900px;font:700 96px "Kalam";opacity:0}
#root .ch2{font:400 66px "Patrick Hand";color:${C.soft};opacity:0}
#root .end{top:600px;font:700 120px/1.15 "Kalam";opacity:0;white-space:normal}
#root .endsub{top:930px;font:700 70px "Kalam";color:${C.yellow};opacity:0}
</style>
<div id="root" data-composition-id="lousa" data-width="${W}" data-height="${H}" data-duration="${DUR}">
  <svg class="dust" viewBox="0 0 ${W} ${H}"><filter id="nz"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0"/></filter><rect width="${W}" height="${H}" filter="url(#nz)"/></svg>

  <!-- gancho (miniatura) -->
  <div class="t ttl" id="ttl">medidas de comprimento</div>
  <div class="t q" id="q">2,5 m = <span class="w y" id="qq">?</span> cm</div>
  <div class="t q2" id="q2">75 mm = <span class="w y" id="q2q">?</span> m</div>
  <div class="t q2" id="q3">1,2 km = <span class="w y" id="q3q">?</span> m</div>

  <!-- a tabela -->
${UN.map((u, i) => `  <div class="hl" id="hl${i}" style="left:${bx(i)}px"></div>`).join("\n")}
${UN.map((u, i) => `  <div class="col${i === 0 ? " first" : ""}" id="col${i}" style="left:${bx(i)}px"><b>${u}</b></div>`).join("\n")}

  <!-- regra -->
  <div class="t rl" id="r1" style="top:840px">direita → <span class="y">×10</span> a cada casa</div>
  <div class="t rl" id="r2" style="top:940px">esquerda ← <span class="y">÷10</span> a cada casa</div>

  <!-- exemplo 1: 2,5 m → cm -->
  ${cell("a2", 3, "2")}${cell("a5", 4, "5")}${cell("a0", 5, "0", "z")}
  ${comma("ac", 4)}
  ${hop("ah1", 5, "1")}${hop("ah2", 6, "2")}
  <div class="t res" id="ar">2,5 m = <span class="w y" id="ary">250 cm</span></div>

  <!-- exemplo 2: 75 mm → m -->
  ${cell("b7", 5, "7")}${cell("b5", 6, "5")}${cell("b0a", 4, "0", "z")}${cell("b0b", 3, "0", "z")}
  ${comma("bc", 7)}
  ${hop("bh1", 6, "1")}${hop("bh2", 5, "2")}${hop("bh3", 4, "3")}
  <div class="t res" id="br">75 mm = <span class="w y" id="bry">0,075 m</span></div>

  <!-- desafio -->
  <div class="t ch2" id="e2" style="top:860px">responde nos comentários</div>
  <div class="t ch2" id="e3" style="top:960px;font-size:58px">salva para não esquecer a tabela</div>

  <div class="t end" id="end">A Voz da<br/>Matemática</div>
  <div class="t endsub" id="endsub">cada casa = ×10 ou ÷10</div>
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
  const drop = (el, t) => tl.fromTo(el, { opacity: 0, y: -60, scale: 1.4 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2)", ...IR }, t);
  // a vírgula pula uma casa (dx = ±1) com um arco
  const CW = ${CW};
  const jump = (el, t, n, dir, hopEl) => {
    tl.to(el, { x: dir * n * CW, duration: 0.42, ease: "power2.inOut" }, t);
    tl.to(el, { y: -70, duration: 0.21, ease: "power1.out", yoyo: true, repeat: 1 }, t);
    if (hopEl) { show(hopEl, t + 0.25, 0.2); pop(hopEl, t + 0.25, 1.6); }
  };
  const W_ = ${JSON.stringify(T)};
  const wt = (s, i) => W_[s][i][0];
  const col = (i) => $("#col" + i), hl = (i) => $("#hl" + i);

  // gancho: "2,5 m = ? cm" já na miniatura
  pop($("#qq"), wt(0, 7), 1.6);

  // a tabela e a regra
  const s1 = wt(1, 0);
  hide($("#ttl"), s1 - 0.2, 0.3);
  tl.to($("#q"), { y: -282, scale: 0.8, duration: 0.6, ease: "power2.inOut" }, s1);
  [0, 1, 2, 3, 4, 5, 7].forEach((w, i) => up(col(i), wt(2, w) - 0.05));
  up($("#r1"), wt(3, 4)); up($("#r2"), wt(3, 10));

  // exemplo 1: 2,5 m → cm
  const s4 = wt(4, 0);
  hide([$("#r1"), $("#r2")], s4 - 0.2, 0.3);
  drop($("#a2"), wt(4, 2)); drop($("#ac"), wt(4, 3)); drop($("#a5"), wt(4, 4));
  show(hl(3), wt(4, 11), 0.3); pop($("#a2"), wt(4, 8), 1.3);
  show(hl(5), wt(5, 1), 0.3);
  jump($("#ac"), wt(6, 6) - 0.1, 1, 1, $("#ah1"));
  jump($("#ac"), wt(6, 7) - 0.1, 2, 1, $("#ah2"));
  drop($("#a0"), wt(7, 6));
  up($("#ar"), wt(8, 0)); pop($("#ary"), wt(8, 5), 1.5);

  // exemplo 2: 75 mm → m
  const s9 = wt(9, 0);
  hide([$("#q"), hl(3), hl(5), $("#a2"), $("#a5"), $("#a0"), $("#ac"), $("#ah1"), $("#ah2"), $("#ar")], s9 - 0.2, 0.3);
  up($("#q2"), s9 + 0.1);
  drop($("#b7"), wt(9, 1)); drop($("#b5"), wt(9, 3));
  drop($("#bc"), wt(9, 8)); pop($("#bc"), wt(9, 10), 1.6);
  show(hl(6), wt(10, 1), 0.3); show(hl(3), wt(10, 3), 0.3);
  jump($("#bc"), wt(11, 3) - 0.1, 1, -1, $("#bh1"));
  jump($("#bc"), wt(11, 4) - 0.1, 2, -1, $("#bh2"));
  jump($("#bc"), wt(11, 5) - 0.1, 3, -1, $("#bh3"));
  drop($("#b0a"), wt(11, 9)); drop($("#b0b"), wt(11, 10));
  up($("#br"), wt(12, 0)); pop($("#bry"), wt(12, 5), 1.5);
  pop($("#q2q"), wt(12, 5), 1.5);
  tl.set($("#q2q"), { textContent: "0,075" }, wt(12, 5));

  // desafio
  const s13 = wt(13, 0);
  hide([$("#q2"), hl(3), hl(6), $("#b7"), $("#b5"), $("#b0a"), $("#b0b"), $("#bc"), $("#bh1"), $("#bh2"), $("#bh3"), $("#br")], s13 - 0.2, 0.3);
  up($("#q3"), wt(13, 2) - 0.1); pop($("#q3q"), wt(13, 7), 1.6);
  show(hl(0), wt(13, 5), 0.3); show(hl(3), wt(13, 8), 0.3);
  show($("#e2"), wt(13, 9), 0.3);
  show($("#e3"), wt(14, 0), 0.3);

  // marca
  hide([$("#q3"), hl(0), hl(3), $("#e2"), $("#e3"), ${UN.map((_, i) => `col(${i})`).join(", ")}], ${END_CARD} - 0.3, 0.3);
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
