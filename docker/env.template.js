(function (window) {
  window["env"] = window["env"] || {};
  window["env"]["teiler"] = {};
  // Environment variables
  window["env"]["teiler"]["config"] = {
    "DEFAULT_LANGUAGE": "${DEFAULT_LANGUAGE}",
    "TEILER_CORE_URL": "${TEILER_CORE_URL}",
    "KEYCLOAK_URL": "${KEYCLOAK_URL}",
    "KEYCLOAK_REALM": "${KEYCLOAK_REALM}",
    "KEYCLOAK_CLIENT_ID": "${KEYCLOAK_CLIENT_ID}",
    "TEILER_ADMIN_NAME": "${TEILER_ADMIN_NAME}",
    "TEILER_ADMIN_EMAIL": "${TEILER_ADMIN_EMAIL}",
    "TEILER_ADMIN_PHONE": "${TEILER_ADMIN_PHONE}",
    "TEILER_PROJECT": "${TEILER_PROJECT}",
    "TEILER_API_KEY": "${TEILER_API_KEY}"
  };

})(this);
