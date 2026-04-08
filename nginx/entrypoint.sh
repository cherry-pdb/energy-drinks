#!/bin/sh
set -eu

: "${DOMAIN:=localhost}"

HTTP_TEMPLATE="/etc/nginx/templates/http.conf.template"
HTTPS_TEMPLATE="/etc/nginx/templates/https.conf.template"
OUTPUT="/etc/nginx/conf.d/default.conf"

envsubst '${DOMAIN}' < "$HTTP_TEMPLATE" > "$OUTPUT"

CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
KEY_PATH="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"

if [ -f "$CERT_PATH" ] && [ -f "$KEY_PATH" ]; then
  echo "" >> "$OUTPUT"
  envsubst '${DOMAIN}' < "$HTTPS_TEMPLATE" >> "$OUTPUT"
fi

nginx -g 'daemon off;'
