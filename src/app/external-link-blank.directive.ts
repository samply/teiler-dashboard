import {Directive, Input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Directive({
  selector: '[externalLinkBlank]'
})
export class ExternalLinkBlankDirective {

  @Input('externalLinkBlank') externalLink: string = '';

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
