import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Page } from 'src/app/Services/Beans/Page';
import { PageBloc } from 'src/app/Services/Beans/Page.bloc';
import { ProjectService } from 'src/app/Services/project.service';
import { MenuItem } from 'src/app/Utils/float-menu/MenuItem';

@Component({
  selector: 'app-detail-fiche',
  templateUrl: './detail-fiche.component.html',
  styleUrls: ['./detail-fiche.component.scss']
})
export class DetailFicheComponent implements OnInit {

  @Input()
  id:string = "";
  page? : Page;

  // Créer bloc 
  createPage = false;
  updatePage = false;
  updateBloc : string = "";
  showPopupInfoMarkdown = false;

  newTitle = "";
  newDesc = "";

  currentWord = "";// Pour autocompetion
  showAutoComplet = false;

  // Boutons 'more'
  idBlocMenu : string = "";
  MENU_MORE_BLOC = [
    MenuItem.UPDATE,
    MenuItem.UP,
    MenuItem.DOWN,
    MenuItem.REMOVE
  ];

  MENU_MORE_PAGE = [
    MenuItem.UPDATE,
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


  public constructor( public projectService : ProjectService ){
    
  }

  ngOnInit(): void {
    this.reloadPage();
  }

  ngOnChanges( change : SimpleChange){
    this.reloadPage();
  }

  reloadPage(){
    if( this.id ){
      this.projectService.getPageAsync( this.id ).subscribe( (page : Page|null) => {
        if( page ){
          console.log( "page chargée : ", page )
          this.page = page;
          this.resetForms();
         this.loadLinkedPages();
        }else{
          console.log( "TODO : Erreur à gérer" )
        }
      });
    }else{
      console.log( "Aucune page à charger" );
    }
  }
  
  // Update page
  onSubmitUpdatePage(){
    console.log( "Page mise à jour. Titre : ", this.newTitle, ". Desc : ", this.newDesc );
    if( this.page ){
      this.page.titre = this.newTitle;
      this.page.description = this.newDesc;
      this.projectService.updatePage( this.page );
    }else{
      console.error( "Aucune page n'est sélectionnée" );
    }
    
    this.resetForms();
  }

  // Création d'un bloc

  private resetForms(){
    this.newTitle = "";
    this.newDesc = "";

    this.updateBloc = "";
    this.createPage = false;
    this.updatePage = false;

    // Autocompletion
    this.showAutoComplet = false;
    this.currentWord = "";
  }

  onClickCreateBloc(){
    this.createPage = true;
    this.updatePage = false;
  }

  onSubmitNewBloc(){
    console.log( "Click créer bloc ", this.newTitle, " : ", this.newDesc );

    if( this.page ){
      this.projectService.addBlocInPage( this.page, this.newTitle, this.newDesc );
    }else{
      console.log("Erreur, aucune page n'est actuellement affichée" );
    }
    console.log( this.page)
    this.resetForms();
  }

  onClickCancel(){
    this.resetForms();
  }

  onSubmitUpdateBloc( bloc : PageBloc ){
    bloc.title = this.newTitle;
    bloc.texte = this.newDesc;

    if( this.page ){
      this.projectService.updatePage( this.page );
    }

    this.resetForms();
  }

  // ========== More ==========
  onClickMore( bloc : PageBloc, event : any ){
    console.log( "Clic more bloc '",bloc.title, "' (", bloc.id, ").", this.page );

    this.idBlocMenu = bloc.id;
    event.stopPropagation();
  }

  onClickMorePage( event : any ){
    this.idBlocMenu = "0";
    event.stopPropagation();
  }

  onHideMenu(){
    this.idBlocMenu = "";
  }

  
  onClickMenu( item : MenuItem, bloc : PageBloc ){
    
    if( this.page ){
      switch( item ) {

        case MenuItem.UPDATE :{
          this.updateBloc = bloc.id;
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
          console.log( "blopagec", this.page )
          this.page.supprimerBloc( bloc );
          this.projectService.updatePage( this.page );
            
          break;
        }
      }
    }
  }

  onClickMenuPage( item : MenuItem ){
    
    switch( item ) {

      case MenuItem.UPDATE :{
        this.createPage = false;
        this.updatePage = true;
        this.newTitle = this.page?this.page.titre:"";
        this.newDesc = this.page?this.page.description:"";
          
        break;
      }
      case MenuItem.REMOVE :{
        alert( "Fonction non implémentée");
          
        break;
      }
    }
  }

  // ========== Infos Markdown ==========

  onClickinfoMarkdown( ee : Event ){

    if( ee.target != null ){
      if( ee.target instanceof Element ){
        
        console.log( ee );
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

  currentTextArea? : HTMLTextAreaElement;

  onTextChange( ee : Event ){
    if( ee.target ){

      // Hauteur du textarea
      this.currentTextArea = ee.target as HTMLTextAreaElement;
      this.currentTextArea.style.height = this.calcHeight( this.currentTextArea.value ) + "rem";

      // Position et contenu de l'autocompletion
      this.manageAutoComplete( this.currentTextArea );
      
    }
  }

  calcHeight( value : string ) {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    let newHeight =  numberOfLineBreaks * 1 + 3;
    return newHeight;
  }

  /**
   * Retourne l'indexe de début et de fin du mot où le trouve le curceur actuellement 
   * @param text 
   * @param cursor 
   * @returns 
   */
  private getIndexWord( text : string, cursor : number ) : { start : number, end : number } {
    
    let lastIndex = cursor;
    let startIndex = lastIndex - 1;

    // Recherche de la fin du mot
    let lettre = text[ lastIndex ];
    while( lettre && lettre != " " && lettre != "\n" ){
      lastIndex++;
      lettre = text[ lastIndex ];
    }

    // Recherche du début du mot
    lettre = text[ startIndex ];
    while( startIndex > -1 && lettre != " " && lettre != "\n" ){
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
    let indexWord = this.getIndexWord( textarea.value, textarea.selectionStart );

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

      
      let indexWord = this.getIndexWord( this.currentTextArea.value, this.currentTextArea.selectionStart );
      indexWord.start++;
      this.newDesc = this.newDesc.substring( 0, indexWord.start ) + selectedWord + this.newDesc.substring( indexWord.end );
      
    }

  }

  onFocusTextAreaLost(){
    //this.showAutoComplet = false;
    //this.currentWord = "";
  }

  loadLinkedPages(){

    if( this.page ){
      let i = -1;
      let pagesToLoad : string[] = [];
      let indexMot;
      let mot = "";

      // Liste des pages listées dans chaque blocs
      for( let bloc of this.page?.blocs ){
        i = bloc.texte.indexOf( "@" );
        while( i != -1 ){
          indexMot = this.getIndexWord( bloc.texte, i );
          mot = bloc.texte.substring( indexMot.start + 1, indexMot.end );

          if( pagesToLoad.indexOf( mot ) == -1 ){
            pagesToLoad.push( mot );
          }
          
          i = bloc.texte.indexOf( "@", i+1 );
        }
      }

      // Requete pour chaque mot à charger
      for( let idPage of pagesToLoad ){
        this.projectService.getPageAsync( idPage ).subscribe( (page : Page | null )=>{
          if( page ){
            let elements = document.querySelectorAll( ".refPage_" + page.id + " .pageInfoPopup" );
            elements.forEach( (element :Element ) => {
              element.innerHTML = page.description;
            })
          }
        } );
      }
    }else{
      console.error("Aucune page sélectionnée");
    }
  }

}
