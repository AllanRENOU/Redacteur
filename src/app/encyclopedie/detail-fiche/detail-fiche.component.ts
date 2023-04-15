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

  newTitle = "";
  newDesc = "";

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


  public constructor( private projectService : ProjectService ){
    
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
          this.page = page;
          this.resetForms();
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

  // More
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
          this.newTitle = bloc.texte;
          this.newDesc = bloc.texte;

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
}
