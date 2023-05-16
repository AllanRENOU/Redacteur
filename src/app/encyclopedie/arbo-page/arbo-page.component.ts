import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Page } from 'src/app/Services/Beans/Page';
import { PageConteneur } from 'src/app/Services/Beans/PageConteneur';
import { ProjectService } from 'src/app/Services/project.service';
import { MenuItem } from 'src/app/Utils/float-menu/MenuItem';
import { PopupSelectComponent } from 'src/app/Utils/popups/popup-select/popup-select.component';

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
  @Input()
  readonly = false;

  container? : PageConteneur | null ;
  pages : Page[] = [];

  // Menu popup
  public readonly MENU_ITEMS : MenuItem[] = [
    MenuItem.ADD_FILE,
    MenuItem.ADD_FOLDER,
    MenuItem.UP,
    MenuItem.DOWN,
    MenuItem.MOOVE,
    MenuItem.REMOVE
  ];
  public readonly MENU_ITEMS_FICHE : MenuItem[] = [
    MenuItem.UP,
    MenuItem.DOWN,
    MenuItem.MOOVE
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
  @Output()
  up : EventEmitter<PageConteneur> = new EventEmitter<PageConteneur>();
  @Output()
  down : EventEmitter<PageConteneur> = new EventEmitter<PageConteneur>();

  constructor( private projectService : ProjectService, private viewContainerRef: ViewContainerRef){
  }

  ngOnInit() {

    this.projectService.getArboPageAsync( this.idContainer ).subscribe( dossier  => {

      if( dossier ){
        this.container = dossier as PageConteneur;
        this.refreshPages();
      }else{
        console.error( "Dossier d'arbo ",  this.idContainer, " non trouvé");
      }
    });

    this.projectService.getObservableFolder().subscribe( (dd: PageConteneur)=>{this.onFolderUpdateReceved.call( this, dd ); } )
  }
  
  onFolderUpdateReceved( dossier : PageConteneur ){
    if( dossier.id == this.idContainer ){
      this.container = dossier;
      this.refreshPages();
    }
  }

  private refreshPages(){
    if(  this.container ){
      this.projectService.getPagesAsync( this.container.getAllPagesId() ).subscribe( fiches =>{
        if(  this.container ){
          let sortedPages : Page[] = [];
          
          this.container.getAllPagesWithPosition()
            .sort( ( pa, pb )=>{ return pa.position > pb.position ? 1 : -1; } )
            .forEach( ( pp, ii )=>{ 
              let fiche = fiches.filter( ff => ff.id == pp.id )[0];
              if( fiche ){
                sortedPages.push( fiche );
              }
            } );
            this.pages = sortedPages;

            
        }else{
          this.pages = fiches;
        }
      } );
    }
  }

  onClickDeploy( title : string){
    // Doit-on refresh tout le contenu ?

    this.isOpened = !this.isOpened;

    //if( this.container ){
      //if( this.isOpened && this.pages.length == 0 ){
      //  this.pages = this.projectService.getPages( this.container?.pages );
      //}
    //}else{
    //  console.error( "Impossible de charger le contenu de ", this.idContainer );
    //}
  }

  onClickPage( idPage : string){
    this.pageClicked.emit( idPage );
  }

  onClickShowMenu( $event : any ){
    $event.stopPropagation();
    this.showMenu = true;
    this.pageIdToShowMenu = "";
  }

  pageIdToShowMenu = "";
  onClickShowMenuFromFiche( $event : any, idPage : string ){
    $event.stopPropagation();
    this.showMenu = false;
    this.pageIdToShowMenu = idPage;
  }

  onHideMenu(){
    this.showMenu = false;
    this.pageIdToShowMenu = "";
  }

  onClickMenu( item : MenuItem ){
    
    if( this.container ){

      switch( item ) {
        case MenuItem.ADD_FILE :{
              console.log( "Création d'une fiche" );
              this.createPageClicked.emit( this.container );
              //this.focusInputNewItem();
          break;
        }

        case MenuItem.ADD_FOLDER :{
          console.log( "Création d'un dossier" );
          this.focusInputNewItem();
          break;
        }

        case MenuItem.UP :{
          console.log( "Monter" );
          this.up.emit( this.container );

          break;
        }

        case MenuItem.DOWN :{
          console.log( "Descendre" );
          this.down.emit( this.container );

          break;
        }

        case MenuItem.MOOVE :{
          console.log( "Déplacer" );
          this.openPopupMooveDossier()
            
          break;
        }

        case MenuItem.REMOVE :{
          console.log( "Suppression du dossier" );
          if( confirm( "Est tu certain de vouloir supprimer le dossier '" + this.container.titre + "' ?") ){
            this.projectService.removeArbo( this.container );
          }
          break;
        }
      }
      
    }else{
      console.error( "Dossier inconnu");
    }
  
  }

  onClickMenuFiche( item : MenuItem, page : Page ){
    
    if( this.container ){

      switch( item ) {
        
        case MenuItem.UP :{
          console.log( "Monter" );
          this.container.monterFiche( page.id );
          break;
        }

        case MenuItem.DOWN :{
          console.log( "Descendre" );
          this.container.descendreFiche( page.id );
          break;
        }
        
        case MenuItem.MOOVE :{
          this.openPopupMooveFiche( page );
            
          break;
        }

      }
      this.refreshPages();
      this.projectService.updateArbo( this.container );
      
    }else{
      console.error( "Dossier inconnu");
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

  moveChild( subFolder : PageConteneur, isUp : boolean ){

    if( this.container ){
      if( isUp ){
        this.container.monter( subFolder );
      }else{
        this.container.descendre( subFolder );
      }

      this.projectService.updateArbo( this.container );
    }
  }

  // Popup deplacement
  private openPopupMooveFiche( page : Page ){
    this.openPopup().subscribe( ( idDossier )=>{
      
      console.log( "Dossier sélectionnée", idDossier );
      
      if( this.container ){
        this.container.removePage(page.id );

        this.projectService.getArboPageAsync( idDossier ).subscribe( (dossier)=>{
          if( dossier && this.container ){
            dossier.addPage( page.id );
            this.projectService.updateArbo( dossier );
            this.projectService.updateArbo( this.container );

          }else{
            console.error( "L'un des dossier est introuvable. Dossier actuel : ", this.container, ", nouveau dossier : ", dossier );
          }
        } )
      }else{
        console.error( "Aucune dossier sélectionné" );
      }
    } );
  }

  private openPopupMooveDossier(){
    this.openPopup().subscribe( ( idDossier )=>{
      
      console.log( "Dossier sélectionnée", idDossier ); 
      if( this.container ){
        this.projectService.moveArbo( this.container.id, idDossier )
      }else{
        console.error( "Aucune dossier sélectionné" );
      }
    } );
  }

  private openPopup() : EventEmitter<string>{

    let componentRef = this.viewContainerRef.createComponent( PopupSelectComponent );
    
    componentRef.setInput( "comp", componentRef );
    componentRef.setInput( "title", "Sélectionner un dossier" );
    componentRef.setInput( "values", this.projectService.getAllArboPage().map( (dd) => { return {"id":dd.id, "text":dd.titre} } ) );
    
    return componentRef.instance.onValueSelected;
  }

  
}
