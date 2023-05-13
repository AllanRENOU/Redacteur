import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { MarkdownPipe } from '../../markdown.pipe';
import { LinkPageComponent } from 'src/app/encyclopedie/detail-fiche/link-page/link-page.component';

@Component({
  selector: 'app-autocomplete-reader',
  templateUrl: './autocomplete-reader.component.html',
  styleUrls: ['./autocomplete-reader.component.scss']
})
export class AutocompleteReaderComponent implements AfterViewInit{

  @Input()
  data? : { texte : string };

  @ViewChild('textContainer')
  textContainer? : ElementRef<HTMLElement>;
  
  constructor( private viewContainerRef: ViewContainerRef, private pipeMarkdown : MarkdownPipe ){
  }


  ngAfterViewInit(): void {
    
    this.updateText();

    if( this.textContainer ){

      let links : HTMLCollectionOf<Element> = this.textContainer.nativeElement.getElementsByClassName( "refPage");

      let linkToInstanciate : {code : string, texte : string, parent : Element}[] = [];
      
      for( let i = 0; i< links.length; i++ ){
        let link : Element | undefined = links.item( i ) || undefined;
        
        if( link ){

          let cc = link.getAttribute( "code" ) || "";
          let tt = link.getAttribute( "texte" ) || "";
          let dd = link.getAttribute( "description" ) || "";

          //this.instanciateLink( cc, tt, dd, link );
          linkToInstanciate.push({
            code : cc , texte : tt, parent : link 
          });

          link.classList.remove( "refPage" );
        }
      }

      setTimeout( ()=>{this.instanciateLinks( linkToInstanciate )}, 10 );

    }else{
      console.error("Pas de textContainer")
    }
  }

  updateText(){

    if( this.data && this.textContainer ){
      this.textContainer.nativeElement.innerHTML = this.pipeMarkdown.transform( this.data.texte );
    }else{
      console.error("Pas de textContainer ou de data", this.textContainer, this.data)
    }
  }

  private instanciateLinks( linkToInstanciate : {code : string, texte : string, parent : Element}[] ){
    for( let ll of linkToInstanciate ){
      this.instanciateLink( ll.code, ll.texte, "", ll.parent );
    }
  }
  
  private instanciateLink( code : string, texte : string, desc : string, parent : Element){

    let componentRef = this.viewContainerRef.createComponent( LinkPageComponent );
    componentRef.setInput( "code", code );
    componentRef.setInput( "texte", texte );
    //componentRef.setInput( "description", desc );
    parent.appendChild( componentRef.location.nativeElement );

  }
}
