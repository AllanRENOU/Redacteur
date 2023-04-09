import { Injectable } from '@angular/core';
import { Page } from './Beans/Page';
import { PageConteneur } from './Beans/PageConteneur';
import { EncyclopedieComponent } from '../encyclopedie/encyclopedie.component';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  
  static ID_ROOT_FOLDER = "root";

  name : string = "nope";
  pages : Page[] = [];
  arboPage : PageConteneur[] = [];

  constructor(){
    
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

  /**
   * 
   * @param idPage Récupère les informations d'une fiche
   * @returns 
   */
  getPage( idPage : string ) : Page | null{
    let tmp = this.pages.filter( pp =>{ return pp.id == idPage } );
    return (tmp.length == 0)? null : tmp[0];
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

  /**
   * Récupère les information d'un dossier
   * @param idConteneur 
   * @returns 
   */
  getArboPage( idConteneur : string ) : PageConteneur | null{
    let tmp = this.arboPage.filter( pp =>{ return pp.id == idConteneur } );
    return (tmp.length == 0)? null : tmp[0];
  }

  /**
   * Crée un sous dossier dans le dossier indiqué
   * @param idParent 
   * @param nom 
   */
  addFolderArboPage( parentPC : PageConteneur, nom : string ){
    let newPageConteneur = new PageConteneur( this.generateIdFromString(nom), nom);
    
    if( parentPC ){

      console.log( "TODO : sauvegarde d'un nouveau dossier + lien parent - enfant");
      this.arboPage.push( newPageConteneur )
      parentPC.subContainer.push( newPageConteneur.id );
      console.log( "Nouveau dossier : ", newPageConteneur.titre, " (", newPageConteneur.id, ")")
    }else{
      console.error("Impossible de créer le dossier ", nom );
    }
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

    return page;
  }

  addBlocInPage( page : Page, titleBloc : string, contentBloc : string ){
    
    page.addBloc( this.formatText( titleBloc ), this.formatText( contentBloc ) );
    console.log( "TODO : Ajout dans la page ", page.titre, " du bloc ", titleBloc, " : ", contentBloc );
  }

  updatePage( page : Page ){
    console.log( "TODO :  Sauvegarder les modifs du titre et de la description. (", page.titre, " : ", page.description, ")" );
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

  /**
   * Ajoute une majuscule à la première lettre
   * @param texte 
   * @returns 
   */
  private formatText( texte : string ) : string{
    return texte[0].toUpperCase() + texte.slice(1);
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