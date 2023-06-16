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

  titleLine : string = "";
  contentLine : string = "";
  titleAxe : string = "";

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
    let div = (event.target as HTMLElement).parentElement?.parentElement?.parentElement;
    this.currentEditLine = ligne;

    if( this.form ){

      this.titleLine = ligne.nom;
      div?.appendChild( this.form.nativeElement );
      console.log( "div ", div, "form", this.form.nativeElement)
    }else{
      console.error( "Formulaire non trouvé" );
    }
    
  }

  onSubmitUpdate(){
    if( this.currentEditLine ){
      this.currentEditLine.content = this.contentLine;
      this.currentEditLine.nom = this.titleLine;
      this.currentEditLine = null;
    }
  }

  onTextLineChanged( texte : string ){
    this.contentLine = texte;
  }
  
  onClickLink( aa :any){
    console.log( "Click ", aa );
  }

  // ========== Bouton ajouter ligne ==========
  onClickAddLine(){
    let ligne = this.axesService.createLigne();
    ligne.nom = "Nouvelle ligne";
  }

  // ========== Edit nom axe ==========
  onSubmitUpdateTitle(){
    if( this.currentEditAxe ){
      this.currentEditAxe.nom = this.titleAxe;
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
        etape.title = "Nouvelle étape";
      }else{
        console.log( "Aucune ligne existante")
        // TODO créer une ligne
      }
      
    }else if( MenuItem.RIGHT == item  ){
      Ordonable.up( this.axesService.getAxes(), axe );
      this.axesService.refreshOrderAxes()
    }else if( MenuItem.LEFT == item  ){
      Ordonable.down( this.axesService.getAxes(), axe );
      this.axesService.refreshOrderAxes()
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

  // ========== Bouton ajouter axe ==========

  onClickAddAxe(){
    this.axesService.createAxe( "Nouvel axe" );
  }
}
