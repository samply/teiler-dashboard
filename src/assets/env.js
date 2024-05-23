(function (window) {
  window["env"] = window["env"] || {};
  window["env"]["teiler"] = {};
  // Environment variables
  window["env"]["teiler"]["config"] = {
    "DEFAULT_LANGUAGE": "DE",
    "TEILER_BACKEND_URL": "http://localhost:8085",
    "OIDC_URL": "https://login.verbis.dkfz.de",
    "OIDC_REALM": "test-realm-01",
    "OIDC_CLIENT_ID": "bridgehead-test",
    "OIDC_TOKEN_GROUP": "groups",
    "TEILER_ADMIN_NAME": "Max Mustermann",
    "TEILER_ADMIN_EMAIL": "max.mustermann@teiler-example.com",
    "TEILER_ADMIN_PHONE": "+49 123 456789",
    "TEILER_PROJECT": "DKTK",
    "EXPORTER_API_KEY": "ttsHGwSITs0Eq8L63YWtLVyHymBmULvZIihL6w4t42FBmzp6Eb9SGNd7fZmeUtAI",
    "TEILER_ORCHESTRATOR_URL": "http://localhost:9000",
    "TEILER_DASHBOARD_HTTP_RELATIVE_PATH": "",
    "TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH": "",
    "REPORTER_DEFAULT_TEMPLATE_ID": "ccp-qb",
    "EXPORTER_DEFAULT_TEMPLATE_ID": "ccp",
    "TEILER_USER": "bridgehead-test",
    "TEILER_ADMIN": "bridgehead-test-admin",
    "BACKGROUND_IMAGE_URL": "http://localhost:8085/assets/Background_Box1.svg",
    "LOGO_URL": "http://localhost:8085/assets/DKTK_TEILER_LOGO.svg",
    "COLOR_PALETTE": "Color-Palette-2",
  };

})(this);
