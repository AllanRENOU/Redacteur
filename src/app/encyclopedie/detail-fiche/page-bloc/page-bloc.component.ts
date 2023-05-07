import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, EnvironmentInjector, Injector, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewContainerRef, createComponent } from '@angular/core';
import { Page } from 'src/app/Services/Beans/Page';
import { PageBloc } from 'src/app/Services/Beans/Page.bloc';
import { ProjectService } from 'src/app/Services/project.service';
import { MenuItem } from 'src/app/Utils/float-menu/MenuItem';
import { MarkdownPipe } from 'src/app/Utils/markdown.pipe';
import { LinkPageComponent } from '../link-page/link-page.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-page-bloc',
  templateUrl: './page-bloc.component.html',
  styleUrls: ['./page-bloc.component.scss']
})
export class PageBlocComponent implements OnInit, AfterViewInit {
 
  @Input()
  bloc? : PageBloc;
  @Input()
  page? : Page;

  // Menu "more"
  showMoreMenu : boolean = false;
  isUpdatemode : boolean = false;

  MENU_MORE_BLOC = [
    MenuItem.UPDATE,
    MenuItem.UP,
    MenuItem.DOWN,
    MenuItem.REMOVE
  ];
  INFOS_MARKDOWN = [
    "**gras**",
    "_italique_",
    "~~barré~~",
    "# titre",
    "## sous titre",
    "> Citation",
    "Un [lien](http://example.com).",
    "Texte en [color=#26B260]rouge[/color]",
    "* liste"
    //"[ ] Case non cochée",
    //"[x] Case cochée",
  ];

  // Update
  newTitle = "";
  newDesc = "";
  showPopupInfoMarkdown = false;

  // Autocompletion
  currentWord = "";
  showAutoComplet = false;
   
