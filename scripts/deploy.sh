#!/usr/bin/env bash
# Production deployment script for CKD-Ticket
set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[$(date '+%H:%M:%S')] $*${NC}"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')] WARNING: $*${NC}"; }
err()  { echo -e "${RED}[$(date '+%H:%M:%S')] ERROR: $*${NC}" >&2; exit 1; }

# ─── Parse flags ─────────────────────────────────────────────────────────────
NO_CACHE=false
SKIP_PULL=false
for arg in "$@"; do
  case $arg in
    --no-cache)   NO_CACHE=true ;;
    --skip-pull)  SKIP_PULL=true ;;
    --help|-h)
      echo "Usage: ./deploy.sh [--no-cache] [--skip-pull]"
      echo "  --no-cache   Force rebuild all Docker images from scratch"
      echo "  --skip-pull  Skip 'git pull' (useful if you already pulled)"
      exit 0
      ;;
  esac
done

# ─── Prerequisites ────────────────────────────────────────────────────────────
command -v docker >/dev/null 2>&1           || err "docker is not installed"
docker compose version >/dev/null 2>&1      || err "docker compose plugin not found (requires Docker v2)"
command -v git >/dev/null 2>&1              || err "git is not installed"

# Must run from repo root (where docker-compose.yml lives)
[[ -f docker-compose.yml ]] || err "Run this script from the project root (where docker-compose.yml is)"

# ─── .env setup ──────────────────────────────────────────────────────────────
if [[ ! -f .env ]]; then
  warn ".env not found — creating from .env.example"
  cp .env.example .env
  warn "IMPORTANT: Edit .env with real secrets before continuing!"
  warn "  nano .env   (then re-run deploy.sh)"
  exit 1
fi

# ─── Pull latest code ────────────────────────────────────────────────────────
if [[ "$SKIP_PULL" == false ]]; then
  log "Pulling latest code from git..."
  git pull origin main
else
  warn "Skipping git pull (--skip-pull)"
fi

# ─── Build images ────────────────────────────────────────────────────────────
BUILD_ARGS=""
[[ "$NO_CACHE" == true ]] && BUILD_ARGS="--no-cache" && log "Building images (no cache)..." || log "Building images..."
docker compose build $BUILD_ARGS

# ─── Deploy ──────────────────────────────────────────────────────────────────
log "Starting containers..."
docker compose up -d --remove-orphans

# ─── Health check ────────────────────────────────────────────────────────────
log "Waiting for services to become healthy..."
TIMEOUT=90
ELAPSED=0
INTERVAL=5

while [[ $ELAPSED -lt $TIMEOUT ]]; do
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))

  # Fail fast if any container exited
  if docker compose ps --status exited | grep -qE "backend|frontend|db"; then
    err "A container exited unexpectedly. Check logs:\n  docker compose logs --tail=50"
  fi

  # Check that all 3 services are running (not starting/restarting)
  RUNNING=$(docker compose ps --status running --format "{{.Service}}" 2>/dev/null | wc -l)
  if [[ "$RUNNING" -ge 3 ]]; then
    break
  fi

  log "  Waiting... (${ELAPSED}s / ${TIMEOUT}s)"
done

if [[ $ELAPSED -ge $TIMEOUT ]]; then
  err "Timeout: services did not become healthy in ${TIMEOUT}s.\n  docker compose logs --tail=50"
fi

# ─── Smoke test ──────────────────────────────────────────────────────────────
log "Running smoke test on GraphQL endpoint..."
FRONTEND_PORT=$(grep -E '^APP_PORT=' .env | cut -d= -f2 | tr -d ' ' || echo 80)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "http://localhost:${FRONTEND_PORT}/graphql" \
  -H "Content-Type: application/json" \
  --data '{"query":"{__typename}"}' \
  --max-time 10 || echo "000")

if [[ "$HTTP_CODE" == "200" ]]; then
  log "Smoke test passed (HTTP $HTTP_CODE)"
else
  warn "Smoke test returned HTTP $HTTP_CODE — check logs if something looks wrong"
fi

# ─── Summary ─────────────────────────────────────────────────────────────────
log "Deployment complete!"
echo ""
docker compose ps
echo ""
log "App is running on port ${FRONTEND_PORT}"
log "View logs:  docker compose logs -f"
log "Stop app:   docker compose down"

# ─── Cleanup dangling images ─────────────────────────────────────────────────
log "Pruning dangling images..."
docker image prune -f --filter "until=24h" >/dev/null
