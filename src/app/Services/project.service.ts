import { Injectable } from '@angular/core';
import { Page } from './Beans/Page';
import { PageConteneur } from './Beans/PageConteneur';
import { EncyclopedieComponent } from '../encyclopedie/encyclopedie.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  
  static url = "http://localhost:8080/";

  static ID_ROOT_FOLDER = "root";

  PROJECT_NAME = "PROJECT_TEST";

  name : string = "nope";
  pages : Page[] = [];
  arboPage : PageConteneur[] = [];

  observableArboPage : Observable<any>;

  constructor( private http: HttpClient ){
    
    this.observableArboPage = this.http.get<any>( ProjectService.url + this.PROJECT_NAME + "/dossier" );
    
    this.observableArboPage.subscribe( data =>{
      if( Object.keys( data ).length == 0 ){
        console.log( "Création d'un dossier root" )
        this.updateArbo( this.getRootFolder() );
      }else{
        for( let idDossier of Object.keys( data )){
          let dossier = this.generatePageContainer( data[ idDossier ] );
          if( dossier ){
            this.arboPage.push( dossier );
          }
        }
      }
    });

    this.http.get<any>( ProjectService.url + this.PROJECT_NAME + "/fiche" ).subscribe( data =>{

      for( let idPage of Object.keys( data ) ){
        let page = this.generatePage( data[idPage] );

        if( page ){
          page.isLight = true;
          this.pages.push( page );
        }
      }
    } );
    
    /*
    // Tests
    let p01 = new Page( "p01", "Page 1", "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut repudiandae magni eum eligendi assumenda temporibus labore nulla dolorum enim voluptate ab adipisci quaerat illum facere, deserunt dignissimos obcaecati unde ad.")
    p01.addBloc( "Premier bloc", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum");
    p01.addBloc( "Second bloc", "Encore un bloc");
    this.pages.push( p01 );
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
    cRoot.addSubContainer( c01 );
    cRoot.addSubContainer( c02 );

    // c01
    c01.pages.push( this.pages[2].id );
    c01.addSubContainer( c11 );

    // c11
    c11.pages.push( this.pages[3].id );

    // c02
    c02.pages.push( this.pages[4].id );

    this.arboPage.push( cRoot );
    this.arboPage.push( c01 );
    this.arboPage.push( c02 );
    this.arboPage.push( c11 );
    */
  }

  /**
   * 
   * @param idPage Récupère les informations d'une fiche
   * @returns 
   */
  getPage( idPage : string ) : Page | null{
    let tmp = this.pages.filter( pp =>{ return pp.id == idPage } );
    console.log( "Get ", idPage, " : ", ((tmp.length == 0)? null : tmp[0]), " total : ", this.arboPage )
    return (tmp.length == 0)? null : tmp[0];
  }

  getPageAsync( idPage : string ) : Observable<Page | null>{
    
    let page : Page | null = this.getPage( idPage );

    if( page && !page.isLight ){
      return new Observable( observer =>{
        observer.next( page );
      } );
    }else{

      return new Observable<Page | null>( observer =>{

        this.http.get<Page[]>( ProjectService.url + this.PROJECT_NAME + "/fiche/"+idPage ).subscribe( data => {
          page = this.generatePage( data );
          if( page && page != null ){
            page.isLight = false;
            this.pages.push( page );
          }
          observer.next( page );
        } );
      } );
    }
  }
  
  /**
   * Récupère les informations d'une liste de fiches
   * @param idPages 
   * @returns 
   */
  getPages( idPages : string[] ) : Page[]{
    let tmp = this.pages.filter( pp =>{ return idPages.indexOf( pp.id ) != -1 } );
    return (tmp.length == 0)? [] : tmp;
  }

  getPagesAsync( idPages : string[] ) : Observable <Page[]>{

    if( this.pages.length > 0 ){
      return new Observable( observer =>{
        observer.next( this.getPages( idPages ) );
      } );
    }else{
      return this.http.post<Page[]>( ProjectService.url + this.PROJECT_NAME + "/fiche", idPages );
    }

  }

  /**
   * Récupère les information d'un dossier
   * @param idConteneur 
   * @returns 
   */
  getArboPage( idConteneur : string ) : PageConteneur | null{
    let tmp = this.arboPage.filter( pp =>{ return pp.id == idConteneur } );
    return (tmp.length == 0)? null : tmp[0];
  }

  getArboPageAsync( idConteneur : string ) : Observable <PageConteneur | null>{

    if( this.arboPage.length > 0 ){
      return new Observable( observer =>{
        observer.next( this.getArboPage( idConteneur ) );
      } );
    }else{

      let obs : Observable <PageConteneur | null> = new Observable( observer =>{
        this.observableArboPage.subscribe( data => {
          observer.next( this.getArboPage( idConteneur ) );
        })
      } );

      return obs
    }
  }



  /**
   * Crée un sous dossier dans le dossier indiqué
   * @param idParent 
   * @param nom 
   */
  addFolderArboPage( parentPC : PageConteneur, nom : string ){
    let newPageConteneur = new PageConteneur( this.generateIdFromString(nom), nom);
    
    if( parentPC ){

      this.arboPage.push( newPageConteneur )
      parentPC.addSubContainer( newPageConteneur );
      console.log( "Nouveau dossier : ", newPageConteneur.titre, " (", newPageConteneur.id, ")")
      this.updateArbo( newPageConteneur );
      this.updateArbo( parentPC );
    }else{
      console.error("Impossible de créer le dossier ", nom );
    }
  }

  updateArbo( dossier : PageConteneur ){
    console.log( "Maj dossier ", dossier );

    this.http.post<PageConteneur>( ProjectService.url + this.PROJECT_NAME + "/dossier/" + dossier.id, dossier ).subscribe( (dossierReturn : PageConteneur) =>{
      console.log( "Dossier recu ", dossierReturn );
    });
  }

  removeArbo( dossier : PageConteneur ){
    this.arboPage.forEach( (dd , index) => {
      if( dd.id == dossier.id ){
        this.arboPage.splice( index, 1 );
      }
    } );

    this.arboPage.forEach( dd =>{
      if( dd.removeSubContainer( dossier ) ){
        this.updateArbo( dd );
      }
    });

    dossier.isRemoved = true;
    this.updateArbo( dossier );
  }

  /**
   * Créer une nouvelle page, et l'ajoute dans le dossier indiqué. Si aucun dossier n'est indiqué, la page sera ajoutée à la racine du projet.
   * Une Erreur est levée si l'id existe déjà
   * @param id 
   * @param titre 
   * @param description 
   * @param idFolder 
   */
  createPage( id : string, titre : string, description : string, idFolder? : string  ) : Page { 
    let page = new Page( id, titre, description );
    page.isLight = false;

    console.log( "TODO : Enregistrer la création de la page", page );

    if( !this.idPageNotUsed( id ) ){
      throw new Error( "Cet identifiant est déjà utilisé" );
    }

    let folder
    if( idFolder ){
      folder= this.getArboPage( idFolder );
      
      if( !folder ){
        console.warn( "Le dossier ", idFolder, " n'existe pas. Fiche ajoutée à la racine");
        folder = this.getRootFolder();
      }
    }else{
      folder = this.getRootFolder();
    }
    
    this.pages.push( page );
    folder.pages.push( id );

    this.updatePage( page );
    this.updateArbo( folder );

    return page;
  }

  addBlocInPage( page : Page, titleBloc : string, contentBloc : string ){
    
    page.addBloc( this.formatText( titleBloc ), this.formatText( contentBloc ) );
    this.updatePage( page );
  }

  updatePage( page : Page ){
    console.log( "Maj page ", page );
    this.http.post<Page>( ProjectService.url + this.PROJECT_NAME + "/fiche/" + page.id, page ).subscribe( (newPage : Page) =>{
      console.log( "Page recu ", newPage );
    });
  }

  removePage( page : Page ){
    page.isRemoved = true;
    this.updatePage( page );
    this.arboPage.forEach( dossier => { 
      if( dossier.removePage( page.id) ){
        this.updateArbo( dossier );
      }
    });
  }

  /**
   * Donne un id à partir d'un titre
   * @param texte 
   * @returns 
   */
  generateIdFromString( texte : string) : string{
    return texte
      .replaceAll( ' ', '_')
      .replaceAll( '\'', '_')
      .replaceAll( '"', '')
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") //Supprime les caractères spéciaux et accents
      .toLocaleUpperCase();
  }

  private generatePageContainer( data : any ) : PageConteneur|null{

    let dossier = null;

    if( data.id && data.titre ){
      let id = data.id;
      let titre = data.titre;
      let pages = data.pages;
      let subContainer = data.subContainer;
      let isRemoved = data.isRemoved;

      dossier = new PageConteneur( id, titre );

      if( pages ){
        dossier.pages = pages;
      }

      if( subContainer ){
        dossier.subContainer = subContainer;
      }

      dossier.isRemoved = isRemoved === true;
      

    }else{
      console.error( "Impossible de convertir ", data, " en PageConteneur");
    }

    return dossier;
  }
  private generatePage( data : any ) : Page | null{

    let page = null;

    if( data.id && data.titre ){
      page = new Page( data.id, data.titre, "" );

      if( data.description ){
        page.description = data.description;
      }

      if( data.blocs ){
        for( let bloc of data.blocs ){
          page.addBloc( bloc.titre, bloc.texte );
        }
      }
      

      page.isRemoved = data.isRemoved === true;
    }else{
      console.error( "Impossible de convertir ", data, " en Fiche");
    }

    return page;
  }

  /**
   * Ajoute une majuscule à la première lettre
   * @param texte 
   * @returns 
   */
  private formatText( texte : string ) : string{
    if( texte ){
      return texte[0].toUpperCase() + texte.slice(1);
    }else{
      return "";
    }
    
  }

  private getRootFolder() : PageConteneur{

    let rootFolder;

    if( !this.arboPage || this.arboPage.length == 0 ){
      this.arboPage = [];
      rootFolder = new PageConteneur( ProjectService.ID_ROOT_FOLDER, "Projet" );
      this.arboPage.push( rootFolder );
    }else{
      rootFolder = this.getArboPage( ProjectService.ID_ROOT_FOLDER );

      if( !rootFolder ){
        rootFolder = this.arboPage[0];
      }
    }
    return rootFolder;
  }

  private idPageNotUsed( id : string ) : boolean{
    return this.pages.filter( page => page. id == id ).length == 0;
  }
}