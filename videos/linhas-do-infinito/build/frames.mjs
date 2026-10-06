// Gera compositions/frames/NN-fN.html a partir do plano aprovado (STORYBOARD.md v1).
// Uso: node build/frames.mjs   (a partir da raiz do projeto)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const audiomap = JSON.parse(readFileSync("audiomap.json", "utf8"));
const BEATS = audiomap.grid.beats_sec;

const PAPER = "#F0EBDE", PAPER2 = "#E6E0CE", INK = "#1F2BE0", SOFT = "#5560E5";
const W = 1920, H = 1080;

const FONTS = `
@font-face{font-family:"Newsreader";src:url("assets/fonts/newsreader-latin-400-normal.woff2") format("woff2");font-weight:400;font-style:normal}
@font-face{font-family:"Newsreader";src:url("assets/fonts/newsreader-latin-400-italic.woff2") format("woff2");font-weight:400;font-style:italic}
@font-face{font-family:"Hanken Grotesk";src:url("assets/fonts/hanken-grotesk-latin-400-normal.woff2") format("woff2");font-weight:400}
@font-face{font-family:"Hanken Grotesk";src:url("assets/fonts/hanken-grotesk-latin-600-normal.woff2") format("woff2");font-weight:600}
@font-face{font-family:"DM Mono";src:url("assets/fonts/dm-mono-latin-400-normal.woff2") format("woff2");font-weight:400}`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const r3 = (n) => +n.toFixed(3);

// ---------- SVG building blocks (all coordinates in 1920x1080) ----------
const line = (x1, y1, x2, y2, cls = "", sw = 5) =>
  `<line class="${cls}" pathLength="1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${sw}"/>`;
const dot = (cx, cy, r, cls = "") => `<circle class="dot ${cls}" cx="${cx}" cy="${cy}" r="${r}"/>`;
const arrow = (x, y, dir, cls = "", s = 1) =>
  `<path class="arr ${cls}" d="M${x - 30 * dir * s} ${y - 18 * s} L${x} ${y} L${x - 30 * dir * s} ${y + 18 * s}"/>`;
const label = (x, y, txt, cls = "", anchor = "start") =>
  `<text class="lbl ${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${esc(txt)}</text>`;
const ital = (x, y, txt, cls = "", size = 52) =>
  `<text class="it ${cls}" x="${x}" y="${y}" font-size="${size}" text-anchor="middle">${esc(txt)}</text>`;

// Three-lane chorus system (reta / semirreta / segmento).
const LANE_Y = [250, 430, 610];
function lanesSVG() {
  const [yr, ys, yg] = LANE_Y;
  let ticks = "";
  for (let x = 460, i = 0; x <= 1500; x += 80, i++)
    ticks += line(x, yg + 30, x, yg + (i % 2 ? 44 : 58), "tk", 3);
  return `
  <g class="lanes">
    <g class="Lr">${label(110, yr + 9, "RETA", "lane")}${line(330, yr, 1790, yr, "d ln")}${arrow(330, yr, -1, "pa aL")}${arrow(1790, yr, 1, "pa aR")}</g>
    <g class="Ls">${label(110, ys + 9, "SEMIRRETA", "lane")}${line(360, ys, 1790, ys, "d ln")}${dot(360, ys, 13, "pd")}${arrow(1790, ys, 1, "pa")}${dot(360, ys, 9, "tr")}</g>
    <g class="Lg">${label(110, yg + 9, "SEGMENTO", "lane")}${line(460, yg, 1500, yg, "d ln")}${dot(460, yg, 13, "pd")}${dot(1500, yg, 13, "pd")}
      ${ital(460, yg - 26, "A", "pd", 44)}${ital(1500, yg - 26, "B", "pd", 44)}<g class="ticks">${ticks}</g>
      <text class="mono cnt" x="1560" y="${yg + 10}">AB = <tspan class="v">0</tspan> u</text></g>
  </g>`;
}

// ---------- lyric markup ----------
function lyricsHTML(lines, big = false) {
  return lines
    .map(
      (l, i) =>
        `<div class="ly${big ? " big" : ""}" data-i="${i}">${l
          .split(" ")
          .map((w) => `<span>${esc(w)}</span>`)
          .join(" ")}</div>`
    )
    .join("\n");
}

