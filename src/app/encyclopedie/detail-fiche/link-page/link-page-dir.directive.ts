import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appLinkPageDir]'
})
export class LinkPageDirDirective {

  @Input()
  texte = "";

  @Input()
  description = "";

  constructor(  ) { }

}
