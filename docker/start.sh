#!/usr/bin/env bash

envsubst < ./assets/env.template.js > ./assets/env.js
for directory in */; do
  if [ -e ./${directory}assets ]; then
    envsubst < ./assets/env.template.js > ./${directory}assets/env.js
  fi
done
envsubst '${TEILER_DASHBOARD_SERVER_NAME} ${TEILER_ORCHESTRATOR_URL}'< /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf

echo 'Start Teiler Dashboard in NGINX in foreground (non-daemon-mode)'
exec nginx -g 'daemon off;'
