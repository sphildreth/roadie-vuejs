#!/bin/sh
JSON_STRING='window.configs = { \
  "ROADIE_API_URL":"'"${ROADIE_API_URL}"'", \
  "ROADIE_VUE_APP_NAME":"'"${ROADIE_VUE_APP_NAME}"'" \
}'
sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html
exec "$@"