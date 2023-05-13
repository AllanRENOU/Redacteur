import { Component, ViewChild } from '@angular/core';
import { ProjectService } from '../Services/project.service';
import { PageConteneur } from '../Services/Beans/PageConteneur';
import { Page } from '../Services/Beans/Page';
import { ActivationEnd, Router } from '@angular/router';
import { URL_PARAM_ID_FICHE } from '../app-routing.module';
import { Location } from '@angular/common';

@Component({
  selector: 'app-encyclopedie',
  templateUrl: './encyclopedie.component.html',
  styleUrls: ['./encyclopedie.component.scss']
})

export class EncyclopedieComponent {

  public static ROOT_PAGE_CONTAINER_ID = "root";

  // Consultation d'une fiche
  currentIdPage : string = "";

  // Creation d'une fiche
  createFiche = false;
  parentFolder? : PageConteneur;

  constructor( public projectService : ProjectService, private router: Router, private _location: Location){
    
    this.router.events.subscribe((aa : any) => {
      if( aa instanceof ActivationEnd){
        let actEnd : ActivationEnd = aa;
        this.openPage( actEnd.snapshot.params[ URL_PARAM_ID_FICHE ] );
      }
    });

  }
  
  openPage( idPage : string){
    if( idPage ){
      console.log( "ouverture de la page ", idPage );
      this.createFiche = false;
      this.currentIdPage = idPage;
      this._location.go( "/" + this.projectService.dataProject.code + "/encyclopedie/" + idPage );
    }else{
      this._location.go( "/" + this.projectService.dataProject.code + "/encyclopedie/" );
    }
    

  }

  createPage( folder : PageConteneur ){
    console.log( "Creation d'une page dans le dossier ", folder.titre );
    this.createFiche = true;
    this.parentFolder = folder;
  }

  onPageClicked( idPage : string){
    this.openPage( idPage );
  }

  onNewPageClicked( folder : PageConteneur ){
    this.createPage( folder );
  }

  onNewPageCreated( newPage : Page){
    this.openPage( newPage.id );
  }

}

