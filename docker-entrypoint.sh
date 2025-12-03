#!/bin/sh
# Robust entrypoint for the frontend container
# - Ensure a runtime `config.js` exists to avoid sed failures
# - Replace placeholder with `VITE_API_URL` or default
# - Ensure permissions and run nginx in foreground

set -e

# Path where the built assets are served by nginx
WWW_DIR=/usr/share/nginx/html
CFG_FILE="$WWW_DIR/config.js"

# Create a safe default runtime config if it doesn't exist
if [ ! -f "$CFG_FILE" ]; then
  echo "Config file not found, creating default runtime config"
  cat > "$CFG_FILE" <<'EOF'
window.ENV = {
  VITE_API_URL: 'VITE_API_URL_PLACEHOLDER'
};
EOF
fi

# Replace placeholder with actual env var (use '|' as sed delimiter to support URLs)
if [ -n "$VITE_API_URL" ]; then
  echo "Configuring API URL: $VITE_API_URL"
  sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" "$CFG_FILE" || true
else
  echo "VITE_API_URL not set, using default http://localhost:8080"
  sed -i "s|VITE_API_URL_PLACEHOLDER|http://localhost:8080|g" "$CFG_FILE" || true
fi

chown nginx:nginx "$CFG_FILE" || true

echo "Starting Nginx..."
exec nginx -g 'daemon off;'
