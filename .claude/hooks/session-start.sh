#!/bin/bash
# Instala o HyperFrames (CLI, Chrome headless e skills de agente) nas sessões do Claude Code na web.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# CLI
if ! command -v hyperframes >/dev/null 2>&1; then
  npm install -g hyperframes
fi

# Chrome Headless Shell usado na renderização (idempotente: reutiliza o cache)
hyperframes browser ensure >/dev/null

# Skills principais para agentes (~/.claude/skills)
hyperframes skills update >/dev/null
