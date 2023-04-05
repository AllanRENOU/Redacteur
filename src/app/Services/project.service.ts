import { Injectable } from '@angular/core';
import { Page } from './Beans/Page';
import { PageConteneur } from './Beans/PageConteneur';
import { EncyclopedieComponent } from '../encyclopedie/encyclopedie.component';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  
  name : string = "nope";
  pages : Page[] = [];
  arboPage : PageConteneur[] = [];

  constructor(){
    
    // Tests
    this.pages.push( new Page( "p01", "Page 1", "desc page 1"));
    this.pages.push( new Page( "p02", "Page 2", "desc page 2"));
    this.pages.push( new Page( "p03", "Page 3", "desc page 3"));
    this.pages.push( new Page( "p04", "Page 4", "desc page 4"));
    this.pages.push( new Page( "p05", "Page 5", "desc page 5"));

    let cRoot = new PageConteneur( EncyclopedieComponent.ROOT_PAGE_CONTAINER_ID, "Arbo");
    let c01 = new PageConteneur( "c01", "Premier dossier" );
    let c02 = new PageConteneur( "c02", "Second dossier" );
    let c11 =  new PageConteneur( "c11", "Sous dossier");

    // root
    cRoot.pages.push( this.pages[0].id );
    cRoot.pages.push( this.pages[1].id );
    cRoot.subContainer.push( c01.id );
    cRoot.subContainer.push( c02.id );

    // c01
    c01.pages.push( this.pages[2].id );
    c01.subContainer.push( c11.id );

    // c11
    c11.pages.push( this.pages[3].id );

    // c02
    c02.pages.push( this.pages[4].id );

    this.arboPage.push( cRoot );
    this.arboPage.push( c01 );
    this.arboPage.push( c02 );
    this.arboPage.push( c11 );

  }

  getPage( idPage : string ) : Page | null{
    let tmp = this.pages.filter( pp =>{ return pp.id == idPage } );
    return (tmp.length == 0)? null : tmp[0];
  }
  
  getPages( idPages : string[] ) : Page[]{
    let tmp = this.pages.filter( pp =>{ return idPages.indexOf( pp.id ) != -1 } );
    return (tmp.length == 0)? [] : tmp;
  }

  getArboPage( idConteneur : string ) : PageConteneur | null{
    let tmp = this.arboPage.filter( pp =>{ return pp.id == idConteneur } );
    return (tmp.length == 0)? null : tmp[0];
  }
}