// ---------- frame wrapper ----------
function frameFile({ id, n, start, end, inv = false, chip, svg, extraHTML = "", lyrics = [], anchors = [], bigLyrics = false, script, css = "" }) {
  const R = `r${String(n).padStart(2, "0")}`;
  const bg = inv ? INK : PAPER, ink = inv ? PAPER : INK;
  const grid = inv ? "rgba(240,235,222,0.12)" : "rgba(31,43,224,0.10)";
  const dur = r3(end - start);
  return `<!doctype html>
<html lang="pt-BR">
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
${FONTS}
#${R}{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:hidden;background-color:${bg};
  background-image:linear-gradient(${grid} 1px,transparent 1px),linear-gradient(90deg,${grid} 1px,transparent 1px);
  background-size:38.4px 38.4px;color:${ink};font-family:"Hanken Grotesk",sans-serif}
#${R} .hl{position:absolute;left:77px;right:77px;height:2px;background:${ink}}
#${R} .hl.t{top:58px} #${R} .hl.b{bottom:58px}
#${R} .chip{position:absolute;top:74px;left:77px;font:400 16px "DM Mono",monospace;letter-spacing:.08em;text-transform:uppercase}
#${R} .pg{position:absolute;top:74px;right:77px;font:400 16px "DM Mono",monospace;letter-spacing:.08em}
#${R} .cam{position:absolute;inset:0;transform-origin:50% 50%}
#${R} svg.geo{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:visible}
#${R} svg.geo line,#${R} svg.geo path,#${R} svg.geo polyline,#${R} svg.geo polygon{stroke:${ink};fill:none;stroke-linecap:round;stroke-linejoin:round}
#${R} svg.geo .arr{stroke-width:5}
#${R} svg.geo .dot{fill:${ink};stroke:none}
#${R} svg.geo .ring{fill:none;stroke:${ink};stroke-width:3}
#${R} svg.geo .d{stroke-dasharray:1;stroke-dashoffset:1}
#${R} svg.geo .lbl{font:400 24px "DM Mono",monospace;letter-spacing:.08em;fill:${ink}}
#${R} svg.geo .mono{font:400 30px "DM Mono",monospace;fill:${ink}}
#${R} svg.geo .it{font-family:Newsreader,serif;font-style:italic;fill:${ink}}
#${R} .pa,#${R} .pd,#${R} .tr,#${R} .cnt,#${R} .lane,#${R} .ticks{opacity:0}
#${R} .ly{position:absolute;left:160px;right:160px;bottom:142px;text-align:center;font:400 66px/1.12 Newsreader,serif;letter-spacing:-.005em}
#${R} .ly.big{bottom:auto;top:170px;font-size:104px;line-height:1.02}
#${R} .ly span{display:inline-block;opacity:0}
#${R} .flash{position:absolute;inset:0;background:${inv ? PAPER : INK};opacity:0;pointer-events:none}
${css.replaceAll("#R", "#" + R)}
      </style>
      <div id="${R}" data-composition-id="${id}" data-width="${W}" data-height="${H}" data-duration="${dur}">
        <div class="hl t"></div><div class="hl b"></div>
        <div class="chip">${esc(chip)}</div><div class="pg">${String(n).padStart(2, "0")} / 10</div>
        <div class="cam"><svg class="geo" viewBox="0 0 ${W} ${H}">${svg}</svg>${extraHTML}</div>
        ${lyricsHTML(lyrics, bigLyrics)}
        <div class="flash"></div>
      </div>
      <script>
        (function () {
          const R = document.getElementById("${R}");
          const E = (s) => (typeof s === "string" ? R.querySelectorAll(s) : s);
          const $ = (s) => R.querySelector(s);
          const S = ${start}, END = ${end};
          const at = (t) => Math.max(0, +(t - S).toFixed(3));
          const tl = gsap.timeline({ paused: true });
          const IR = { immediateRender: false };
          function draw(s, t, d, ease) { tl.fromTo(E(s), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: ease || "power2.inOut", ...IR }, at(t)); }
          function show(s, t, d) { tl.fromTo(E(s), { opacity: 0 }, { opacity: 1, duration: d == null ? 0.3 : d, ease: "power1.out", ...IR }, at(t)); }
          function hide(s, t, d) { tl.to(E(s), { opacity: 0, duration: d == null ? 0.25 : d, ease: "power1.in" }, at(t)); }
          function pop(s, t) { tl.fromTo(E(s), { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)", ...IR }, at(t)); }
          function punch(s, t, k) { tl.fromTo(E(s), { scale: k || 1.07, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, ease: "power3.out", ...IR }, at(t)); }
          function flash(t, o) { tl.fromTo($(".flash"), { opacity: o || 0.35 }, { opacity: 0, duration: 0.4, ease: "power2.out", ...IR }, at(t)); }
          function count(el, t, to, d) { const p = { v: 0 }; tl.fromTo(p, { v: 0 }, { v: to, duration: d || 1.2, ease: "power2.out", ...IR, onUpdate: () => { el.textContent = Math.round(p.v); } }, at(t)); }
          // letra: palavras entram 0.15s antes do tempo forte, saem antes da próxima linha
          const LY = ${JSON.stringify(anchors)};
          R.querySelectorAll(".ly").forEach((el, i) => {
            const a = LY[i]; if (a == null) return;
            tl.fromTo(el.querySelectorAll("span"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.34, stagger: 0.045, ease: "power3.out", ...IR }, at(a - 0.15));
            const nx = LY[i + 1];
            if (nx != null) tl.to(el, { opacity: 0, duration: 0.16, ease: "power1.in" }, at(nx - 0.2));
          });
${script}
          tl.seek(0);
          window.__timelines["${id}"] = tl;
        })();
      </script>
    </template>
  </body>
</html>
`;
}

