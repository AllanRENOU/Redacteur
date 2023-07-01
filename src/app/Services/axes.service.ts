import { Injectable } from '@angular/core';
import { Axe } from '../axes/Beans/Axe';
import { Ligne } from '../axes/Beans/Ligne';
import { Ordonable } from '../Utils/Ordonable';
import { Etape } from '../axes/Beans/Etape';
import { ProjectService } from './project.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AxesService {

  private axes : Axe[] = [];
  lignes :  Ligne[] = [];

  constructor( public projectService : ProjectService, private http: HttpClient ) {

    if( projectService.getProject().code ){
      this.init();
    }
    projectService.observableProject.subscribe( project =>{
      this.init();
    })
    
    //this.init();
   }

  private init(){
      this.refreshAxesAsync().subscribe( data =>{ console.log ("Axes loaded", data)})
      this.refreshLignesAsync().subscribe( data =>{ console.log ("Lines loaded", data)})
    /*
    let axe1 = this.createAxe( "Axe 1" );
    let axe2 = this.createAxe( "Axe 2" );
    let l1 = this.createLigne( "L1" );
    let l2 = this.createLigne( "L2" );
    let l3 = this.createLigne( "L3" );
    l1.content = "Contenu de la ligne 1";
    l1.nom = "Ligne 1"
    
    l2.content = "Contenu de la ligne 2";
    l2.nom = "Ligne 2"
    
    l3.content = "Contenu de la ligne 3";
    l3.nom = "Ligne 3"

    let e1 = this.createEtape( "E1", axe1.id, l1.id );
    e1.title = "Etape 1";
    e1.content=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
    
    let e2 = this.createEtape( "E2", axe1.id, l3.id );
    e2.title = "Etape 2";
    e2.content=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam"
    
    let e3 = this.createEtape( "E3", axe1.id, l3.id );
    e3.title = "Etape 3";
    e3.content=" Lorem ipsum dolor sit amet, consectetur adipiscing elit."

    let e4 = this.createEtape( "E4", axe2.id, l1.id );
    e4.title = "Etape 4";
    e4.content=" Lorem ipsum dolor "
    
    let e5 = this.createEtape( "E5", axe2.id, l2.id );
    e5.title = "Etape 5";
    e5.content=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam"
    
    let e6 = this.createEtape( "E6", axe2.id, l3.id );
    e6.title = "Etape 6";
    e6.content=" Lorem ipsum dolor sit amet"

    console.log( this.axes )
    console.log(this.lignes)*/
  }

  // ========== Axe ==========
  createAxe( name : string, id? : string ) : Axe {
    if( !id ){
      id = this.projectService.generateIdFromString( name )
    }
    let axe = new Axe( id, name );
    Ordonable.addInArray( this.axes, axe );

    this.updateAxeAsync( axe ).subscribe( data =>{ console.log ("Create saved ", data)});

    return axe;
  }

  removeAxe( axe : string  | Axe ){
    if( typeof axe == "string" ){
      axe = this.getAxe( axe )
    }
    axe.isRemoved = true;
    Ordonable.removeFromArray( this.axes, axe );

    this.updateAxeAsync( axe ).subscribe( data =>{ console.log ("Remove saved ", data)});
  }

  decalerAxeDroite( axe : Axe ){
    let axesUpdated = Ordonable.up( this.axes, axe );
    axesUpdated.forEach( aa => {
      this.updateAxeAsync( aa );
    })
  }

  decalerAxeGauche( axe : Axe ){
    let axesUpdated = Ordonable.down( this.axes, axe );
    axesUpdated.forEach( aa => {
      this.updateAxeAsync( aa );
    })
  }

  getAxe( id : string) : Axe{
    return this.axes.filter( a => a.id == id )[0] || null;
  }

  getAxes( ) : Axe[]{
    return this.axes;
  }

  refreshOrderAxes(){
    this.axes = Ordonable.sortArray( this.axes );
  }

  saveAxe( axe : Axe ){
    this.updateAxeAsync( axe )
  }

  // ========== Ligne ==========
  createLigne( id? : string ) : Ligne{
    if( !id ){
      id = "L_" +  Date.now();
    }
    let ligne = new Ligne( id );
    Ordonable.addInArray( this.lignes, ligne );
    this.updateLignesAsync( ligne );
    return ligne;
  }

  removeLigne( id : string ){
    let ligne = this.getLigne( id );
    Ordonable.removeFromArray( this.lignes, ligne );
    this.updateLignesAsync( ligne );
  }

  getLigne( id : string) : Ligne{
    return this.lignes.filter( a => a.id == id )[0] || null;
  }
  
  getLignes() : Ligne[]{
    return this.lignes;
  }

  upLigne( ligne : Ligne ){
    let lignesUpdated = Ordonable.up( this.lignes, ligne );
    lignesUpdated.forEach( ll => {
      this.updateLignesAsync( ll );
    })
    
  }

  downLigne( ligne : Ligne ){
    let lignesUpdated = Ordonable.down( this.lignes, ligne );
    lignesUpdated.forEach( ll => {
      this.updateLignesAsync( ll );
    })
  }

  refreshOrderLignes(){
    this.lignes = Ordonable.sortArray( this.lignes );
  }

  saveLigne( ligne : Ligne ){
    this.updateLignesAsync( ligne );
  }


  // ========== Etape ==========

  createEtape( idEtape : string, idAxe : string, idLigne : string ) : Etape{
    let e = new Etape( idEtape );

    let axe = this.getAxe( idAxe )
    axe.addEtape(e);
    e.idLigne = idLigne;

    this.updateEtapeAsync( e );
    this.updateAxeAsync( axe );
    
    return e;
  }

  removeEtape( etape : Etape, idAxe : string ){
    let axe = this.getAxe( idAxe );

    if( axe ){
      axe.removeEtape( etape );
      this.updateAxeAsync( axe );
    }
    
  }

  saveEtape( etape : Etape ){
    this.updateEtapeAsync( etape );
  }


  // ========== Requetes ==========

  private static DATA_TYPE_AXE = "axes";
  private static DATA_TYPE_ETAPES = "etapes";
  private static DATA_TYPE_LIGNES = "lignes";

  // Appel le web service pour récupérer les axes et place le résultat dans axes
  private refreshAxesAsync() : Observable<any>{
    let obs : Observable<any> = this.http.get<any>( ProjectService.url + this.projectService.getProject().code + "/" + AxesService.DATA_TYPE_AXE );
    obs.subscribe( axes => {
      console.log( "Réception des axes : ", axes );
      this.axes = [];

      let k: keyof typeof axes;
      for (k in axes) { 
        const axe = Axe.instanciate( axes[k] );  
        if( !axe.isRemoved ){
          this.axes.push( axe );
          this.getEtapesAsync( axes[k].etapes ).subscribe( ( etapes : Etape[] ) =>{ axe.setEtapes( etapes ); axe.refreshOrderEtapes() } );
        }
      }

      this.refreshOrderAxes();

    } );
    return obs;
  }

  // Appel le webservice pour sauvegarder un axe
  private updateAxeAsync( axe : Axe ) : Observable<Axe>{
    let tmpAxe : any = Object.assign( {}, axe );
    tmpAxe.etapes = axe.getEtapes().map( ee => ee.id );
    let obs = this.http.post<Axe>( ProjectService.url + this.projectService.getProject().code + "/" + AxesService.DATA_TYPE_AXE + "/" + axe.id, tmpAxe );
    obs.subscribe( aa => { console.log( "Axe ", aa, " sauvegardé")})
    return obs
  }

  // Appel le webservice pour sauvegarder une etape
  private updateEtapeAsync( etape : Etape ): Observable<Etape>{
    let obs = this.http.post<Etape>( ProjectService.url + this.projectService.getProject().code + "/" + AxesService.DATA_TYPE_ETAPES + "/" + etape.id, etape );
    obs.subscribe( ee => { console.log( "Etape ", ee, " sauvegardé")})
    return obs
  }

  // Appel le web service pour récupérer le détail des id d'étapes donnés en paramètre
  private getEtapesAsync( etapesId : string[] ) : Observable<Etape[]>{
    console.log( "get etapes : ", etapesId );
    return this.http.post<Etape[]>( ProjectService.url + this.projectService.getProject().code + "/" + AxesService.DATA_TYPE_ETAPES, etapesId );
  }
  
  // Appel le web service pour récupérer les lignes et place le résultat dans lignes
  private refreshLignesAsync() : Observable<any>{
    let obs : Observable<any> = this.http.get<any>( ProjectService.url + this.projectService.getProject().code + "/" + AxesService.DATA_TYPE_LIGNES );
    obs.subscribe( lignes => {
      console.log( "Réception des lignes : ", lignes );
      this.lignes = [];

      let k: keyof typeof lignes;
      for (k in lignes) { 
        const ligne = Ligne.instanciate( lignes[k] );  
        //if( !axe.isRemoved ){
          this.lignes.push( ligne );
        //}
      }

      this.refreshOrderLignes();

    } );
    return obs;
  }

  // Appel le webservice pour sauvegarder une ligne
  private updateLignesAsync( ligne : Ligne ): Observable<Ligne>{
    let obs = this.http.post<Ligne>( ProjectService.url + this.projectService.getProject().code + "/" + AxesService.DATA_TYPE_LIGNES + "/" + ligne.id, ligne );
    obs.subscribe( ee => { console.log( "ligne ", ligne, " sauvegardé")})
    return obs
  }

}
