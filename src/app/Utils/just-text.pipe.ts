import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  name: 'justText'
})
export class JustTextPipe implements PipeTransform {

  constructor( ){

  }

  transform(value: string ): string {
    value = marked( value ) || "";

    let element = document.createElement( "a" );
    element.innerHTML = value;

    return element.innerText;
  }

}
