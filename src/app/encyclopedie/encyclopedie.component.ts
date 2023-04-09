import { Component } from '@angular/core';
import { ProjectService } from '../Services/project.service';
import { PageConteneur } from '../Services/Beans/PageConteneur';
import { Page } from '../Services/Beans/Page';

@Component({
  selector: 'app-encyclopedie',
  templateUrl: './encyclopedie.component.html',
  styleUrls: ['./encyclopedie.component.scss']
})

export class EncyclopedieComponent {

  public static ROOT_PAGE_CONTAINER_ID = "root";

  // Consultation d'une fiche
  currentIdPage : string = "p01";

  // Creation d'une fiche
  createFiche = false;
  parentFolder? : PageConteneur;

  constructor( public projectService : ProjectService){
    
  }
  
  openPage( idPage : string){
    console.log( "ouverture de la page ", idPage );
    this.createFiche = false;
    this.currentIdPage = idPage;

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

