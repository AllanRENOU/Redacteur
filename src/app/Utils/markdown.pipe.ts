import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  transform(value: any, ...args: any[]): unknown {
    if ( value ) {
      return marked(value);
    }
    return value;
  }

}
