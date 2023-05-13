import { Component, EventEmitter, Input, OnInit, Output, Pipe } from '@angular/core';
import { Page } from 'src/app/Services/Beans/Page';
import { PageConteneur } from 'src/app/Services/Beans/PageConteneur';
import { ProjectService } from 'src/app/Services/project.service';

@Component({
  selector: 'app-create-fiche',
  templateUrl: './create-fiche.component.html',
  styleUrls: ['./create-fiche.component.scss']
})
export class CreateFicheComponent implements OnInit{
  
  @Input()
  folder? : PageConteneur;
  
  titre = "";
  id = "";
  description = "";

  errorMessage = "";

  @Output()
  created : EventEmitter<Page> = new EventEmitter<Page>();

  constructor( public projectService : ProjectService ){
        
  }

  ngOnInit(): void {
    (document.getElementById("inputCreateFiche") as HTMLElement).focus();
  }
  
  onDescChanged( description : string ){
    this.description = description;
    console.log( "newDesc : ", this.description );
  }

  onSubmit(){

    this.titre = this.titre[0].toUpperCase() + this.titre.slice( 1 );

    if( !this.id ){
      this.id = this.projectService.generateIdFromString( this.titre );
    }
    
    try{
      let page = this.projectService.createPage( this.id, this.titre, this.description, this.folder?.id );
      console.log( "Nouvelle fiche : ", this.titre, " (", this.id, ") : ", this.description );

      this.created.emit( page );
    }catch( error ){
      this.errorMessage = "Page non créée." + error;
      console.error("Page non créée.", error );
    }
  }
}

