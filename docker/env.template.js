(function (window) {
  window["env"] = window["env"] || {};
  window["env"]["teiler"] = {};
  // Environment variables
  window["env"]["teiler"]["config"] = {
    "DEFAULT_LANGUAGE": "${DEFAULT_LANGUAGE}",
    "TEILER_BACKEND_URL": "${TEILER_BACKEND_URL}",
    "OIDC_URL": "${OIDC_URL}",
    "OIDC_REALM": "${OIDC_REALM}",
    "OIDC_CLIENT_ID": "${OIDC_CLIENT_ID}",
    "OIDC_TOKEN_GROUP": "${OIDC_TOKEN_GROUP}",
    "TEILER_ADMIN_NAME": "${TEILER_ADMIN_NAME}",
    "TEILER_ADMIN_EMAIL": "${TEILER_ADMIN_EMAIL}",
    "TEILER_ADMIN_PHONE": "${TEILER_ADMIN_PHONE}",
    "TEILER_PROJECT": "${TEILER_PROJECT}",
    "EXPORTER_API_KEY": "${EXPORTER_API_KEY}",
    "TEILER_ORCHESTRATOR_URL": "${TEILER_ORCHESTRATOR_URL}",
    "TEILER_DASHBOARD_HTTP_RELATIVE_PATH": "${TEILER_DASHBOARD_HTTP_RELATIVE_PATH}",
    "TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH": "${TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH}",
    "REPORTER_DEFAULT_TEMPLATE_ID": "${REPORTER_DEFAULT_TEMPLATE_ID}",
    "EXPORTER_DEFAULT_TEMPLATE_ID": "${EXPORTER_DEFAULT_TEMPLATE_ID}",
    "TEILER_USER": "${TEILER_USER}",
    "TEILER_ADMIN": "${TEILER_ADMIN}"
  };

})(this);
