#!/usr/bin/env bash

for directory in */; do
  if [ -e ./${directory}assets ]; then
    envsubst <./${directory}assets/env.template.js >./${directory}assets/env.js
  fi
done

echo 'Start Teiler UI in NGINX in foreground (non-daemon-mode)'
exec nginx -g 'daemon off;'
