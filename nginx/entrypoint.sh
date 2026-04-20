#!/bin/sh
set -eu

: "${DOMAIN:=localhost}"

HTTP_TEMPLATE="/etc/nginx/templates/http.conf.template"
HTTPS_TEMPLATE="/etc/nginx/templates/https.conf.template"
HTTP_TLS_REDIRECT_TEMPLATE="/etc/nginx/templates/http.tls-redirect.conf.template"
OUTPUT="/etc/nginx/conf.d/default.conf"

CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
KEY_PATH="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"

if [ -f "$CERT_PATH" ] && [ -f "$KEY_PATH" ]; then
  envsubst '${DOMAIN}' < "$HTTPS_TEMPLATE" > "$OUTPUT"
  echo "" >> "$OUTPUT"
  envsubst '${DOMAIN}' < "$HTTP_TLS_REDIRECT_TEMPLATE" >> "$OUTPUT"
else
  envsubst '${DOMAIN}' < "$HTTP_TEMPLATE" > "$OUTPUT"
fi

nginx -g 'daemon off;'