// beats inside [a,b)
const beatsIn = (a, b) => BEATS.filter((t) => t >= a - 0.05 && t < b - 0.1).map(r3);

// ---------- shared chorus-lane script ----------
function lanesScript(anchors, mention, end, surges) {
  const plan = anchors.map((a, i) => ({ a, m: mention[i], beats: beatsIn(a, anchors[i + 1] ?? end) }));
  return `
          const LANES = { r: $(".Lr"), s: $(".Ls"), g: $(".Lg") };
          const ALL = [LANES.r, LANES.s, LANES.g];
          // entrada: as três formas se desenham em sequência
          [".Lr", ".Ls", ".Lg"].forEach((k, i) => {
            const t0 = S + 0.05 + i * 0.18;
            draw(k + " .ln", t0, 0.7, "power3.out");
            show(k + " .lane", t0, 0.3);
            pop(k + " .pd", t0 + 0.35);
            pop(k + " .pa", t0 + 0.55);
          });
          show(".Lg .ticks", S + 0.9, 0.4); show(".Lg .cnt", S + 0.9, 0.4);
          flash(S + 0.02, 0.3);
          const PLAN = ${JSON.stringify(plan)};
          const cnt = $(".Lg .v");
          PLAN.forEach((p) => {
            if (p.m === "all") {
              tl.to(ALL, { opacity: 1, duration: 0.2 }, at(p.a - 0.12));
              p.beats.forEach((b) => punch(ALL, b, 1.025));
            } else {
              const on = LANES[p.m];
              tl.to(ALL.filter((x) => x !== on), { opacity: 0.2, duration: 0.25 }, at(p.a - 0.12));
              tl.to(on, { opacity: 1, duration: 0.2 }, at(p.a - 0.12));
              punch(on, p.a, 1.045);
              if (p.m === "r") {
                tl.fromTo(E(".Lr .aL"), { x: 0 }, { x: -28, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut", ...IR }, at(p.a + 0.1));
                tl.fromTo(E(".Lr .aR"), { x: 0 }, { x: 28, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut", ...IR }, at(p.a + 0.1));
              } else if (p.m === "s") {
                tl.fromTo(E(".Ls .tr"), { attr: { cx: 360 }, opacity: 1 }, { attr: { cx: 1790 }, opacity: 0.15, duration: 2.1, ease: "power1.inOut", ...IR }, at(p.a));
              } else if (p.m === "g") {
                count(cnt, p.a + 0.1, 13, 1.3);
                punch(".Lg .ticks", p.a + 1.4, 1.06);
              }
            }
          });
          ${JSON.stringify(surges)}.forEach((t) => { punch(".lanes", t, 1.06); flash(t, 0.25); });
          tl.to(ALL, { opacity: 1, duration: 0.25 }, at(END - 0.5));`;
}

const MENTION = ["r", "s", "g", "all", "r", "s", "g", "all"];
const frames = [];

// ---------- F1 intro ----------
{
  const title = "Linhas do Infinito".split("").map((c) => (c === " " ? " " : `<i>${esc(c)}</i>`)).join("");
  frames.push(frameFile({
    id: "01-f1", n: 1, start: 0, end: 12.1, chip: "intro",
    svg: `${dot(960, 600, 11, "p0")}<circle class="ring rg" cx="960" cy="600" r="11"/>
      ${line(960, 600, -40, 600, "d L1")}${line(960, 600, 1960, 600, "d L2")}${ital(960, 570, "r", "rl", 48)}`,
    extraHTML: `<div class="ttl">${title}</div><div class="sub">RETA · SEMIRRETA · SEGMENTO</div>`,
    css: `#R .ttl{position:absolute;left:0;right:0;top:330px;text-align:center;font:400 150px/1 Newsreader,serif;letter-spacing:-.01em}
#R .ttl i{font-style:normal;display:inline-block;opacity:0}
#R .sub{position:absolute;left:0;right:0;top:700px;text-align:center;font:400 26px "DM Mono",monospace;letter-spacing:.32em;opacity:0}
#R .p0,#R .rg,#R .rl{opacity:0}`,
    script: `
          pop(".p0", 1.0);
          tl.fromTo(E(".rg"), { attr: { r: 11 }, opacity: 0.9 }, { attr: { r: 90 }, opacity: 0, duration: 1.2, ease: "power2.out", ...IR }, at(1.05));
          draw(".L1", 2.46, 2.3, "power2.in"); draw(".L2", 2.46, 2.3, "power2.in");
          tl.fromTo(E(".ttl i"), { opacity: 0, y: 60, rotate: -6 }, { opacity: 1, y: 0, rotate: 0, duration: 0.6, stagger: 0.05, ease: "back.out(1.6)", ...IR }, at(4.75));
          show(".sub", 7.2, 0.8);
          tl.fromTo(E(".rg"), { attr: { r: 11 }, opacity: 0.9 }, { attr: { r: 70 }, opacity: 0, duration: 1.0, ease: "power2.out", ...IR }, at(8.0));
          show(".rl", 9.71, 0.6);
          tl.fromTo($(".cam"), { scale: 1 }, { scale: 1.05, duration: 12.1, ease: "none", ...IR }, 0);`,
  }));
}

