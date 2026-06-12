#!/usr/bin/env bash
# check-fresh.sh — Prüft ob /tmp/fuerte-pages-fresh aktuell mit GitHub ist.
# Muss vor jeder Bulk-Operation (rsync, Massenbearbeitung) ausgeführt werden.
# Verwendung: bash scripts/check-fresh.sh

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

echo "🔍 Prüfe Git-Status von: $REPO_DIR"

# Aktuelle Remote-Commits holen (kein Merge)
git fetch origin main --quiet

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo ""
  echo "❌ ABBRUCH: Lokaler Klon ist NICHT aktuell!"
  echo "   Lokal:  $LOCAL"
  echo "   Remote: $REMOTE"
  echo ""
  echo "   Bitte zuerst 'git pull origin main' ausführen."
  exit 1
fi

# Prüfe auf uncommittete lokale Änderungen
DIRTY=$(git status --porcelain)
if [ -n "$DIRTY" ]; then
  echo ""
  echo "⚠️  WARNUNG: Es gibt uncommittete lokale Änderungen:"
  echo "$DIRTY"
  echo ""
  echo "   Bitte erst committen oder stashen, dann fortfahren."
  exit 1
fi

echo "✅ Klon ist aktuell (HEAD: ${LOCAL:0:7}) — sicher zum Arbeiten."
