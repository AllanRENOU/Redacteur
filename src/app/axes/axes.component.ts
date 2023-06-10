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

  constructor( public projectService : ProjectService, public axesService : AxesService, private router: Router, private _location: Location){
    
    this.router.events.subscribe((aa : any) => {
      if( aa instanceof ActivationEnd){
        this._location.go( "/" + this.projectService.dataProject.code + "/axes/" );
      }
    });

  }


}
