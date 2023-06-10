import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { ProjectService } from '../Services/project.service';
import { Location } from '@angular/common';
import { Ligne } from './Beans/Ligne';
import { Axe } from './Beans/Axe';
import { Etape } from './Beans/Etape';
import { Ordonable } from '../Utils/Ordonable';
import { AxesService } from '../Services/axes.service';

@Component({
  selector: 'app-axes',
  templateUrl: './axes.component.html',
  styleUrls: ['./axes.component.scss']
})
export class AxesComponent {

  lignes :  Ligne[] = [];

  constructor( public projectService : ProjectService, public axesService : AxesService, private router: Router, private _location: Location){
    
    this.router.events.subscribe((aa : any) => {
      if( aa instanceof ActivationEnd){
        this._location.go( "/" + this.projectService.dataProject.code + "/axes/" );
      }
    });
    
    this.init();

  }

  private init(){

    let axe1 = this.createAxe( "Axe 1" );
    let axe2 = this.createAxe( "Axe 2" );
    let l1 = this.createLigne( "L1" );
    let l2 = this.createLigne( "L2" );
    let l3 = this.createLigne( "L3" );

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

    console.log( this.axesService.getAxes() )
    console.log(this.lignes)

  }

  // ========== Axe ==========
  createAxe( name : string ) : Axe {
    let axe = new Axe( this.projectService.generateIdFromString( name ), name );
    Ordonable.addInArray( this.axesService.getAxes(), axe );
    return axe;
  }

  removeAxe( id : string ){
    Ordonable.removeFromArray( this.axesService.getAxes(), this.getAxe( id ) );
  }

  decalerAxeDroite( axe : Axe ){
    Ordonable.up( this.axesService.getAxes(), axe );
  }

  decalerAxeGauche( axe : Axe ){
    Ordonable.up( this.axesService.getAxes(), axe );
  }

  getAxe( id : string) : Axe{
    return this.axesService.getAxes().filter( a => a.id == id )[0] || null;
  }



  // ========== Ligne ==========
  createLigne( id? : string ) : Ligne{
    if( !id ){
      id = "L_" +  Date.now();
    }
    let ligne = new Ligne( id );
    Ordonable.addInArray( this.lignes, ligne );
    return ligne;
  }

  removeLigne( id : string ){
    Ordonable.removeFromArray( this.lignes, this.getLigne( id ) );
  }

  getLigne( id : string) : Ligne{
    return this.lignes.filter( a => a.id == id )[0] || null;
  }



  // ========== Etape ==========

  createEtape( idEtape : string, idAxe : string, idLigne : string ) : Etape{
    let e = new Etape( idEtape );

    this.getAxe( idAxe )?.addEtape(e);
    e.idLigne = idLigne;
    
    return e;
  }

  removeEtape( etape : Etape, idAxe : string ){
    this.getAxe( idAxe )?.removeEtape( etape );
  }

}
