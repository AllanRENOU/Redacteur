import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { AutocompleteInputComponent } from './autoComplete/autocomplete-input/autocomplete-input.component';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  constructor( ){

  }

  transform(value: string, ...args: any[]): string {
    if ( value ) {
      value = marked(value );
      value = this.replaceRefPage( value );

      if( value.endsWith("\n") ){
        value = value.substring( 0, value.length -1 );
      }

      return value.replaceAll( "\n", "<br/>" );
    }else{
      return value;
    }
  }

  /**
   * Remplace une référence à une page par un lien + affichage du nom
   * @param value 
   * @returns 
   */
  private replaceRefPage( value: string ){

      let i = value.indexOf( "@" );
      let word : string = "";
      let result = value;
      while( i != -1 ){
        let indexWord = AutocompleteInputComponent.getIndexWord( value, i );
        word = value.substring( i + 1, indexWord.end );

        result = result.replace( "@" + word, "<span class=\"refPage refPage_" + word + "\" code=\"" + word + "\"></span>" );
        
        i = value.indexOf( "@", i+1 );

      }

      return result;
  }
}
