#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-}"
if [[ -z "$DOMAIN" ]]; then
  echo "Использование: ./scripts/set-domain.sh example.ru"
  exit 1
fi

DOMAIN="${DOMAIN#http://}"
DOMAIN="${DOMAIN#https://}"
DOMAIN="${DOMAIN%%/*}"

for file in nginx/conf.d/ruri.conf robots.txt sitemap.xml frontend/public/robots.txt frontend/public/sitemap.xml; do
  sed -i "s/YOUR_DOMAIN\\.RU/${DOMAIN}/g" "$file"
done

cp nginx/conf.d/ruri.conf /tmp/ruri-nginx.conf
sed -i "s/^# *server {/server {/; s/^# *listen 443/listen 443/; s/^# *server_name/server_name/; s/^# *ssl_/ssl_/; s/^# *add_header Strict/add_header Strict/; s/^# *location/location/; s/^# *limit_req/limit_req/; s/^# *proxy_/proxy_/; s/^# *}/}/" /tmp/ruri-nginx.conf

# The HTTPS block remains intentionally commented until a certificate exists.
# Obtain the certificate first, then uncomment the HTTPS server block.
echo "Домен установлен: ${DOMAIN}"
echo "Следующий шаг: направьте DNS A/AAAA на VPS и получите Let's Encrypt сертификат."
