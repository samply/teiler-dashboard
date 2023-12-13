import {Directive, Input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Directive({
  selector: '[externalLink]'
})
export class ExternalLinkDirective {

  @Input() externalLink: string = '';

  constructor(private routerLinkWithHref: RouterLink) {
    routerLinkWithHref.onClick = () => {
      if (this.externalLink != null && this.externalLink != undefined && this.externalLink.length > 0) {
        window.open(this.externalLink, '_blank');
        return false;
      }
      return true;
    };
  }

}
