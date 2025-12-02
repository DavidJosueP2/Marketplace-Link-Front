#!/bin/sh
set -e

WWW_DIR=/usr/share/nginx/html
CFG_FILE="$WWW_DIR/config.js"

if [ ! -f "$CFG_FILE" ]; then
  echo "Warning: $CFG_FILE not found, creating default runtime config"
  cat > "$CFG_FILE" <<'EOF'
window.ENV = {
  VITE_API_URL: 'VITE_API_URL_PLACEHOLDER'
};
EOF
fi

if [ -n "$VITE_API_URL" ]; then
  echo "Configuring API URL: $VITE_API_URL"
  sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" "$CFG_FILE" || true
else
  echo "Warning: VITE_API_URL not set, using default http://localhost:8080"
  sed -i "s|VITE_API_URL_PLACEHOLDER|http://localhost:8080|g" "$CFG_FILE" || true
fi

chown nginx:nginx "$CFG_FILE" || true

echo "Starting Nginx..."
exec nginx -g 'daemon off;'