// ---------- F2 verso 1 ----------
{
  const A = [12.1, 14.51, 16.9, 19.3, 21.71, 24.1, 26.52, 28.91];
  let ticks = "";
  for (let x = -6000; x <= 7920; x += 240) if (x !== 960) ticks += line(x, 470, x, 490, "tk", 4);
  frames.push(frameFile({
    id: "02-f2", n: 2, start: 12.1, end: 31.3, chip: "verso 1",
    svg: `<g class="world">${line(960, 480, 960, 480, "L1 big")}${line(960, 480, 960, 480, "L2 big")}<g class="ticks">${ticks}</g>${dot(960, 480, 10, "p0")}</g>`,
    extraHTML: `<svg class="geo fixed" viewBox="0 0 ${W} ${H}">${arrow(110, 480, -1, "edge eL", 1.3)}${arrow(1810, 480, 1, "edge eR", 1.3)}${ital(960, 430, "r", "rl", 64)}
        <text class="lbl df" x="140" y="200">DEFINIÇÃO:</text>${line(330, 192, 700, 192, "d dfl", 3)}${line(130, 192, 720, 192, "d strike", 5)}
        <g class="stamp"><rect x="1300" y="150" width="480" height="84" fill="none" stroke-width="4"/><text class="lbl" x="1540" y="203" text-anchor="middle" style="font-size:30px">CONCEITO PRIMITIVO</text></g></svg>`,
    lyrics: ["No papel eu começo a imaginar", "Um traço que não para de andar", "Vai além do que posso enxergar", "Sem começo e sem fim pra marcar", "É a reta que segue sem direção final", "Cresce infinita, conceito essencial", "Nem definição ela chega a ter", "É primitiva, só dá pra entender"],
    anchors: A,
    css: `#R .edge,#R .rl,#R .df,#R .stamp,#R .ticks{opacity:0}
#R .stamp rect{stroke:${INK}}`,
    script: `
          pop(".p0", 12.0);
          tl.fromTo(E(".L1"), { attr: { x2: 960 } }, { attr: { x2: -6000 }, duration: 16, ease: "none", ...IR }, at(12.1));
          tl.fromTo(E(".L2"), { attr: { x2: 960 } }, { attr: { x2: 7920 }, duration: 16, ease: "none", ...IR }, at(12.1));
          show(".ticks", 16.6, 0.8);
          // câmera recua: a reta continua além do que se enxerga
          tl.fromTo($(".world"), { scale: 1, svgOrigin: "960 480" }, { scale: 0.34, duration: 31.3 - 16.9, ease: "power1.inOut", ...IR }, at(16.9));
          tl.fromTo(E(".world .big"), { attr: { "stroke-width": 5 } }, { attr: { "stroke-width": 14 }, duration: 31.3 - 16.9, ease: "power1.inOut", ...IR }, at(16.9));
          tl.fromTo(E(".world .tk"), { attr: { "stroke-width": 4 } }, { attr: { "stroke-width": 10 }, duration: 31.3 - 16.9, ease: "power1.inOut", ...IR }, at(16.9));
          pop(".eL", 19.3); pop(".eR", 19.45);
          show(".rl", 21.71, 0.4);
          ${JSON.stringify(beatsIn(24.1, 26.52))}.forEach((b) => {
            tl.fromTo(E(".eL"), { x: -22 }, { x: 0, duration: 0.45, ease: "power2.out", ...IR }, at(b));
            tl.fromTo(E(".eR"), { x: 22 }, { x: 0, duration: 0.45, ease: "power2.out", ...IR }, at(b));
          });
          show(".df", 26.52, 0.3); draw(".dfl", 26.7, 0.5, "power1.out"); draw(".strike", 27.7, 0.35, "power3.out");
          pop(".stamp", 28.91);
          tl.fromTo(E(".stamp"), { rotate: 0 }, { rotate: -4, duration: 0.3, ease: "power2.out", transformOrigin: "50% 50%", ...IR }, at(28.95));`,
  }));
}

