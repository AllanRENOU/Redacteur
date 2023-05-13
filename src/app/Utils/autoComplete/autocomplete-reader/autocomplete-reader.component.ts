import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { MarkdownPipe } from '../../markdown.pipe';
import { LinkPageComponent } from 'src/app/encyclopedie/detail-fiche/link-page/link-page.component';
import { ProjectService } from 'src/app/Services/project.service';

@Component({
  selector: 'app-autocomplete-reader',
  templateUrl: './autocomplete-reader.component.html',
  styleUrls: ['./autocomplete-reader.component.scss']
})
export class AutocompleteReaderComponent implements AfterViewInit, OnChanges{

  @Input()
  data? : { texte : string };

  @ViewChild('textContainer')
  textContainer? : ElementRef<HTMLElement>;

  private isLoaded = false;
  
  constructor( private viewContainerRef: ViewContainerRef, private pipeMarkdown : MarkdownPipe, private projectService : ProjectService ){
  }

  ngOnChanges( ): void {
    this.isLoaded = this.textContainer != undefined;
    if( this.isLoaded ){
      this.updateText();
    }
  }

  ngAfterViewInit(): void { 
    if( !this.isLoaded ){
      this.updateText();
    }
  }

  updateText(){

    if( this.data && this.textContainer ){

      
      this.textContainer.nativeElement.innerHTML = this.pipeMarkdown.transform( this.data.texte );

      setTimeout( ()=>{

        if( this.textContainer ){

          // Pour chaque balise <span>, remplacer par l'instance de linkPage
          let links : HTMLCollectionOf<Element> = this.textContainer.nativeElement.getElementsByClassName( "refPage" );
          
          for( let i = 0; i< links.length; i++ ){
            let link : Element | undefined = links.item( i ) || undefined;

            if( link ){

              // Récupération de l'id, ed la page associée et création du lien
              let cc = link.getAttribute( "code" ) || "";
              let page = this.projectService.getPage( cc );

              this.instanciateLink( cc, page?.titre || cc, link as HTMLElement );

            }else{
              console.log( "link empty ", link)
            }
          }

          //Suppression des balises <span>
          for( let i = links.length - 1; i >= 0; i-- ){
            links.item( i )?.remove();
          }
        }else{
          console.error ( "Le conteneur du texte est introuvable" );
        }
      }, 10 );
      
    }else{
      console.error("Pas de textContainer ou de data", this.textContainer, this.data)
    }
  }
  
  private instanciateLink( code : string, texte : string, parent : HTMLElement){

    let componentRef = this.viewContainerRef.createComponent( LinkPageComponent );
    componentRef.setInput( "code", code );
    componentRef.setInput( "texte", texte );
    parent.after(componentRef.location.nativeElement);

  }
}
