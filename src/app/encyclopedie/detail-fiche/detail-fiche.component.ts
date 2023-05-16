import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { Page } from 'src/app/Services/Beans/Page';
import { ProjectService } from 'src/app/Services/project.service';
import { MenuItem } from 'src/app/Utils/float-menu/MenuItem';

@Component({
  selector: 'app-detail-fiche',
  templateUrl: './detail-fiche.component.html',
  styleUrls: ['./detail-fiche.component.scss']
})
export class DetailFicheComponent implements OnChanges {

  @Input()
  id:string = "";
  page? : Page;

  // Créer bloc 
  createPage = false;
  updatePage = false;

  newTitle = "";
  currentDesc = "";
  newDesc="";


  // Boutons 'more'
  idBlocMenu : string = "";// TODO A revoir
  

  MENU_MORE_PAGE = [
    MenuItem.UPDATE,
    MenuItem.REMOVE
  ];

  public constructor( public projectService : ProjectService ){
  }

  ngOnChanges(){
    this.reloadPage();
  }

  reloadPage(){
    if( this.id ){
      this.projectService.getPageAsync( this.id ).subscribe( (page : Page|null) => {
        console.log( "Affichage de la page", page)
        if( page ){
          this.page = page;
          this.resetForms();
          this.updateMore();
        }else{
          console.log( "TODO : Erreur à gérer" );
        }
      });
    }else{
      console.log( "Aucune page à charger" );
    }
  }
  
  // Update page
  onSubmitUpdatePage(){
    console.log( "Page mise à jour. Titre : ", this.newTitle, ". Desc : ", this.newDesc ? this.newDesc : this.currentDesc );
    if( this.page ){
      this.page.titre = this.newTitle;
      this.page.description = this.newDesc ? this.newDesc : this.currentDesc;
      this.projectService.updatePage( this.page );
    }else{
      console.error( "Aucune page n'est sélectionnée" );
    }
    
    this.resetForms();
  }

  onDescChanged( description : string ){
    this.newDesc = description;
    console.log( "newDesc : ", this.newDesc );
  }

  // Création d'un bloc

  private resetForms(){
    this.newTitle = "";
    this.currentDesc = "";

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
      this.projectService.addBlocInPage( this.page, this.newTitle, this.newDesc ?  this.newDesc : "" );
    }else{
      console.log("Erreur, aucune page n'est actuellement affichée" );
    }
    console.log( this.page)
    this.resetForms();
  }

  onClickCancel(){
    this.resetForms();
  }


  // ========== More ==========
 

  onClickMorePage( event : any ){
    this.idBlocMenu = "0";
    event.stopPropagation();
  }

  onHideMenu(){
    this.idBlocMenu = "";
    console.log( "TODO : Revoir fermeture menu more")
  }

  onClickMenuPage( item : MenuItem ){
    
    switch( item ) {

      case MenuItem.UPDATE :{
        this.createPage = false;
        this.updatePage = true;
        this.newTitle = this.page?this.page.titre:"";
        this.currentDesc = this.page?this.page.description:"";
          
        break;
      }
      case MenuItem.REMOVE :{
        alert( "Fonction non implémentée");
          
        break;
      }
      case MenuItem.ADD_FAV :{
        if( this.page ){

          let favoris = this.projectService.getArboPage( ProjectService.ID_FAVORIS_FOLDER );
          if( favoris ){

            this.page.isFavoris = true;
            this.projectService.updatePage( this.page );

            favoris.addPage( this.page.id );
            this.projectService.updateArbo( favoris );
            this.updateMore();
          }else{
            console.log( "Dossier favoris non trouvé" );
          }
        }
        break;
      }
      case MenuItem.REM_FAV :{
        if( this.page ){
          
          let favoris = this.projectService.getArboPage( ProjectService.ID_FAVORIS_FOLDER );
          if( favoris ){
            this.page.isFavoris = false;
            this.projectService.updatePage( this.page );

            favoris.removePage( this.page.id );
            this.projectService.updateArbo( favoris );
            
            this.updateMore();
          }else{
            console.log( "Dossier favoris non trouvé" );
          }
        }
        break;
      }
    }
  }

  updateMore(){

    if( this.MENU_MORE_PAGE.length == 3 ){
      this.MENU_MORE_PAGE.pop();
    }

    if( this.page ){
      if( this.page.isFavoris ){
        this.MENU_MORE_PAGE.push( MenuItem.REM_FAV );
      }else{
        this.MENU_MORE_PAGE.push( MenuItem.ADD_FAV );
      }
    }
  }
}
