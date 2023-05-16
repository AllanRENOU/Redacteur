import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
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
export class PageBlocComponent implements OnInit {
 
  @Input()
  bloc? : PageBloc;
  @Input()
  page? : Page;
  
  @Output()
  clickLink : EventEmitter<string> = new EventEmitter();

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
   
  constructor( public projectService : ProjectService, private renderer: Renderer2 ){

  }

  ngOnInit(): void {

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
  
  // ========== Ouvrir page ==========
  onClickLink( idPage : string ){
    this.clickLink.emit( idPage );
  }
}
