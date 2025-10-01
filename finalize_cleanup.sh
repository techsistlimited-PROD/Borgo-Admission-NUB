#!/usr/bin/env bash
set -euo pipefail

# finalize_cleanup.sh
# This script will:
#  - Move registration-related folders to a backup directory
#  - Remove them from git index
#  - Run typecheck and build
#  - Create a cleanup changelog and a commit
#
# IMPORTANT: Run this locally in the repository root after downloading the project.
# Review the backup folder before permanently deleting anything.

TS=$(date -u +"%Y%m%dT%H%M%SZ")
BACKUP_DIR="removed_registration_backup_$TS"
CANDIDATES=(
  "registration-system"
  "registration-system-standalone"
  "public/registration"
  "Borgo-Admission-NUB/registration-system"
  "Borgo-Admission-NUB/registration-system-standalone"
  "Borgo-Admission-NUB/public/registration"
)

echo "Backup dir: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Move any existing candidate to backup
for p in "${CANDIDATES[@]}"; do
  if [ -e "$p" ]; then
    echo "Moving $p -> $BACKUP_DIR/"
    mv "$p" "$BACKUP_DIR/" || { echo "Failed to move $p"; exit 1; }
  fi
done

# Also find and move top-level folders matching registration-system*
while IFS= read -r -d '' dir; do
  rel="${dir#./}"
  if [ "$rel" != "registration-system" ] && [ "$rel" != "registration-system-standalone" ]; then
    echo "Moving $rel -> $BACKUP_DIR/"
    mv "$rel" "$BACKUP_DIR/" || true
  fi
done < <(find . -maxdepth 2 -type d -name 'registration-system*' -print0)

# Git remove
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Running git rm for removed paths (if tracked)"
  git add -A
  git rm -r --cached --ignore-unmatch registration-system || true
  git rm -r --cached --ignore-unmatch registration-system-standalone || true
  git rm -r --cached --ignore-unmatch public/registration || true
  git rm -r --cached --ignore-unmatch Borgo-Admission-NUB/registration-system || true
  git rm -r --cached --ignore-unmatch Borgo-Admission-NUB/registration-system-standalone || true
  git rm -r --cached --ignore-unmatch Borgo-Admission-NUB/public/registration || true
fi

# Create changelog
CHANGELOG_FILE="REMOVAL_LOG_$TS.md"
echo "# Removed registration-system artifacts ($TS)" > "$CHANGELOG_FILE"
echo "The following directories/files were moved to: $BACKUP_DIR" >> "$CHANGELOG_FILE"
for p in "${CANDIDATES[@]}"; do
  if [ -e "$BACKUP_DIR/$(basename "$p")" ]; then
    echo "- $p" >> "$CHANGELOG_FILE"
  fi
done

# Stage changelog and package.json changes
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git add "$CHANGELOG_FILE" package.json || true
  git commit -m "chore: remove registration-system artifacts and backup removed files" || true
  echo "Committed cleanup changes. Create a PR from this branch when ready."
else
  echo "Not a git repo; skipping commit step."
fi

# Run typecheck and build
if command -v npm >/dev/null 2>&1; then
  echo "Running npm install..."
  npm install
  echo "Running typecheck..."
  npm run typecheck || { echo "Typecheck failed; please inspect locally."; exit 1; }
  echo "Running build..."
  npm run build || { echo "Build failed; please inspect locally."; exit 1; }
  echo "Typecheck & build succeeded."
else
  echo "npm not found in PATH. Please run typecheck and build locally."
fi

echo "Cleanup complete. Backup location: $BACKUP_DIR"

echo "Next steps:"
echo "1. Inspect the backup folder and remove permanently if everything is ok: rm -rf $BACKUP_DIR"
echo "2. Push the cleanup commit and open a PR with the changelog: $CHANGELOG_FILE"
echo "3. If you want me to prepare a PR body, tell me and I'll generate it."
