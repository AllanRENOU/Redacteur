import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { ProjectService } from '../Services/project.service';
import { Location } from '@angular/common';
import { AxesService } from '../Services/axes.service';
import { MenuItem } from '../Utils/float-menu/MenuItem';
import { Axe } from './Beans/Axe';

@Component({
  selector: 'app-axes',
  templateUrl: './axes.component.html',
  styleUrls: ['./axes.component.scss']
})
export class AxesComponent {

  idBtMore="";
  MENU_MORE_VALUES = [
    MenuItem.ADD
  ]

  constructor( public projectService : ProjectService, public axesService : AxesService, private router: Router, private _location: Location){
    
    this.router.events.subscribe((aa : any) => {
      if( aa instanceof ActivationEnd){
        this._location.go( "/" + this.projectService.dataProject.code + "/axes/" );
      }
    });

  }

  onClickMore( axe : Axe, event : any ){
    this.idBtMore = axe.id;
    event.stopPropagation();
  }

  onHideMenu(){
    this.idBtMore = "";
    //console.log( "onHideMenu" );
  }

  onClickMenu( event : any ){

  }


}
