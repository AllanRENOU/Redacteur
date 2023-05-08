import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ProjectService } from 'src/app/Services/project.service';

@Component({
  selector: 'app-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss']
})
export class AutocompleteInputComponent implements OnInit {


  @Input()
  texte = "";
  
  @Output() 
  textChanged = new EventEmitter<string>();

  @ViewChild('textArea')
  currentTextArea? : ElementRef<HTMLTextAreaElement>;

  @ViewChild('popupAutoComplet')
  popupAutoComplet? : ElementRef<HTMLElement>;

  currentWord = "";
  showAutoComplet = false;

  static LETTRES_END_WORD = [ "\n", " ", ".", ",", "?", "!", "<" ];
  
  constructor( public projectService : ProjectService,private renderer: Renderer2 ){
    
  }

  ngOnInit(): void {
    
    setTimeout( ()=>{
      if( this.currentTextArea ){
        this.currentTextArea.nativeElement.style.height = this.calcHeight(this.texte) + "rem";
      }
    }, 10)
    
    this.textChanged.emit( this.texte );
  }


  onTextChange( ee : Event ){

    if( this.currentTextArea ){

      // Hauteur du textarea
      this.renderer.setStyle( this.currentTextArea.nativeElement, "height", this.calcHeight( this.texte ) + "rem" );

      // Position et contenu de l'autocompletion
      this.manageAutoComplete( this.currentTextArea.nativeElement );
      
      this.textChanged.emit( this.texte );
    }else{
      console.error( "Textarea not linked" );
    }
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

  manageAutoComplete( textarea : HTMLTextAreaElement ){

    // ===== Recherche du mot actuel =====
    let indexWord = AutocompleteInputComponent.getIndexWord( textarea.value, textarea.selectionStart );

    let mot = textarea.value.substring( indexWord.start, indexWord.end );
    console.log( "mot : ", mot)
    // ===== Positionnement de la popup  =====

    const OFFSET_TEXT_TOP = 3.5;
    const OFFSET_TEXT_LEFT = 1;
    const LETTER_WIDTH = 0.46;
    const LETTER_HEIGHT = 1.2;

    if( mot[0] == "@" ){
      this.showAutoComplet = true;
      
      if( this.popupAutoComplet ){
        this.currentWord = mot.substring( 1 );
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
      }else{
        console.warn( "popup non visible" );
      }
      
    }else{
      this.showAutoComplet = false;
      this.currentWord = mot;
    }
  }

  onClickAutoCompletion( ee : MouseEvent, selectedWord : string ){
    
    if( this.currentTextArea ){
      this.showAutoComplet = false;
      this.currentWord = "";

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
