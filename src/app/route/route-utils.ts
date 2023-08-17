import {environment} from "../../environments/environment";

export const BASE_MAIN_ROUTER_LINK: string = '';
export const BASE_LOGIN_ROUTER_LINK: string = 'login';
export const BASE_LOGOUT_ROUTER_LINK: string = 'logout';


export function createMainRouterLink(): string {
  return createRouterLinkForBase(BASE_MAIN_ROUTER_LINK);
}

export function createLoginRouterLink(): string {
  return createRouterLinkForBase(BASE_LOGIN_ROUTER_LINK);
}

export function createLogoutRouterLink(): string {
  return createRouterLinkForBase(BASE_LOGOUT_ROUTER_LINK);
}

export function createRouterLinkForBase(base: string) {
  return createRouterLinkForBaseWithLocale(getLocale(), base)
}

function createRouterLinkForBaseWithLocale(locale: string, base: string) {
  if (environment.config.DEFAULT_LANGUAGE.toLowerCase() === locale) {
    locale = '';
  }
  let root = '';
  if (environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH && environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH.length > 0) {
    root = (environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH[0] == '/') ? environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH.substring(1) : environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH;
    if (locale.length > 0 || base.length > 0){
      root += '/';
    }
  }
  return root + locale + ((locale.length > 0 && base.length > 0) ? '/' : '') + base;
}

export function getLocale(): string {
  let locale = environment.config.DEFAULT_LANGUAGE.toLowerCase();
  let url = removeHttpRelativePath(window.location.pathname);
  let index1 = url.indexOf('/');
  if (index1 > -1 && index1 + 1 < url.length) {
    let index2 = url.indexOf('/', index1 + 1);
    let tempLocale = (index2 > -1) ? url.substring(index1 + 1, index2) : url.substring(index1 + 1);
    if (isLocale(tempLocale)) {
      locale = tempLocale;
    }
  }

  return locale;
}

export function removeHttpRelativePath(url: string){
  if (environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH && environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH.length > 0){
    let httpRelativePath = (environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH[0] == '/') ? environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH.substring(1) : environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH;
    url = url.replace(environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH, "");
    url = url.replace(httpRelativePath, "");
  }
  return url;
}

function isLocale(locale: string): boolean {
  // @ts-ignore
  return require('cldr-core/availableLocales.json').availableLocales.full.indexOf(locale) > -1;
}

export function getRouterLinkSwitchingLocale(locale: string): string {
  let currentLocale = getLocale();
  let url = ignoreFirstSlash(window.location.pathname);
  if (url.length > 0 && currentLocale !== environment.config.DEFAULT_LANGUAGE.toLowerCase()) {
    url = url.substring(locale.length);
    url = ignoreFirstSlash(url);
  }
  return createRouterLinkForBaseWithLocale(locale, url);
}

function ignoreFirstSlash(url: string) {
  return (url.charAt(0) == '/') ? url.substring(1) : url;
}

export function getHref(routerLink: string) {
  return removeHttpRelativePath(window.location.origin) + environment.config.TEILER_ORCHESTRATOR_HTTP_RELATIVE_PATH + ((routerLink.length > 0) ? '/' + removeHttpRelativePath(routerLink) : '');
}
