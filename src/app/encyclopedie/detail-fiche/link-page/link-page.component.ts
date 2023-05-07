import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Page } from 'src/app/Services/Beans/Page';
import { ProjectService } from 'src/app/Services/project.service';

@Component({
  selector: 'app-link-page',
  templateUrl: './link-page.component.html',
  styleUrls: ['./link-page.component.scss']
})
export class LinkPageComponent implements OnInit {

  @Input()
  code : string = "";

  @Input()
  texte : string = "";

  @Input()
  description : string = "";

  constructor( public projectService : ProjectService ){

  }

  ngOnInit(): void {
    
  }

  ngOnChanges( change : SimpleChange){
    console.log( "change : texte : ", this.texte, " (", this.code , "), description : ", this.description );
    this.refreshDescription();
  }

  private refreshDescription(){
    if( !this.description ){
      this.projectService.getPageAsync( this.code ).subscribe( (page : Page | null )=>{
        if( page ){
            this.description = page.description;
            console.log( "lien mis à jour : titre : ", this.texte, ", description : ", this.description );
        }else{
          console.error( "Page ", this.code, " introuvable" )
        }
      });
    }
  }
}
