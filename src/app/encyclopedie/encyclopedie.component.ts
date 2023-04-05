import { Component } from '@angular/core';
import { ProjectService } from '../Services/project.service';
import { PageConteneur } from '../Services/Beans/PageConteneur';

@Component({
  selector: 'app-encyclopedie',
  templateUrl: './encyclopedie.component.html',
  styleUrls: ['./encyclopedie.component.scss']
})

export class EncyclopedieComponent {

  public static ROOT_PAGE_CONTAINER_ID = "root";

  constructor( public projectService : ProjectService){
    
  }
  
  openPage( idPage : string){
    console.log( "ouverture de la page ", idPage );
  }

  onPageClicked( idPage : string){
    this.openPage( idPage );
  }

}

