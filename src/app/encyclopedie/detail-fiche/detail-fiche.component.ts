import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Page } from 'src/app/Services/Beans/Page';
import { PageBloc } from 'src/app/Services/Beans/Page.bloc';
import { ProjectService } from 'src/app/Services/project.service';
import { MenuItem } from 'src/app/Utils/float-menu/MenuItem';
import { PageBlocComponent } from './page-bloc/page-bloc.component';

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

  newTitle = "";
  newDesc = "";


  // Boutons 'more'
  idBlocMenu : string = "";// TODO A revoir
  

  MENU_MORE_PAGE = [
    MenuItem.UPDATE,
    MenuItem.REMOVE
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