// ---------- F3 / F6 pré-refrões ----------
function preChorus({ id, n, start, end, chip, lyrics, anchors, cols }) {
  return frameFile({
    id, n, start, end, chip, lyrics, anchors, bigLyrics: true,
    svg: cols.svg,
    css: `#R .pc,#R .pd{opacity:0}`,
    script: cols.script + `
          tl.fromTo($(".cam"), { scale: 1 }, { scale: 1.07, duration: ${r3(end - anchors[2])}, ease: "power2.in", ...IR }, at(${anchors[2]}));
          ${JSON.stringify(beatsIn(anchors[2] + 2.4, end))}.forEach((b, i) => punch(".geo", b, 1.012 + i * 0.004));`,
  });
}
{
  const A = [31.3, 33.72, 36.11];
  let chev = "";
  for (let i = 0; i < 6; i++) chev += arrow(960 - 120 - i * 130, 780, -1, `ch chL c${i}`) + arrow(960 + 120 + i * 130, 780, 1, `ch chR c${i}`);
  frames.push(preChorus({
    id: "03-f3", n: 3, start: 31.3, end: 40.91, chip: "pré-refrão",
    lyrics: ["Não tem ponto inicial", "Nem tem ponto terminal", "Vai nos dois sentidos sem parar"], anchors: A,
    cols: {
      svg: `${dot(520, 560, 16, "pd p1")}${line(492, 532, 548, 588, "d x1", 6)}${line(548, 532, 492, 588, "d x2", 6)}${label(520, 640, "INÍCIO?", "pc l1", "middle")}
        ${dot(1400, 560, 16, "pd p2")}${line(1372, 532, 1428, 588, "d x3", 6)}${line(1428, 532, 1372, 588, "d x4", 6)}${label(1400, 640, "FIM?", "pc l2", "middle")}
        ${line(960, 780, -60, 780, "d s1")}${line(960, 780, 1980, 780, "d s2")}<g class="pc chev">${chev}</g>`,
      script: `
          pop(".p1", 31.3); show(".l1", 31.4); draw(".x1", 32.2, 0.25, "power3.out"); draw(".x2", 32.4, 0.25, "power3.out");
          pop(".p2", 33.72); show(".l2", 33.82); draw(".x3", 34.6, 0.25, "power3.out"); draw(".x4", 34.8, 0.25, "power3.out");
          draw(".s1", 36.11, 0.7, "power3.in"); draw(".s2", 36.11, 0.7, "power3.in");
          show(".chev", 38.4, 0.1);
          ${JSON.stringify(beatsIn(38.52, 40.91))}.forEach((b) => {
            tl.fromTo(E(".chL"), { x: 0, opacity: 1 }, { x: -110, opacity: 0.2, duration: 0.5, stagger: 0.03, ease: "power2.out", ...IR }, at(b));
            tl.fromTo(E(".chR"), { x: 0, opacity: 1 }, { x: 110, opacity: 0.2, duration: 0.5, stagger: 0.03, ease: "power2.out", ...IR }, at(b));
          });`,
    },
  }));
}

// ---------- F4 refrão 1 ----------
const CHORUS = ["Reta vai pro infinito sem jamais parar", "Semirreta tem começo, mas não vai voltar", "Segmento é limitado, dá pra medir", "Cada um com sua forma de existir", "Reta é livre, não tem definição", "Semirreta nasce de um ponto, então", "Segmento tem começo e também tem fim", "Geometria vive dentro de mim"];
{
  const A = [40.91, 43.3, 45.72, 48.11, 50.5, 52.92, 55.31, 57.7];
  frames.push(frameFile({ id: "04-f4", n: 4, start: 40.91, end: 60.12, chip: "refrão", svg: lanesSVG(), lyrics: CHORUS, anchors: A, script: lanesScript(A, MENTION, 60.12, [52.0]) }));
}

