import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ProjectService } from 'src/app/Services/project.service';
import { AutocompletionPipe } from '../../autocompletion.pipe';
import { Page } from 'src/app/Services/Beans/Page';

@Component({
  selector: 'app-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss']
})
export class AutocompleteInputComponent implements AfterViewInit  {


  @Input()
  texte = "";
  
  @Output() 
  textChanged = new EventEmitter<string>();

  @ViewChild('textArea')
  currentTextArea? : ElementRef<HTMLTextAreaElement>;

  @ViewChild('popupAutoComplet')
  popupAutoComplet? : ElementRef<HTMLElement>;

  showAutoComplet = false;

  static LETTRES_END_WORD = [ "\n", " ", ".", ",", "?", "!", "<" ];
  static LETTRES_END_WORD_REGEXP = /\n| |\.|,|\?|!|</g;
  
  constructor( public projectService : ProjectService, private autocompletionPipe : AutocompletionPipe ){
    
  }

  ngAfterViewInit(): void {
    if( this.currentTextArea ){
      this.refreshHeight( this.currentTextArea.nativeElement );
      this.textChanged.emit( this.texte );
    }
  }


  onTextChange( ee : KeyboardEvent ){
    
    if( this.currentTextArea ){

      // Hauteur du textarea
      this.refreshHeight( this.currentTextArea.nativeElement );

      // Position et contenu de l'autocompletion
      this.manageAutoComplete( this.currentTextArea.nativeElement, ee );
      
      this.textChanged.emit( this.texte );
    }else{
      console.error( "Textarea not linked" );
    }
    
  }

  private refreshHeight( element : HTMLElement ){

    element.style.height = "auto";
    setTimeout( ()=>{
      element.style.height = element.scrollHeight + "px";
    }, 50);
  }
  
  calcHeight( value : string ) {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    let newHeight =  numberOfLineBreaks * 1 + 2;
    return newHeight;
  }


  /**
   * Retourne l'indexe de début et de fin du mot où le trouve le curceur actuellement 
   * @param text 
   * @param cursor 
   * @returns 
   */
  static getIndexWord( text : string, cursor : number ) : { start : number, end : number } {
    
    let lastIndex = cursor;
    let startIndex = lastIndex - 1;
    
    // Recherche de la fin du mot
    let lettre = text[ lastIndex ];
    while( lettre && AutocompleteInputComponent.LETTRES_END_WORD.indexOf(lettre) == -1 ){
      lastIndex++;
      lettre = text[ lastIndex ];
    }

    // Recherche du début du mot
    lettre = text[ startIndex ];
    while( startIndex > -1 && AutocompleteInputComponent.LETTRES_END_WORD.indexOf(lettre) == -1 ){
      startIndex--;
      lettre = text[ startIndex ];
    }

    startIndex++;

    return {
      start : startIndex,
      end : lastIndex
    };
    
  }

  manageAutoComplete( textarea : HTMLTextAreaElement, ee : KeyboardEvent ){

    // ===== Recherche du mot actuel =====
    let indexWord = AutocompleteInputComponent.getIndexWord( textarea.value, textarea.selectionStart );

    let mot = textarea.value.substring( indexWord.start, indexWord.end );
    console.log( "mot : ", mot);
    // ===== Positionnement de la popup  =====

    const OFFSET_TEXT_TOP = 3.5;
    const OFFSET_TEXT_LEFT = 1;
    const LETTER_WIDTH = 0.46;
    const LETTER_HEIGHT = 1.2;

    if( mot[0] == "@" ){
      this.showAutoComplet = true;
      
      if( this.popupAutoComplet ){
        
        mot = mot.substring( 1 );
        this.listAutoComplete = this.autocompletionPipe.transform( this.projectService.getAllPages() , mot ).map( (page : Page, index : number ) =>{
          return { texte : page.titre, id : page.id, index : index }
        } );

        // Recherche du numéro de ligne et de caractère
        let lines = textarea.value.split( "\n" );
        let charNum : number = textarea.selectionStart;
        let lineNum = 0;
        while( charNum > lines[ lineNum ].length ){
          charNum = charNum - lines[ lineNum ].length - 1;
          lineNum++;
        }
        lineNum++;

        this.popupAutoComplet.nativeElement.style.top = (lineNum * LETTER_HEIGHT + OFFSET_TEXT_TOP ) + "rem";
        this.popupAutoComplet.nativeElement.style.left = (charNum * LETTER_WIDTH + OFFSET_TEXT_LEFT ) + "rem";

        this.manageArrowInput( ee, mot ); 
      }else{
        console.warn( "popup non visible" );
      }
      
    }else{
      this.showAutoComplet = false;
      this.indexAutoComplete = 0;
    }
  }

  protected indexAutoComplete : number = 0;
  protected listAutoComplete : { texte : string, id : string, index : number }[] = [];
  private manageArrowInput( ee : KeyboardEvent, mot : string ){

    const ARROW_UP = "ArrowUp";
    const ARROW_DOWN = "ArrowDown";
    const ENTER = "Enter";
    
    if( ee.key == ARROW_DOWN || ee.key == ARROW_UP || ee.key == ENTER ){
      ee.preventDefault();

      if( ee.key == ARROW_DOWN ){
        this.indexAutoComplete = ( this.indexAutoComplete + 1 ) % this.listAutoComplete.length;
      }else if( ee.key == ARROW_UP ){
        this.indexAutoComplete = this.indexAutoComplete == 0 ? this.listAutoComplete.length - 1 : this.indexAutoComplete - 1;
      }else if( ee.key == ENTER ){
        this.onClickAutoCompletion( this.listAutoComplete.filter( ll => ll.index == this.indexAutoComplete )[0].id );
      }

    }
  }

  onClickAutoCompletion( selectedWord : string ){
    
    if( this.currentTextArea ){
      this.showAutoComplet = false;
      this.indexAutoComplete = 0;

      let indexWord = AutocompleteInputComponent.getIndexWord( this.texte, this.currentTextArea.nativeElement.selectionStart );
      indexWord.start++;
      this.texte = this.texte.substring( 0, indexWord.start ) + selectedWord + this.texte.substring( indexWord.end );
      this.textChanged.emit( this.texte );
    }

  }

  onFocusTextAreaLost(){
    //this.showAutoComplet = false;
    //this.currentWord = "";
  }
}
