#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${1:-./backups}"
mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y-%m-%d_%H-%M-%S)"
FILE="$BACKUP_DIR/ruri-data-$STAMP.tar.gz"

docker compose exec -T backend tar -czf - -C /app/data . > "$FILE"

echo "Backup: $FILE"