// ---------- F5 verso 2 ----------
{
  const A = [60.12, 62.51, 64.92, 67.31, 69.71, 72.12, 74.51, 76.9];
  let rt = "";
  for (let x = 480, i = 0; x <= 1440; x += 60, i++) rt += line(x, 520, x, 520 + (i % 4 === 0 ? 40 : 22), "", 3);
  frames.push(frameFile({
    id: "05-f5", n: 5, start: 60.12, end: 79.32, chip: "verso 2",
    svg: `<g class="g1">${dot(420, 420, 15, "pd O")}<circle class="ring rg" cx="420" cy="420" r="15"/>${ital(420, 380, "O", "pd Ol", 54)}
        ${line(420, 420, 1760, 420, "d ray")}${arrow(1790, 420, 1, "pd tip", 1.2)}${dot(420, 420, 9, "tr")}
        <g class="ghost">${line(390, 420, 150, 420, "", 4)}${arrow(150, 420, -1, "", 1)}${line(230, 380, 310, 460, "", 5)}${line(310, 380, 230, 460, "", 5)}</g>
        ${label(1100, 520, "UM SENTIDO SÓ →", "pc one", "middle")}</g>
      <g class="g2">${dot(480, 460, 15, "pd A")}${dot(1440, 460, 15, "pd B")}${ital(480, 420, "A", "pd Al", 54)}${ital(1440, 420, "B", "pd Bl", 54)}
        ${line(480, 460, 1440, 460, "d seg", 6)}
        <g class="ruler"><rect x="460" y="505" width="1000" height="80" fill="none" stroke-width="3"/>${rt}</g>
        <text class="mono cnt2" x="960" y="660" text-anchor="middle" style="font-size:40px">AB = <tspan class="v">0</tspan> u</text>
        ${line(480, 430, 480, 490, "d brA", 8)}${line(1440, 430, 1440, 490, "d brB", 8)}</g>`,
    lyrics: ["Se eu marco um ponto pra iniciar", "E só pra um lado ela caminhar", "Surge a semirreta a crescer", "Com um sentido só pra percorrer", "Mas se dois pontos eu escolher", "E entre eles só me deter", "Tenho um segmento pra observar", "Com limites fáceis de encontrar"],
    anchors: A,
    css: `#R .pc,#R .ghost,#R .ruler,#R .cnt2,#R .g2{opacity:0} #R .ruler rect{stroke:${INK}}`,
    script: `
          pop(".O", 60.12); show(".Ol", 60.3);
          tl.fromTo(E(".g1 .rg"), { attr: { r: 15 }, opacity: 0.9 }, { attr: { r: 120 }, opacity: 0, duration: 1.1, ease: "power2.out", ...IR }, at(60.15));
          draw(".ray", 62.51, 1.5, "power2.inOut"); pop(".tip", 63.95);
          show(".ghost", 63.2, 0.3); tl.to(E(".ghost"), { opacity: 0.25, duration: 0.6 }, at(64.2));
          show(".one", 64.92, 0.4); punch(".ray", 64.92, 1.03);
          tl.fromTo(E(".tip"), { x: 0 }, { x: 40, duration: 1.4, ease: "power2.out", ...IR }, at(64.92));
          [67.31, 68.5].forEach((t) => tl.fromTo(E(".g1 .tr"), { attr: { cx: 420 }, opacity: 1 }, { attr: { cx: 1780 }, opacity: 0.1, duration: 1.15, ease: "power1.in", ...IR }, at(t)));
          tl.set(E(".g1"), { opacity: 0 }, at(69.71)); tl.set(E(".g2"), { opacity: 1 }, at(69.71));
          pop(".A", 69.71); show(".Al", 69.8); pop(".B", 70.9); show(".Bl", 71.0);
          draw(".seg", 72.12, 1.3, "power2.inOut");
          tl.fromTo(E(".ruler"), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", ...IR }, at(74.4));
          show(".cnt2", 74.9, 0.3); count($(".cnt2 .v"), 75.0, 16, 1.5);
          draw(".brA", 76.9, 0.3, "power3.out"); draw(".brB", 76.9, 0.3, "power3.out");
          ${JSON.stringify(beatsIn(76.9, 79.32))}.forEach((b) => punch(".g2", b, 1.02));`,
  }));
}

// ---------- F6 pré-refrão 2 ----------
{
  const A = [79.32, 81.71, 84.13];
  frames.push(preChorus({
    id: "06-f6", n: 6, start: 79.32, end: 88.91, chip: "pré-refrão",
    lyrics: ["Tem início pra mostrar", "E também pode acabar", "Ou seguir sem nunca terminar"], anchors: A,
    cols: {
      svg: `${dot(240, 640, 14, "pd q1")}${line(240, 640, 560, 640, "d k1")}${label(400, 720, "INÍCIO", "pc m1", "middle")}
        ${line(780, 640, 1110, 640, "d k2")}${dot(1110, 640, 14, "pd q2")}${label(945, 720, "FIM", "pc m2", "middle")}
        ${line(1300, 640, 1980, 640, "d k3")}${arrow(1680, 640, 1, "pd q3")}${label(1490, 720, "SEM FIM", "pc m3", "middle")}`,
      script: `
          pop(".q1", 79.32); draw(".k1", 79.5, 0.9, "power2.out"); show(".m1", 79.6);
          draw(".k2", 81.71, 0.8, "power2.in"); pop(".q2", 82.45); show(".m2", 82.0);
          draw(".k3", 84.13, 1.0, "power2.in"); show(".m3", 84.3);
          tl.fromTo(E(".q3"), { opacity: 1, x: 0 }, { x: 380, opacity: 0, duration: 1.2, ease: "power2.in", ...IR }, at(84.5));
          tl.fromTo(E(".q3"), { opacity: 1, x: 0 }, { x: 380, opacity: 0, duration: 1.2, ease: "power2.in", ...IR }, at(86.52));`,
    },
  }));
}

// ---------- F7 refrão 2 (invertido) ----------
{
  const A = [88.91, 91.32, 93.72, 96.11, 98.52, 100.91, 103.31, 105.72];
  frames.push(frameFile({ id: "07-f7", n: 7, start: 88.91, end: 108.11, inv: true, chip: "refrão", svg: lanesSVG(), lyrics: CHORUS, anchors: A, script: lanesScript(A, MENTION, 108.11, [100.0]) }));
}

