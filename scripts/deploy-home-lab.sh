#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "[ERROR] This script must be run with sudo or as root." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env"
SERVER_ENV_FILE="${PROJECT_ROOT}/server/.env"
DB_NAME="commission_calculator"
DB_USER="commission_app"
PORT="5000"

log() {
  echo "[deploy] $1"
}

set_env_var() {
  local key="$1"
  local value="$2"
  local file="$3"
  if grep -q "^${key}=" "$file" 2>/dev/null; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$file"
  else
    echo "${key}=${value}" >> "$file"
  fi
}

ensure_packages() {
  log "Updating apt repositories"
  apt-get update -y >/dev/null

  local packages=(ca-certificates curl gnupg build-essential mysql-server openssl)
  log "Installing required apt packages: ${packages[*]}"
  DEBIAN_FRONTEND=noninteractive apt-get install -y "${packages[@]}" >/dev/null

  systemctl enable mysql >/dev/null 2>&1 || true
  systemctl start mysql >/dev/null 2>&1 || true
}

install_node() {
  local required_major=18
  if command -v node >/dev/null 2>&1; then
    local installed_major
    installed_major="$(node -v | cut -d'.' -f1 | tr -d 'v')"
    if [[ "$installed_major" -ge "$required_major" ]]; then
      log "Node.js $(node -v) already installed"
      return
    fi
  fi

  log "Installing Node.js ${required_major}.x from NodeSource"
  curl -fsSL https://deb.nodesource.com/setup_${required_major}.x | bash - >/dev/null
  apt-get install -y nodejs >/dev/null
  log "Installed Node.js $(node -v) and npm $(npm -v)"
}

prepare_env_file() {
  if [[ ! -f "$ENV_FILE" ]]; then
    cp "${PROJECT_ROOT}/.env.example" "$ENV_FILE"
  fi

  local db_password
  if db_password=$(grep -E '^DB_PASSWORD=' "$ENV_FILE" | cut -d'=' -f2-); then
    if [[ -z "$db_password" ]]; then
      db_password="$(openssl rand -hex 16)"
    fi
  else
    db_password="$(openssl rand -hex 16)"
  fi

  local jwt_secret
  if jwt_secret=$(grep -E '^JWT_SECRET=' "$ENV_FILE" | cut -d'=' -f2-); then
    if [[ -z "$jwt_secret" || "$jwt_secret" == "your_secret_key_here" ]]; then
      jwt_secret="$(openssl rand -hex 32)"
    fi
  else
    jwt_secret="$(openssl rand -hex 32)"
  fi

  set_env_var "DB_HOST" "localhost" "$ENV_FILE"
  set_env_var "DB_USER" "$DB_USER" "$ENV_FILE"
  set_env_var "DB_PASSWORD" "$db_password" "$ENV_FILE"
  set_env_var "DB_NAME" "$DB_NAME" "$ENV_FILE"
  set_env_var "JWT_SECRET" "$jwt_secret" "$ENV_FILE"
  set_env_var "JWT_EXPIRE" "24h" "$ENV_FILE"
  set_env_var "PORT" "$PORT" "$ENV_FILE"
  set_env_var "NODE_ENV" "production" "$ENV_FILE"
  set_env_var "CLIENT_ORIGIN" "http://localhost:${PORT}" "$ENV_FILE"

  if ! grep -q '^CURRENCY_API_KEY=' "$ENV_FILE"; then
    set_env_var "CURRENCY_API_KEY" "demo" "$ENV_FILE"
  fi
  set_env_var "CURRENCY_API_URL" "https://v6.exchangerate-api.com/v6/\${CURRENCY_API_KEY}/latest/USD" "$ENV_FILE"

  cp "$ENV_FILE" "$SERVER_ENV_FILE"
}

configure_database() {
  local db_password
  db_password=$(grep -E '^DB_PASSWORD=' "$ENV_FILE" | cut -d'=' -f2-)

  log "Configuring MySQL database and user"
  mysql <<SQL
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${db_password}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${db_password}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

  log "Applying database schema"
  mysql --user="$DB_USER" --password="$db_password" "$DB_NAME" < "${PROJECT_ROOT}/database/schema.sql"
}

install_dependencies() {
  log "Installing server dependencies"
  pushd "${PROJECT_ROOT}/server" >/dev/null
  npm install >/dev/null
  popd >/dev/null

  log "Installing client dependencies"
  pushd "${PROJECT_ROOT}/client" >/dev/null
  npm install >/dev/null
  npm run build >/dev/null
  popd >/dev/null
}

start_backend() {
  log "Stopping existing application instances"
  pkill -f "node server.js" >/dev/null 2>&1 || true

  log "Starting backend in production mode"
  pushd "${PROJECT_ROOT}/server" >/dev/null
  nohup env NODE_ENV=production PORT=${PORT} npm start >/var/log/commission-calculator.log 2>&1 &
  popd >/dev/null
}

main() {
  ensure_packages
  install_node
  prepare_env_file
  configure_database
  install_dependencies
  start_backend

  log "Deployment complete"
  echo ""
  echo "Application is running at:"
  echo "  Backend + UI: http://localhost:${PORT}" 
  echo "Logs: /var/log/commission-calculator.log"
  echo "Default credentials: kliment/kliment$, hugo/hugo$, arnaud/arnaud$"
  echo "Update CURRENCY_API_KEY in ${ENV_FILE} for live rates."
}

main "$@"
