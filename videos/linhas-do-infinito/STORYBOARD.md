---
compositionId: bgm
duration_s: 168.64
canvas: { w: 1920, h: 1080, fps: 30 }
style:
  font: "Newsreader / Hanken Grotesk / DM Mono"
  palette: ["#F0EBDE", "#E6E0CE", "#1F2BE0", "#5560E5"]
assets: false
build_notes:
  - "one paused timeline per frame"
  - "no remote assets"
  - "lyric lines land on bar downbeats (estimated sync, ~1 line per bar); each line enters ~0.15s before its downbeat"
  - "permanent graph-paper grid + top/bottom cobalt hairlines on every frame (frame.md)"
  - "geometry is drawn as SVG strokes (stroke-dashoffset draws) in cobalt ink; points are filled circles with Newsreader italic labels A, B, O"
avoid: ["generic slideshow", "tiny unreadable lyric text", "decoration that contradicts the verse (no endpoints on a reta)"]
---

## Frame 1 — f1

- src: compositions/frames/01-f1.html
- duration: 12.1s
- span_sec: [0.0, 12.1]
- pacing: phrase_flow
- mood: [dreamy, elegant]
- feel: sparse intro, two short silences (0-1s, 8-9s), low energy pad with soft perc roll

### Groups

- **g1** — free_design
  - span_sec: [0.0, 12.1]
  - free_design: { dominant_system: "pencil on graph paper: one point appears, a stroke starts drawing and runs off both edges; title resolves", primitives: ["mask-reveal", "kinetic-letter-in"], density_topology: "accumulate" }
  - anchors: [1.0, 2.46, 4.9, 7.29, 9.71]
  - copy: ["Linhas do Infinito", "reta · semirreta · segmento"]

## Frame 2 — f2

- src: compositions/frames/02-f2.html
- duration: 19.2s
- span_sec: [12.1, 31.3]
- pacing: beat_cut
- mood: [dreamy, playful]
- feel: verse 1, steady 99bpm grid with hi-hat fills, low-to-medium energy, 8 sung lines one per bar

### Groups

- **g1** — free_design
  - span_sec: [12.1, 31.3]
  - free_design: { dominant_system: "a line drawn across the page grows past both edges as the camera slowly pulls back; lower-third lyric line per bar", primitives: ["mask-reveal", "dolly-zoom"], density_topology: "accumulate" }
  - anchors: [12.1, 14.51, 16.9, 19.3, 21.71, 24.1, 26.52, 28.91]
  - copy: ["No papel eu começo a imaginar", "Um traço que não para de andar", "Vai além do que posso enxergar", "Sem começo e sem fim pra marcar", "É a reta que segue sem direção final", "Cresce infinita, conceito essencial", "Nem definição ela chega a ter", "É primitiva, só dá pra entender"]

## Frame 3 — f3

- src: compositions/frames/03-f3.html
- duration: 9.61s
- span_sec: [31.3, 40.91]
- pacing: beat_cut
- mood: [tense, playful]
- feel: pre-chorus build, rising medium energy into the chorus downbeat at 40.91

### Groups

- **g1** — free_design
  - span_sec: [31.3, 40.91]
  - free_design: { dominant_system: "big centred lyric; a crossed-out start dot, a crossed-out end dot, then double arrows racing out both sides", primitives: ["kinetic-letter-in", "radial-burst-lines"], density_topology: "build" }
  - anchors: [31.3, 33.72, 36.11, 38.52, 40.91]
  - copy: ["Não tem ponto inicial", "Nem tem ponto terminal", "Vai nos dois sentidos sem parar"]

## Frame 4 — f4

- src: compositions/frames/04-f4.html
- duration: 19.21s
- span_sec: [40.91, 60.12]
- pacing: beat_cut
- mood: [hype, playful]
- feel: chorus 1, medium-high energy, short silence at 51-52 then SURGE at 52

### Groups

- **g1** — free_design
  - span_sec: [40.91, 60.12]
  - free_design: { dominant_system: "three stacked lanes: reta (arrows both ends), semirreta (dot + one arrow), segmento (A—B with ruler ticks); the lane named in each lyric line lights up; SURGE at 52 slams all three", primitives: ["mask-reveal", "braam-punch", "outline-to-fill"], density_topology: "spotlight" }
  - anchors: [40.91, 43.3, 45.72, 48.11, 50.5, 52.92, 55.31, 57.7]
  - copy: ["Reta vai pro infinito sem jamais parar", "Semirreta tem começo, mas não vai voltar", "Segmento é limitado, dá pra medir", "Cada um com sua forma de existir", "Reta é livre, não tem definição", "Semirreta nasce de um ponto, então", "Segmento tem começo e também tem fim", "Geometria vive dentro de mim"]

## Frame 5 — f5

- src: compositions/frames/05-f5.html
- duration: 19.2s
- span_sec: [60.12, 79.32]
- pacing: beat_cut
- mood: [playful, warm]
- feel: verse 2, medium energy, silence 68-70 splits it in two halves, SURGE at 76

### Groups

- **g1** — free_design
  - span_sec: [60.12, 69.71]
  - free_design: { dominant_system: "a point O is marked, then a ray grows from O to the right only, arrowhead on the open side", primitives: ["iris-open", "mask-reveal"], density_topology: "accumulate" }
  - anchors: [60.12, 62.51, 64.92, 67.31]
  - copy: ["Se eu marco um ponto pra iniciar", "E só pra um lado ela caminhar", "Surge a semirreta a crescer", "Com um sentido só pra percorrer"]
