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

  dataProject : { code : string, name : string } = { code : "", name : "Rédacteur" }

  name : string = "nope";
  pages : Page[] = [];
  arboPage : PageConteneur[] = [];

  observableArboPage? : Observable<any>;

  constructor( private http: HttpClient ){
    this.reloadAll();
  }

  setProject( newIdProject : string ){

    if( this.dataProject.code != newIdProject && newIdProject ){
      console.log( "Chargement projet ", newIdProject );
      this.dataProject.code = newIdProject;
      this.pages = [];
      this.arboPage = [];
      this.reloadAll();
    }
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

      if( this.dataProject.code ){
        return new Observable<Page | null>( observer =>{

          this.http.get<Page[]>( ProjectService.url + this.dataProject.code + "/fiche/"+idPage ).subscribe( data => {
            page = this.generatePage( data );
            if( page && page != null ){
              page.isLight = false;
              this.pages.push( page );
            }
            observer.next( page );
          } );
        } );
        
    }else{
      return new Observable( observer =>{ observer.next( null ); } ); 
    }
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
      if( this.dataProject.code ){
      return this.http.post<Page[]>( ProjectService.url + this.dataProject.code + "/fiche", idPages );
      }else{
        return new Observable( observer =>{ observer.next( [] ); } ); 
      }
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

      if( this.dataProject.code ){
        let obs : Observable <PageConteneur | null> = new Observable( observer =>{
          this.observableArboPage?.subscribe( data => {
            observer.next( this.getArboPage( idConteneur ) );
          });
        } );
        return obs
      }else{
        return new Observable( observer =>{
          observer.next( null );
        } );
      };
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

    this.http.post<PageConteneur>( ProjectService.url + this.dataProject.code + "/dossier/" + dossier.id, dossier ).subscribe( (dossierReturn : PageConteneur) =>{
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
    this.http.post<Page>( ProjectService.url + this.dataProject.code + "/fiche/" + page.id, page ).subscribe( (newPage : Page) =>{
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

  private reloadAll(){
    
    this.http.get<any>( ProjectService.url ).subscribe( ( data : { projects: { code:string, name:string }[] } ) =>{
      if( data ){
        let tmp =  data.projects.filter( (pp)=>{ return pp.code == this.dataProject.code } );
        if( tmp.length>0){
          this.dataProject = tmp[0];
        }else{
          console.error( "Le projet ", this.dataProject.code, " introuvable. Projets existants : ", data.projects );
        }
        
      }else{
        console.error( "Impossible de récupérer les données du projet" );
      }
    });
    
    if( this.dataProject.code ){
      this.observableArboPage = this.http.get<any>( ProjectService.url + this.dataProject.code + "/dossier" );
      
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

      this.http.get<any>( ProjectService.url + this.dataProject.code + "/fiche" ).subscribe( data =>{

        for( let idPage of Object.keys( data ) ){
          let page = this.generatePage( data[idPage] );

          if( page ){
            page.isLight = true;
            this.pages.push( page );
          }
        }
      } );
    }else{
      console.log( "Aucun projet sélectionné" );
    }
    
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