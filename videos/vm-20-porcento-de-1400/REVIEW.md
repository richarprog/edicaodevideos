# Revisão: 20% de 1400 (A Voz da Matemática)

- Roteiro construído: A, "A barra que se divide". Os roteiros B (truque do zero) e C (100 quadradinhos) estão em STORYLINES.md.
- Formato: 1080×1920, 30 fps, 46,2 s. Lousa verde, giz branco e destaque em amarelo-giz. Fontes Kalam e Patrick Hand.
- Narração ainda não incluída: o ElevenLabs recusou quatro pedidos com 429 (excesso de requisições), sem gasto de créditos.
  Os tempos atuais são estimados a 2,4 palavras/s. Para sincronizar com a voz real: coloque o áudio em
  assets/narracao.mp3 e rode `node build/sync.mjs assets/narracao.mp3 && node build/build.mjs`.
- Verificado: `check` sem erros; layout conferido por imagens em 12 momentos (nada cortado nem sobreposto, texto dentro da faixa segura do TikTok).
- Aviso mantido de propósito: film_silent (sem áudio até a narração entrar). Ainda não há trilha nem efeitos sonoros.
- Ponto mais fraco: o trecho de 12 a 16 s mostra só a barra vazia esperando a divisão; com a voz real o ritmo fica mais apertado.
