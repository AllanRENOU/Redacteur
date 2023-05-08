import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Page } from 'src/app/Services/Beans/Page';
import { ProjectService } from 'src/app/Services/project.service';
import { AutocompleteInputComponent } from 'src/app/Utils/autoComplete/autocomplete-input/autocomplete-input.component';

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

  description : string = "";

  constructor( public projectService : ProjectService ){

  }

  ngOnInit(): void {
    
  }

  ngOnChanges( change : SimpleChange){
    this.refreshDescription();
  }

  private refreshDescription(){
    if( this.description == "undefined" ){
      this.description="";
    }

    if( !this.description && this.code  ){
      this.projectService.getPageAsync( this.code ).subscribe( (page : Page | null )=>{
        if( page ){
            this.description = this.replaceRefWithTitle( page.description );
            //this.description = page.description;
        }else{
          console.error( "Page ", this.code, " introuvable" )
        }
      });
    }
  }

  replaceRefWithTitle( desc : string ) : string{
    desc
      .replaceAll( AutocompleteInputComponent.LETTRES_END_WORD_REGEXP, " ")
      .split( " " )
      .filter( tt=>tt[0]=="@")
      .map( tt => tt.substring(1) )
      .forEach( (idPage : string) => {
        console.log( "Sorte : ", idPage )
        let page = this.projectService.getPage( idPage );

        if( page ){
          desc = desc.replaceAll( "@"+idPage, page.titre );
        }
      })

    return desc;
  }
}
