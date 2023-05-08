import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { ProjectService } from '../Services/project.service';
import { AutocompleteInputComponent } from './autoComplete/autocomplete-input/autocomplete-input.component';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  constructor( private projectService : ProjectService ){

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
      let newWord : string = "";
      let page;
      let result = value;
      while( i != -1 ){
        let indexWord = AutocompleteInputComponent.getIndexWord( value, i );
        word = value.substring( i + 1, indexWord.end );
        console.log( "word", word, i, value)
        page = this.projectService.getPage( word );
        newWord = page?.titre || word ;

        result = result.replace( "@" + word, "<span class=\"refPage refPage_" + word + "\" code=\"" + word + "\" texte=\"" + newWord+ "\" ></span>" );
        
        i = value.indexOf( "@", i+1 );

      }

      return result;
  }
}
