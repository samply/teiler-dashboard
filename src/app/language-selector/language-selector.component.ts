import {Component, OnInit} from '@angular/core';
import {getHref, getRouterLinkSwitchingLocale} from "../route/route-utils";
import {Router} from "@angular/router";


class LanguageHref {
  constructor(public language: string, public href: string) {
  }
}

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {

  availableLanguages: LanguageHref[] = []
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.availableLanguages = this.getAvailableLanguageHrefs();
  }

  public menuVisible: boolean = false;

  getAvailableLanguageHrefs(): LanguageHref[] {
    let languageHrefs: LanguageHref[] = [];
    this.getAvailableLocales().forEach(locale => languageHrefs.push(new LanguageHref(this.getLanguage(locale), this.getHref(locale))));
    return languageHrefs;
  }

  getLanguage(locale: string) {
    // @ts-ignore
    let localeLanguages = require(`cldr-localenames-full/main/${locale}/languages.json`).main[locale].localeDisplayNames.languages;
    // @ts-ignore
    for (let localeLanguage in localeLanguages) {
      if (localeLanguage == locale) {
        return localeLanguages[localeLanguage];
      }
    }
    return '';
  }

  getHref(locale: string) {
    return getHref(getRouterLinkSwitchingLocale(locale));
  }

  getAvailableLocales(): string[] {
    let locales: string[] = [];
    // @ts-ignore
    let i18n = require('angular.json').projects["teiler-dashboard"].i18n;
    locales.push(i18n.sourceLocale);
    for (let locale in i18n.locales) {
      locales.push(locale);
    }
    return locales.sort();
  }
}