  constructor( public projectService : ProjectService, private renderer: Renderer2, private pipeMarkdown : MarkdownPipe, private viewContainerRef: ViewContainerRef ){

  }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    
    this.updateText();

  }

  // ===== Formulaire update =====
  
  onSubmitUpdateBloc( bloc : PageBloc ){
    bloc.title = this.newTitle;
    bloc.texte = this.newDesc;

    if( this.page ){
      this.projectService.updatePage( this.page );
    }

    this.resetForms();
  }

  onClickCancel(){
    this.resetForms();
  }

  private resetForms(){
    this.isUpdatemode = false;
  }

  @ViewChild('textContainer')
  textContainer? : ElementRef<HTMLElement>;
  
  @ViewChild('componentLoader')
  componentLoader? : ElementRef<HTMLElement>;

  updateText(){

    if( this.bloc && this.textContainer ){
      this.textContainer.nativeElement.innerHTML = this.pipeMarkdown.transform( this.bloc.texte );

      let links : HTMLCollectionOf<Element> = this.textContainer.nativeElement.getElementsByClassName( "refPage");
      
      for( let i = 0; i< links.length; i++ ){
        let link : Element | undefined = links.item( i ) || undefined;
        
        if( link ){

          let cc = link.getAttribute( "code" ) || "";
          let tt = link.getAttribute( "texte" ) || "";
          let dd = link.getAttribute( "description" ) || "";

          this.instanciateLink( cc, tt, dd, link );
          
        }
      }
    }
  }
  
  private instanciateLink( code : string, texte : string, desc : string, parent : Element){

    let componentRef = this.viewContainerRef.createComponent( LinkPageComponent );
    componentRef.setInput( "code", code );
    componentRef.setInput( "texte", texte );
    componentRef.setInput( "description", desc );
    parent.appendChild( componentRef.location.nativeElement );

  }
  
  // ===== More =====
  
  onClickMore( bloc : PageBloc, event : any ){
    this.showMoreMenu = true;
    event.stopPropagation();
  }

  onClickMenu( item : MenuItem, bloc : PageBloc ){
    
    if( this.page ){
      switch( item ) {

        case MenuItem.UPDATE :{
          this.isUpdatemode = true;
          this.newTitle = bloc.title;
          this.newDesc = bloc.texte;

          setTimeout( ()=>{
            let textarea = document.getElementById( "desc_" + bloc.id ) as HTMLTextAreaElement;
            textarea.style.height = this.calcHeight(textarea.value) + "rem";
          }, 10 );
          
          break;
        }
        case MenuItem.UP :{
          this.page.monterBloc( bloc );
          this.projectService.updatePage( this.page );
            
          break;
        }
        case MenuItem.DOWN :{
          this.page.descendreBloc( bloc );
          this.projectService.updatePage( this.page );
            
          break;
        }
        case MenuItem.REMOVE :{
          this.page.supprimerBloc( bloc );
          this.projectService.updatePage( this.page );
            
          break;
        }
      }
    }
  }

  onHideMenu(){
    this.showMoreMenu = false;
  }
  
  calcHeight( value : string ) {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    let newHeight =  numberOfLineBreaks * 1 + 3;
    return newHeight;
  }


  // ========== Infos Markdown ==========

  onClickinfoMarkdown( ee : Event ){

    if( ee.target != null ){
      if( ee.target instanceof Element ){
        this.openPopupInfoMarkdown( ee.target );
      }else{
        console.error( "Aucun element parent" );
      }  
    }else{
      console.error( "Impossible de récupérer le bouton");
    }
  }

  openPopupInfoMarkdown( elementParent : Element ){
    this.showPopupInfoMarkdown = true;
  }
  
  closePopupInfoMarkdown( ){
    this.showPopupInfoMarkdown = false;
  }
  
  // ========== Autocompletion ==========

  @ViewChild('textArea')
  currentTextArea? : ElementRef<HTMLTextAreaElement>;

  onTextChange( ee : Event ){

    if( this.currentTextArea ){

      // Hauteur du textarea
      this.renderer.setStyle( this.currentTextArea.nativeElement, "height", this.calcHeight( this.newDesc ) + "rem" );

      // Position et contenu de l'autocompletion
      this.manageAutoComplete( this.currentTextArea.nativeElement );
      
    }else{
      console.error( "Textarea not linked" );
    }
  }

  static LETTRES_END_WORD = [ "\n", " ", ".", ",", "?", "!" ];

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
    while( lettre && PageBlocComponent.LETTRES_END_WORD.indexOf(lettre) == -1 ){
      lastIndex++;
      lettre = text[ lastIndex ];
    }

    // Recherche du début du mot
    lettre = text[ startIndex ];
    while( startIndex > -1 && PageBlocComponent.LETTRES_END_WORD.indexOf(lettre) == -1 ){
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
    let indexWord = PageBlocComponent.getIndexWord( textarea.value, textarea.selectionStart );

    let mot = textarea.value.substring( indexWord.start, indexWord.end );

    // ===== Positionnement de la popup  =====

    const OFFSET_TEXT_TOP = 3.5;
    const OFFSET_TEXT_LEFT = 1;
    const LETTER_WIDTH = 0.46;
    const LETTER_HEIGHT = 1.2;

    if( mot[0] == "@" ){
      this.showAutoComplet = true;
      let popupAutoComplet : HTMLElement = document.getElementsByClassName( "popupAutoComplet" )[0] as HTMLElement;
      
      if( popupAutoComplet ){
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

        popupAutoComplet.style.top = (lineNum * LETTER_HEIGHT + OFFSET_TEXT_TOP ) + "rem";
        popupAutoComplet.style.left = (charNum * LETTER_WIDTH + OFFSET_TEXT_LEFT ) + "rem";
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

      
      let indexWord = PageBlocComponent.getIndexWord( this.currentTextArea.nativeElement.value, this.currentTextArea.nativeElement.selectionStart );
      indexWord.start++;
      this.newDesc = this.newDesc.substring( 0, indexWord.start ) + selectedWord + this.newDesc.substring( indexWord.end );
      
    }

  }

  onFocusTextAreaLost(){
    //this.showAutoComplet = false;
    //this.currentWord = "";
  }

}
