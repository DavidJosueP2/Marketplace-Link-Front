#!/bin/sh
# Script to replace environment variables at runtime

# Replace VITE_API_URL_PLACEHOLDER with actual env var value
if [ ! -z "$VITE_API_URL" ]; then
  echo "🔧 Configuring API URL: $VITE_API_URL"
  sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" /usr/share/nginx/html/config.js
else
  echo "⚠️  VITE_API_URL not set, using default"
  sed -i "s|VITE_API_URL_PLACEHOLDER|http://localhost:8080|g" /usr/share/nginx/html/config.js
fi

# Start Nginx
echo "🚀 Starting Nginx..."
exec nginx -g 'daemon off;'
