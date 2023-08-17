import {KeycloakService} from "keycloak-angular";
import {environment} from "../../../environments/environment";


export function initializeKeycloak(keycloak: KeycloakService){

  return () => keycloak.init({


    config: {
      url: environment.config.KEYCLOAK_URL,
      realm: environment.config.KEYCLOAK_REALM,
      clientId: environment.config.KEYCLOAK_CLIENT_ID
    },

    initOptions: {
      onLoad: 'check-sso',
      checkLoginIframe: false,
    },

    bearerExcludedUrls: [environment.config.TEILER_BACKEND_URL]

  });

}
