import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Page } from 'src/app/Services/Beans/Page';
import { PageConteneur } from 'src/app/Services/Beans/PageConteneur';
import { ProjectService } from 'src/app/Services/project.service';
import { MenuItem } from 'src/app/Utils/float-menu/MenuItem';

@Component({
  selector: 'app-arbo-page',
  templateUrl: './arbo-page.component.html',
  styleUrls: ['./arbo-page.component.scss']
})
export class ArboPageComponent implements OnInit{

  @Input()
  isOpened? : boolean = false;
  @Input()
  idContainer : string = "";

  container? : PageConteneur | null ;
  pages : Page[] = [];

  // Menu popup
  public readonly MENU_ITEMS : MenuItem[] = [
    MenuItem.ADD_FILE,
    MenuItem.ADD_FOLDER,
    MenuItem.UP,
    MenuItem.DOWN,
    MenuItem.REMOVE
  ];
  showMenu : boolean = false;

  // Create item
  showCreateInput : boolean = false;
  @ViewChild('inputNameNewItem') 
  inputNameNewItem? : ElementRef;
  nameNewItem : string = "";

  @Output()
  pageClicked : EventEmitter<string> = new EventEmitter<string>();
  @Output()
  createPageClicked : EventEmitter<PageConteneur> = new EventEmitter<PageConteneur>();

  constructor( private projectService : ProjectService){
    
  }

  ngOnInit() {

    this.container = this.projectService.getArboPage( this.idContainer );
    if( this.isOpened ){
      if( this.container ){
        this.pages = this.projectService.getPages( this.container?.pages );
      }else{
        console.error( "Dossier d'arbo ",  this.idContainer, " non trouvé");
      }
    }
  }

  onClickDeploy( title : string){
    console.log( "click ", title )

    this.isOpened = !this.isOpened;

    if( this.container ){
      if( this.isOpened && this.pages.length == 0 ){
        this.pages = this.projectService.getPages( this.container?.pages );
      }
    }else{
      console.error( "Impossible de charger le contenu de ", this.idContainer );
    }
  }

  onClickPage( idPage : string){
    this.pageClicked.emit( idPage );
  }

  onClickShowMenu( $event : any ){
    $event.stopPropagation();
    this.showMenu = true;
    console.log( this.showMenu );
  }

  onHideMenu(){
    this.showMenu = false;
    console.log( this.showMenu );
  }

  onClickMenu( item : MenuItem ){
    
    switch( item ) {

      case MenuItem.ADD_FILE :{
          if( this.container ){
            console.log( "Création d'une fiche" );
            this.createPageClicked.emit( this.container );
            //this.focusInputNewItem();
          }else{
            console.log( "Impossible de créer une page. Parent inconnu");
          }
          
        break;
      }

      case MenuItem.ADD_FOLDER :{
        console.log( "Création d'un dossier" );
        this.focusInputNewItem();
        break;
      }

      case MenuItem.REMOVE :{
        console.log( "Suppression du dossier" );
        break;
      }
    }
  }

  onClickPageCreated( folder : PageConteneur ){
    this.createPageClicked.emit( folder );
  }

  private focusInputNewItem(){
    this.isOpened = true;
    this.showCreateInput = true;
    setTimeout( () => {
      this.inputNameNewItem?.nativeElement.focus();
    }, 100 );
    
  }

  onSubmit( ){
    if( this.container ){
      this.projectService.addFolderArboPage( this.container, this.nameNewItem );
      this.nameNewItem = "";
      this.showCreateInput = false;
    }else{
      console.log( "Dossier inconnue" )
    }
  }
}
