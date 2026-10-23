# A Voz da Matemática

Este repositório produz só vídeos do canal **A Voz da Matemática** (TikTok e, depois, Reels/Shorts).
Objetivo: ganhar seguidores e monetizar com vídeos de matemática **didáticos e curiosos** que ajudam
as pessoas a entender cálculos do dia a dia.

## Identidade (não mudar sem o dono pedir)

- **Formato:** vertical 1080×1920, 30 fps, 35–65 s. Ferramenta: HyperFrames (`/hyperframes`).
- **Visual:** lousa verde `#1F3A2D` com textura leve de giz, giz branco `#F2EFE4` e **um** destaque amarelo-giz
  `#F5D547`, usado só no resultado ou na parte que importa. Fontes: Kalam (números e títulos) e Patrick Hand (legendas).
- **Voz:** ElevenLabs, voz **Roberto Valença** (`bZztR6P62TDbe6sgaZgz`), modelo `eleven_multilingual_v2`, 2 versões por vídeo.
  Escreva os números por extenso no roteiro ("mil e quatrocentos") para a voz não errar a leitura.
- **Legendas:** sempre presentes (muita gente assiste sem som), na faixa y ≈ 1190 px.
- **Fechamento:** cartão "A Voz da Matemática" com a regra do vídeo em uma linha (ex.: "20% = 10% × 2").

## Estrutura de todo vídeo

1. **Gancho (0–3 s):** uma situação real com o número já na tela (preço, conta, desconto, receita). O frame 0 é a miniatura.
2. **Um exemplo resolvido do começo ao fim**, com um único desenho que cresce (barra, grade, balança, régua).
   Cada parte aparece quando a voz fala dela.
3. **O resultado** em amarelo, com destaque.
4. **O truque ou a regra geral**, que o espectador leva para a vida.
5. **Cartão final** com a marca.

Regras: confira a conta antes de animar (um vídeo bonito com a conta errada derruba o canal); uma ideia por vídeo;
no máximo cerca de 19 palavras faladas por cena; texto na tela entre y = 168 e 1330 px (fora da área da interface do app).

## Como fazer um vídeo novo

O projeto de referência é `videos/vm-20-porcento-de-1400/`. Para cada vídeo novo:

1. Copie a pasta para `videos/vm-<assunto>/` (sem `renders/`, `assets/narracao*.mp3` e `build/timing.json`).
2. Reescreva o roteiro em `SENT` (em `build/build.mjs` **e** em `build/sync.mjs`) e as animações da cena em `build/build.mjs`.
3. `node build/build.mjs` gera tudo com tempos estimados; confira com `npx hyperframes check .` e `npx hyperframes snapshot . --at ...`.
4. Gere a narração no ElevenLabs, salve em `assets/narracao.mp3` e normalize:
   `ffmpeg -i bruto.mp3 -af loudnorm=I=-15:TP=-1.5:LRA=11 -ar 44100 -b:a 192k assets/narracao.mp3`.
5. `node build/sync.mjs assets/narracao.mp3 && node build/build.mjs` sincroniza animação e legenda com a voz.
6. `npx hyperframes render . -q high -o renders/<nome>.mp4 --fps 30` e confira o volume (alvo de -16 a -14 LUFS).

## Ambiente (limites conhecidos)

- CDNs (jsdelivr, unpkg, cdnjs) são bloqueadas: GSAP e fontes ficam locais em `assets/vendor` e `assets/fonts` (fontes via npm `@fontsource/*`).
- O ElevenLabs às vezes devolve 429 (limite de requisições): espere e tente de novo, sem repetir em sequência.
- Google Drive: pasta do canal `A Voz da Matemática` (id `1mg7SptybdljkQ9nJdWidRQApKiw8SmB1`). O conector não envia vídeos
  grandes (só aceita o arquivo inteiro em base64); o dono sobe os MP4 manualmente.
- A pauta de vídeos está em `PAUTA.md`.
