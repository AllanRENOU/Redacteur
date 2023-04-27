import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor( private sanitzer : DomSanitizer ){

  }

  transform(value: string): SafeHtml {
    return this.sanitzer.bypassSecurityTrustHtml( value );
  }

}
