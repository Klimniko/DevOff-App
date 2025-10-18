#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLIENT_DIR="$ROOT_DIR/client"
SERVER_DIR="$ROOT_DIR/server"

usage() {
  cat <<'USAGE'
Usage: ./scripts/qa-check.sh [--skip-install]

Runs the standard quality gates for the commission calculator in sequence:
  1. Install backend and frontend dependencies (unless skipped).
  2. Lint the backend source.
  3. Lint the frontend source.
  4. Build the production frontend bundle.

Options:
  --skip-install   Skip npm install steps when dependencies are already present.
  -h, --help       Show this help text.
USAGE
}

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

run_in_dir() {
  local dir=$1
  shift
  (cd "$dir" && "$@")
}

ensure_dependencies() {
  local dir=$1
  local name=$2

  if [[ $SKIP_INSTALL == "true" ]]; then
    log "Skipping dependency install for $name (per flag)."
    return
  fi

  if [[ -d "$dir/node_modules" ]]; then
    log "Dependencies already present for $name; refreshing via npm install."
  else
    log "Installing dependencies for $name."
  fi

  run_in_dir "$dir" npm install
}

SKIP_INSTALL="false"

while (($#)); do
  case "$1" in
    --skip-install)
      SKIP_INSTALL="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

log "Starting QA checks from $ROOT_DIR"

ensure_dependencies "$SERVER_DIR" "server"
ensure_dependencies "$CLIENT_DIR" "client"

log "Running server lint"
run_in_dir "$SERVER_DIR" npm run lint

log "Running client lint"
run_in_dir "$CLIENT_DIR" npm run lint

log "Building client for production"
run_in_dir "$CLIENT_DIR" npm run build

log "QA checks completed successfully."