// ---------- F8 ponte ----------
{
  const A = [108.11, 110.5, 112.92, 115.31, 117.7, 120.12, 122.51, 124.9];
  const card = (x, i, inner, name) => `<g class="cd cd${i}"><rect x="${x}" y="230" width="440" height="330" fill="none" stroke-width="3"/>${inner}${label(x + 220, 520, name, "", "middle")}</g>`;
  frames.push(frameFile({
    id: "08-f8", n: 8, start: 108.11, end: 127.31, chip: "ponte",
    svg: `<g class="b1">
        ${card(170, 0, `${line(220, 380, 560, 380, "", 5)}${arrow(220, 380, -1)}${arrow(560, 380, 1)}`, "RETA")}
        ${card(740, 1, `${dot(800, 380, 11)}${line(800, 380, 1130, 380, "", 5)}${arrow(1130, 380, 1)}`, "SEMIRRETA")}
        ${card(1310, 2, `${dot(1380, 380, 11)}${dot(1680, 380, 11)}${line(1380, 380, 1680, 380, "", 5)}`, "SEGMENTO")}
        ${line(560, 380, 1000, 380, "d ex1", 4)}${line(1130, 380, 1600, 380, "d ex2", 4)}${line(1380, 380, 400, 380, "d ex3", 4)}
        <polygon class="d tri" pathLength="1" points="960,240 1240,640 680,640" stroke-width="6"/></g>
      <g class="b2">${line(-40, 700, 1960, 700, "d base", 7)}${arrow(100, 700, -1, "pd")}${arrow(1820, 700, 1, "pd")}
        <polygon class="d s1" pathLength="1" points="300,700 520,340 740,700" stroke-width="6"/>
        <polygon class="d s2" pathLength="1" points="860,700 860,420 1140,420 1140,700" stroke-width="6"/>
        <path class="d s3" pathLength="1" d="M1260 700 L1260 450 L1510 450 L1510 700 Z M1260 450 L1360 370 L1610 370 L1510 450 M1610 370 L1610 620 L1510 700" stroke-width="6"/></g>`,
    lyrics: ["Três ideias pra entender", "Como as linhas vão viver", "No espaço a se formar", "É só observar", "Reta é base do pensar", "Nem precisa explicar", "É primitiva, está lá", "Pra tudo fundamentar"],
    anchors: A,
    css: `#R .cd,#R .b2 .pd{opacity:0} #R .cd rect{stroke:${INK}} #R .cd .dot{fill:${INK}} #R .cd .lbl{fill:${INK}}`,
    script: `
          [0, 1, 2].forEach((i) => tl.fromTo(E(".cd" + i), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)", ...IR }, at(108.11 + i * 0.6)));
          draw(".ex1", 110.5, 1.0); draw(".ex2", 110.9, 1.0); draw(".ex3", 111.3, 1.2);
          tl.to(E(".cd"), { opacity: 0, y: 80, duration: 0.5, stagger: 0.12, ease: "power2.in" }, at(112.8));
          tl.to(E(".ex1, .ex2, .ex3"), { opacity: 0, duration: 0.6 }, at(113.4));
          draw(".tri", 113.2, 1.6, "power2.inOut");
          tl.fromTo(E(".tri"), { rotate: 0 }, { rotate: 8, transformOrigin: "50% 60%", duration: 4.3, ease: "sine.inOut", ...IR }, at(115.31));
          tl.set(E(".b1"), { opacity: 0 }, at(117.7));
          draw(".base", 117.6, 1.0, "power3.out"); pop(".b2 .pd", 118.4);
          draw(".s1", 120.12, 1.2); draw(".s2", 122.51, 1.2); draw(".s3", 124.9 - 0.5, 1.3, "power2.out");
          flash(124.9, 0.3); punch(".b2", 124.9, 1.06);
          ${JSON.stringify(beatsIn(125.5, 127.31))}.forEach((b) => punch(".b2", b, 1.02));`,
  }));
}

