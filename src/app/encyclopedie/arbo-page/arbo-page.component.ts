import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from 'src/app/Services/Beans/Page';
import { PageConteneur } from 'src/app/Services/Beans/PageConteneur';
import { ProjectService } from 'src/app/Services/project.service';

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

  @Output()
  pageClicked : EventEmitter<string> = new EventEmitter<string>();

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
}
