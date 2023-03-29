#!/usr/bin/env bash

envsubst < ./assets/env.template.js > ./assets/env.js
for directory in */; do
  if [ -e ./${directory}assets ]; then
    envsubst < ./assets/env.template.js > ./${directory}assets/env.js
  fi
done
envsubst '${TEILER_UI_SERVER_NAME} ${TEILER_ROOT_CONFIG_URL}'< /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf

echo 'Start Teiler UI in NGINX in foreground (non-daemon-mode)'
exec nginx -g 'daemon off;'