- **g2** — free_design
  - span_sec: [69.71, 79.32]
  - free_design: { dominant_system: "two points A and B are chosen, the stroke between them draws and stops at both; a ruler slides under and the length ticks are marked", primitives: ["mask-reveal", "counting-punch"], density_topology: "accumulate" }
  - anchors: [69.71, 72.12, 74.51, 76.9]
  - copy: ["Mas se dois pontos eu escolher", "E entre eles só me deter", "Tenho um segmento pra observar", "Com limites fáceis de encontrar"]

## Frame 6 — f6

- src: compositions/frames/06-f6.html
- duration: 9.59s
- span_sec: [79.32, 88.91]
- pacing: beat_cut
- mood: [tense, playful]
- feel: pre-chorus 2, energy climbing to HIGH at 88

### Groups

- **g1** — free_design
  - span_sec: [79.32, 88.91]
  - free_design: { dominant_system: "three mini diagrams answer each line: start dot appears / end dot appears / arrow runs off forever", primitives: ["kinetic-letter-in", "radial-burst-lines"], density_topology: "build" }
  - anchors: [79.32, 81.71, 84.13, 86.52, 88.91]
  - copy: ["Tem início pra mostrar", "E também pode acabar", "Ou seguir sem nunca terminar"]

## Frame 7 — f7

- src: compositions/frames/07-f7.html
- duration: 19.2s
- span_sec: [88.91, 108.11]
- pacing: beat_cut
- mood: [hype, playful]
- feel: chorus 2, high energy, SURGE at 100

### Groups

- **g1** — free_design
  - span_sec: [88.91, 108.11]
  - free_design: { dominant_system: "same three-lane chorus system as Frame 4, inverted palette (cobalt ground, paper ink) so the second chorus reads bigger; SURGE at 100 slams all three", primitives: ["palette-flip", "braam-punch", "outline-to-fill"], density_topology: "spotlight" }
  - anchors: [88.91, 91.32, 93.72, 96.11, 98.52, 100.91, 103.31, 105.72]
  - copy: ["Reta vai pro infinito sem jamais parar", "Semirreta tem começo, mas não vai voltar", "Segmento é limitado, dá pra medir", "Cada um com sua forma de existir", "Reta é livre, não tem definição", "Semirreta nasce de um ponto, então", "Segmento tem começo e também tem fim", "Geometria vive dentro de mim"]

## Frame 8 — f8

- src: compositions/frames/08-f8.html
- duration: 19.2s
- span_sec: [108.11, 127.31]
- pacing: beat_cut
- mood: [cinematic, dreamy]
- feel: bridge, lower energy with drops/silences at 116 and 119, SURGE at 124

### Groups

- **g1** — free_design
  - span_sec: [108.11, 117.7]
  - free_design: { dominant_system: "three ideas: reta, semirreta, segmento appear as three cards, then lines leave the cards and start building a shape in space", primitives: ["staggered-exit", "mask-reveal"], density_topology: "accumulate" }
  - anchors: [108.11, 110.5, 112.92, 115.31]
  - copy: ["Três ideias pra entender", "Como as linhas vão viver", "No espaço a se formar", "É só observar"]
- **g2** — free_design
  - span_sec: [117.7, 127.31]
  - free_design: { dominant_system: "a single huge reta crosses the frame as the base; triangle, square and cube wireframes build on top of it", primitives: ["mask-reveal", "braam-punch"], density_topology: "build" }
  - anchors: [117.7, 120.12, 122.51, 124.9]
  - copy: ["Reta é base do pensar", "Nem precisa explicar", "É primitiva, está lá", "Pra tudo fundamentar"]

## Frame 9 — f9

- src: compositions/frames/09-f9.html
- duration: 19.21s
- span_sec: [127.31, 146.52]
- pacing: phrase_flow
- mood: [dreamy, cinematic]
- feel: instrumental breakdown after the DROP at 128, low energy until 140, then building back toward 146

### Groups

- **g1** — free_design
  - span_sec: [127.31, 146.52]
  - free_design: { dominant_system: "string art: straight segments between points on a circle accumulate phrase by phrase into a curved mandala made only of straight lines", primitives: ["bg-flow-field", "outline-to-fill"], density_topology: "accumulate" }
  - anchors: [127.31, 136.93, 141.71, 144.1]
  - copy: ["só linhas retas…"]

## Frame 10 — f10

- src: compositions/frames/10-f10.html
- duration: 22.12s
- span_sec: [146.52, 168.64]
- pacing: beat_cut
- mood: [hype, warm]
- feel: final chorus, sustained HIGH energy, SURGE at 160, hard stop at 167 into the end

### Groups

- **g1** — free_design
  - span_sec: [146.52, 168.64]
  - free_design: { dominant_system: "the three lanes return over the finished string-art mandala; last line 'Geometria é arte dentro de mim' holds as the closing title on the final hard stop", primitives: ["braam-punch", "outline-to-fill", "mask-reveal"], density_topology: "spotlight" }
  - anchors: [146.52, 148.91, 151.3, 153.72, 156.11, 158.52, 160.91, 163.31, 165.7, 167.0]
  - copy: ["Reta segue eterna sem se limitar", "Semirreta parte e não vai retornar", "Segmento tem medida pra contar", "Três caminhos pra gente estudar", "Reta é livre, não tem definição", "Semirreta nasce de um ponto, então", "Segmento tem começo e também tem fim", "Geometria é arte dentro de mim", "Geometria é arte dentro de mim"]
