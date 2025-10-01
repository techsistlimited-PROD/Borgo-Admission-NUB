#!/usr/bin/env bash
set -euo pipefail

# remove-unnecessary.sh
# Usage:
#  ./remove-unnecessary.sh           # dry-run (shows what would be removed, default)
#  ./remove-unnecessary.sh --backup  # move matches to ./removed_backup_<timestamp>
#  ./remove-unnecessary.sh --remove  # permanently delete matches (USE WITH CAUTION)
#  ./remove-unnecessary.sh --help

ACTION="dry-run"
if [[ ${1:-} == "--backup" ]]; then
  ACTION="backup"
elif [[ ${1:-} == "--remove" ]]; then
  ACTION="remove"
elif [[ ${1:-} == "--help" || ${1:-} == "-h" ]]; then
  sed -n '1,120p' "$0"
  exit 0
fi

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$BASE_DIR"

echo "Running in directory: $BASE_DIR"
echo "Action: $ACTION"

# Build list of candidate paths to remove (relative to this script location)
CANDIDATES=()

# Common unwanted folders in this repo as discussed
POTENTIAL=(
  "registration-system"
  "registration-system-standalone"
  "public/registration"
  "Borgo-Admission-NUB/registration-system"
  "Borgo-Admission-NUB/registration-system-standalone"
  "Borgo-Admission-NUB/public/registration"
)

for p in "${POTENTIAL[@]}"; do
  if [ -d "$p" ]; then
    CANDIDATES+=("$p")
  fi
done

# Also find any other top-level folders named registration-system* (defensive)
while IFS= read -r -d '' dir; do
  # Ignore current candidates duplicates
  rel="${dir#./}"
  if [[ ! " ${CANDIDATES[*]} " =~ " ${rel} " ]]; then
    CANDIDATES+=("$rel")
  fi
done < <(find . -maxdepth 2 -type d -name 'registration-system*' -print0)

if [ ${#CANDIDATES[@]} -eq 0 ]; then
  echo "No candidate folders found. Nothing to do."
  exit 0
fi

TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
BACKUP_DIR="removed_backup_$TIMESTAMP"

if [ "$ACTION" = "dry-run" ]; then
  echo "Dry run — the following folders would be affected:" 
  for f in "${CANDIDATES[@]}"; do
    echo "  - $f"
  done
  echo "Run with --backup to move them to $BACKUP_DIR or --remove to permanently delete them."
  exit 0
fi

if [ "$ACTION" = "backup" ]; then
  echo "Creating backup folder: $BACKUP_DIR"
  mkdir -p "$BACKUP_DIR"
  for f in "${CANDIDATES[@]}"; do
    echo "Moving $f -> $BACKUP_DIR/"
    mv "$f" "$BACKUP_DIR/" || { echo "Failed to move $f"; exit 1; }
  done
  echo "Backup completed. Review $BASE_DIR/$BACKUP_DIR before deleting." 
  exit 0
fi

if [ "$ACTION" = "remove" ]; then
  echo "PERMANENTLY DELETING the following folders:" 
  for f in "${CANDIDATES[@]}"; do
    echo "  - $f"
  done
  read -p "Are you absolutely sure you want to permanently delete these folders? Type YES to confirm: " CONFIRM
  if [[ "$CONFIRM" != "YES" ]]; then
    echo "Aborted by user. No changes made."
    exit 1
  fi
  for f in "${CANDIDATES[@]}"; do
    echo "Removing $f"
    rm -rf -- "$f" || { echo "Failed to remove $f"; exit 1; }
  done
  echo "Permanent deletion complete."
  exit 0
fi

# Fallback
echo "Unknown action. Exiting." 
exit 1
