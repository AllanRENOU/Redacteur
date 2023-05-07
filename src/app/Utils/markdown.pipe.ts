import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { ProjectService } from '../Services/project.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
      while( i != -1 ){
        let iEnd = this.getIndexEndWord( value, i );
        word = value.substring( i + 1, iEnd );
        page = this.projectService.getPage( word );
        newWord = page?.titre || word ;

        value = value.replaceAll( "@" + word, "<span class=\"refPage refPage_" + word + "\" code=\"" + word + "\" texte=\"" + newWord+ "\" description=\"" + page?.description + "\" ></span>" );
        
        i = value.indexOf( "@", i+1 );

      }

      return value;
  }

  private getIndexEndWord( texte : string, indexStart : number ){

    let indexEnd = indexStart;
    while( indexEnd < texte.length && texte[ indexEnd ] != " " && texte[ indexEnd ] != "\n" ){
      indexEnd++;
    }

    return indexEnd;
  }

}
