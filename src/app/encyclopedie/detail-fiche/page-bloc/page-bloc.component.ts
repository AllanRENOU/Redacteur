import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Page } from 'src/app/Services/Beans/Page';
import { PageBloc } from 'src/app/Services/Beans/Page.bloc';
import { ProjectService } from 'src/app/Services/project.service';
import { MenuItem } from 'src/app/Utils/float-menu/MenuItem';
import { MarkdownPipe } from 'src/app/Utils/markdown.pipe';
import { LinkPageComponent } from '../link-page/link-page.component';

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
  currentDesc = "";
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
      console.log( "texte au debut : ", this.bloc.texte)
      this.textContainer.nativeElement.innerHTML = this.pipeMarkdown.transform( this.bloc.texte );
      console.log( "texte apres transformation : ", this.textContainer.nativeElement.innerHTML )

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
  onDescChanged( description : string ){
    this.newDesc = description;
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
          this.currentDesc = bloc.texte;

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
}