// ---------- F9 instrumental: string art ----------
const N = 60, CX = 960, CY = 470, RAD = 330;
const P = (i, cx = CX, cy = CY, rad = RAD) => {
  const a = -Math.PI / 2 + (2 * Math.PI * i) / N;
  return [r3(cx + rad * Math.cos(a)), r3(cy + rad * Math.sin(a))];
};
function stringArt(cls, cx, cy, rad) {
  let s = "";
  for (let i = 0; i < N; i++) {
    const [x1, y1] = P(i, cx, cy, rad), [x2, y2] = P((2 * i) % N, cx, cy, rad);
    if (i === 0) continue;
    s += line(x1, y1, x2, y2, `d ${cls} c${i}`, 1.8);
  }
  for (let i = 0; i < N; i++) {
    const [x1, y1] = P(i, cx, cy, rad), [x2, y2] = P((3 * i) % N, cx, cy, rad);
    if ((3 * i) % N === i) continue;
    s += line(x1, y1, x2, y2, `d ${cls}b`, 1.2);
  }
  return s;
}
{
  let pts = "";
  for (let i = 0; i < N; i++) { const [x, y] = P(i); pts += dot(x, y, 4, "pt"); }
  frames.push(frameFile({
    id: "09-f9", n: 9, start: 127.31, end: 146.52, chip: "instrumental",
    svg: `<g class="mand">${stringArt("ch", CX, CY, RAD)}${pts}</g>`,
    extraHTML: `<div class="cap c1">só linhas retas…</div><div class="cap c2">…desenhando uma curva.</div>`,
    css: `#R .pt,#R .cap{opacity:0}
#R .cap{position:absolute;left:0;right:0;bottom:142px;text-align:center;font:italic 400 60px Newsreader,serif}
#R svg.geo .chb{stroke:${SOFT}}`,
    script: `
          tl.fromTo(E(".pt"), { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3, stagger: 2.2 / ${N}, ease: "back.out(2)", ...IR }, at(127.4));
          const ch = R.querySelectorAll(".ch");
          // 1ª frase lenta, depois acelera conforme a música volta a crescer
          ch.forEach((el, i) => {
            const t = i < 30 ? 129.71 + i * 0.24 : i < 45 ? 136.93 + (i - 30) * 0.3 : 141.71 + (i - 45) * 0.25;
            draw(el, t, 0.7, "power1.inOut");
          });
          const chb = R.querySelectorAll(".chb");
          chb.forEach((el, i) => draw(el, 141.71 + i * (4.3 / chb.length), 0.5, "power1.out"));
          show(".c1", 129.71, 0.8); hide(".c1", 135.6, 0.6);
          show(".c2", 139.3, 0.8); hide(".c2", 145.4, 0.5);
          tl.fromTo($(".mand"), { rotate: 0, svgOrigin: "${CX} ${CY}" }, { rotate: 24, duration: 146.52 - 127.31, ease: "none", ...IR }, 0);
          tl.fromTo($(".cam"), { scale: 0.96 }, { scale: 1.04, duration: 146.52 - 127.31, ease: "sine.inOut", ...IR }, 0);`,
  }));
}

// ---------- F10 refrão final ----------
{
  const A = [146.52, 148.91, 151.3, 153.72, 156.11, 158.52, 160.91, 163.31];
  const FINAL = ["Reta segue eterna sem se limitar", "Semirreta parte e não vai retornar", "Segmento tem medida pra contar", "Três caminhos pra gente estudar", "Reta é livre, não tem definição", "Semirreta nasce de um ponto, então", "Segmento tem começo e também tem fim", "Geometria é arte dentro de mim"];
  let bgArt = "";
  for (let i = 1; i < N; i++) { const [x1, y1] = P(i, 960, 470, 330), [x2, y2] = P((2 * i) % N, 960, 470, 330); bgArt += line(x1, y1, x2, y2, "", 1.6); }
  frames.push(frameFile({
    id: "10-f10", n: 10, start: 146.52, end: 168.64, chip: "refrão final",
    svg: `<g class="bgart">${bgArt}</g>${lanesSVG()}`,
    extraHTML: `<div class="end">Geometria é <em>arte</em> dentro de mim</div>`,
    lyrics: FINAL, anchors: A,
    css: `#R .bgart{opacity:.13} #R .end{position:absolute;left:120px;right:120px;top:410px;text-align:center;white-space:nowrap;font:400 112px/1 Newsreader,serif;letter-spacing:-.01em;opacity:0}
#R .end em{font-style:italic}`,
    script: lanesScript(A, MENTION, 165.7, [160.0]) + `
          tl.fromTo($(".bgart"), { rotate: 0, svgOrigin: "960 470" }, { rotate: 30, duration: 168.64 - 146.52, ease: "none", ...IR }, 0);
          // final: as faixas saem, a mandala acende e o verso fica como título
          tl.to(E(".lanes"), { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, at(165.45));
          tl.to(E(".ly"), { opacity: 0, duration: 0.3 }, at(165.5));
          tl.to(E(".bgart"), { opacity: 0.3, duration: 1.2, ease: "power2.out" }, at(165.7));
          tl.fromTo(E(".end"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", ...IR }, at(165.6));
          flash(167.0, 0.2); punch(".end", 167.0, 1.04);`,
  }));
}

mkdirSync("compositions/frames", { recursive: true });
const ids = ["01-f1", "02-f2", "03-f3", "04-f4", "05-f5", "06-f6", "07-f7", "08-f8", "09-f9", "10-f10"];
frames.forEach((html, i) => writeFileSync(`compositions/frames/${ids[i]}.html`, html));
console.log(`wrote ${frames.length} frames`);
