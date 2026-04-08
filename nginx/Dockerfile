FROM nginx:stable-alpine

RUN apk add --no-cache gettext

COPY templates /etc/nginx/templates
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
