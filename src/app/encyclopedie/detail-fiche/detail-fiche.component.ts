import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Page } from 'src/app/Services/Beans/Page';
import { ProjectService } from 'src/app/Services/project.service';

@Component({
  selector: 'app-detail-fiche',
  templateUrl: './detail-fiche.component.html',
  styleUrls: ['./detail-fiche.component.scss']
})
export class DetailFicheComponent implements OnInit {

  @Input()
  id:string = "";
  page? : Page;

  createPage = false;
  newTitle = "";
  newDesc = "";

  public constructor( private projectService : ProjectService ){
    
  }

  ngOnInit(): void {
    this.reloadPage();
  }

  ngOnChanges( change : SimpleChange){
    this.reloadPage();
    
  }

  reloadPage(){
    let page = this.projectService.getPage( this.id );
    if( page ){
      this.page = page;
      this.resetCreateBloc();
    }
  }
  
  // Création d'un bloc

  resetCreateBloc(){
    this.newTitle = "";
    this.newDesc = "";
    this.createPage = false;
  }

  onClickCreateBloc(){
    this.createPage = true;
  }

  onSubmitNewBloc(){
    console.log( "Click créer bloc ", this.newTitle, " : ", this.newDesc );

    if( this.page ){
      this.projectService.addBlocInPage( this.page, this.newTitle, this.newDesc );
    }else{
      console.log("Erreur, aucune page n'est actuellement affichée" );
    }
    

    this.resetCreateBloc();
  }

}
