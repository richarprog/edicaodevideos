# Revisão: 20% de 1400 (A Voz da Matemática)

- Roteiro construído: A, "A barra que se divide". Os roteiros B (truque do zero) e C (100 quadradinhos) estão em STORYLINES.md.
- Formato: 1080×1920, 30 fps, 44,0 s. Lousa verde, giz branco e destaque em amarelo-giz. Fontes Kalam e Patrick Hand.
- Narração: ElevenLabs, voz Roberto Valença (eleven_multilingual_v2), versão 1 de 2 (a outra está em assets/narracao-take2.mp3).
  Gasto: 1.018 créditos (2 versões × 509).
- Sincronia: build/sync.mjs detecta as pausas da fala e escolhe as fronteiras entre as 11 frases por programação dinâmica.
  Dentro de cada frase, o tempo das palavras é distribuído pelo número de letras (estimativa, não é transcrição).
- Áudio: normalizado para -15 LUFS; o vídeo final mediu -13,7 LUFS integrado e pico de -1,6 dBFS. O áudio foi medido, não ouvido.
- Verificado: `check` sem erros e sem avisos; layout conferido por imagens em 10 momentos.
- Ainda falta: trilha de fundo e efeitos sonoros (o vídeo tem só a voz).
- Para trocar a voz: coloque o áudio em assets/narracao.mp3 e rode `node build/sync.mjs assets/narracao.mp3 && node build/build.mjs`.
