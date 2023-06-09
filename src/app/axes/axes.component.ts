import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { ProjectService } from '../Services/project.service';
import { Location } from '@angular/common';
import { AxesService } from '../Services/axes.service';
import { MenuItem } from '../Utils/float-menu/MenuItem';
import { Axe } from './Beans/Axe';
import { Ordonable } from '../Utils/Ordonable';
import { Ligne } from './Beans/Ligne';

@Component({
  selector: 'app-axes',
  templateUrl: './axes.component.html',
  styleUrls: ['./axes.component.scss']
})
export class AxesComponent {

  idBtMore="";
  MENU_MORE_VALUES = [
    MenuItem.RENOMMER,
    MenuItem.ADD_ETAPE,
    MenuItem.RIGHT,
    MenuItem.LEFT,
    MenuItem.REMOVE
  ]

  currentEditLine : Ligne | null = null;
  currentEditAxe: Axe | null = null;

  // Formulaire
  @ViewChild( 'formLineCont' ) form?: ElementRef<HTMLFormElement>;
  @ViewChild( 'formAxeCont' ) formTitleAxe?: ElementRef<HTMLFormElement>;
  @ViewChild( 'tableAxe' ) tableAxe?: ElementRef<HTMLFormElement>;
  

  titleLine : string = "";
  contentLine : string = "";
  titleAxe : string = "";

  etapeToUpdate = "";

  constructor( public projectService : ProjectService, public axesService : AxesService, private router: Router, private _location: Location){
    
    this.router.events.subscribe((aa : any) => {
      if( aa instanceof ActivationEnd){
        this._location.go( "/" + this.projectService.dataProject.code + "/axes/" );
      }
    });

  }

  // ========== Edit ligne ==========

  onClickEditLine( ligne : Ligne, event : MouseEvent ){
    console.log( "Click edit ", ligne );

    // TODO valider modifs
    let div = (event.target as HTMLElement).parentElement?.parentElement?.parentElement as HTMLElement;
    this.editLine( ligne, div );
    
  }

  onSubmitUpdate(){
    if( this.currentEditLine ){
      this.currentEditLine.content = this.contentLine;
      this.currentEditLine.nom = this.titleLine;
      this.axesService.saveLigne( this.currentEditLine );
      this.currentEditLine = null;
    }
  }

  onTextLineChanged( texte : string ){
    this.contentLine = texte;
  }
  
  onClickLink( aa :any){
    console.log( "Click ", aa );
  }
  
  private editLine( ligne : Ligne, td? : HTMLElement ){

    if( this.form ){
      if( td ){
        this.currentEditLine = ligne;
        this.titleLine = ligne.nom;
        td.appendChild( this.form.nativeElement );
      }else{
        ligne.nom = "Nouvelle ligne";
        let formLine = this.form.nativeElement;
        setTimeout( () => {
          let tr = this.tableAxe?.nativeElement.lastElementChild?.firstElementChild;
          this.titleLine = ligne.nom;
          tr?.appendChild( formLine );
          this.currentEditLine = ligne;
          
        }, 50 );
      }
      
    }else{
      console.error( "Formulaire non trouvé" );
    }
    
  }

  // ========== Bouton ajouter ligne ==========
  onClickAddLine(){
    let ligne = this.axesService.createLigne();

    this.editLine( ligne );
    
    
    
  }
  
  // ========== Boutons déplacer ligne ==========

  upLine( line : Ligne ){
    this.axesService.downLigne( line );
    this.axesService.refreshOrderLignes();
  }

  downLine( line : Ligne ){
    this.axesService.upLigne( line );
    this.axesService.refreshOrderLignes();
  }

  // ========== Edit nom axe ==========
  onSubmitUpdateTitle(){
    if( this.currentEditAxe ){
      this.currentEditAxe.nom = this.titleAxe;
      this.axesService.saveAxe( this.currentEditAxe );
      this.currentEditAxe = null;
    }
  }
  
  // ========== Bouton more axe ==========

  onClickMore( axe : Axe, event : any ){
    this.idBtMore = axe.id;
    event.stopPropagation();
    this.currentEditAxe = null;
    let div = (event.target as HTMLElement).parentElement?.parentElement;
    
    if( this.formTitleAxe ){
      div?.appendChild( this.formTitleAxe.nativeElement );
    }
  }

  onHideMenu(){
    this.idBtMore = "";
  }

  onClickMenu( item : MenuItem, axe : Axe ){

    if( MenuItem.ADD_ETAPE == item ){

      let ligne = Ordonable.last(this.axesService.getLignes());
      if( ligne ){
        console.log( "create etape : ", "E_" + Date.now(), ", axe ", this.idBtMore, ", ligne ", Ordonable.last(this.axesService.getLignes()) );
        let etape = this.axesService.createEtape( "E_" + Date.now(), this.idBtMore, ligne.id );
        this.etapeToUpdate = etape.id;
        etape.title = "Nouvelle étape";
        setTimeout( ()=>this.tableAxe?.nativeElement.scrollIntoView({ behavior: "smooth", block : "end" }), 100 );
        
      }else{
        console.log( "Aucune ligne existante")
        // TODO créer une ligne
      }
      
    }else if( MenuItem.RIGHT == item  ){
      this.rightAxe( axe );
    }else if( MenuItem.LEFT == item  ){
      this.leftAxe( axe );
    }else if( MenuItem.RENOMMER == item ){
      this.renameAxe( axe );
    }else if( MenuItem.REMOVE ){
      this.axesService.removeAxe( axe );
    }
  }

  private renameAxe(axe : Axe ){
      this.titleAxe = axe.nom;
      this.currentEditAxe = axe;
  }

  rightAxe( axe :Axe ){

    this.axesService.decalerAxeDroite( axe );
    this.axesService.refreshOrderAxes()
  }

  leftAxe( axe : Axe ){
    this.axesService.decalerAxeGauche( axe );
    this.axesService.refreshOrderAxes()

  }

  // ========== Bouton ajouter axe ==========

  onClickAddAxe(){

    if( this.axesService.getLignes().length == 0 ){
      let line = this.axesService.createLigne();
      this.editLine( line );
    }
    let axe = this.axesService.createAxe( "Nouvel axe", "AXE_" + Date.now() );

    setTimeout( ()=>{
      if( this.tableAxe  && this.formTitleAxe ){
        let lastTh = this.tableAxe.nativeElement.firstElementChild?.lastElementChild;
        lastTh?.appendChild( this.formTitleAxe.nativeElement );
        this.renameAxe( axe );
        console.log( "currentEditAxe" , this.currentEditAxe)
        console.log( "axes", this.axesService.getAxes())
      }
    }, 50 )
    
  }

  // ========== Bouton démarrer projet ==========
  onClickStart(){

    let axe = this.axesService.createAxe( "Nouvel axe", "AXE_" + Date.now() );

    setTimeout( ()=>{
      if( this.tableAxe  && this.formTitleAxe ){
        let lastTh = this.tableAxe.nativeElement.firstElementChild?.lastElementChild;
        lastTh?.appendChild( this.formTitleAxe.nativeElement );
        this.renameAxe( axe );
        console.log( "currentEditAxe" , this.currentEditAxe)
        console.log( "axes", this.axesService.getAxes())
      }
    }, 50 )
    
    if( this.axesService.getLignes().length == 0 ){
      let line = this.axesService.createLigne();
      this.editLine( line );
    }
  }
}


