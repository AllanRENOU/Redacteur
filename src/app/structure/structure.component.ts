import { Component } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { ProjectService } from '../Services/project.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss']
})
export class StructureComponent {

  constructor( public projectService : ProjectService, private router: Router, private _location: Location){
    this.router.events.subscribe((aa : any) => {
      if( aa instanceof ActivationEnd){
        this._location.go( "/" + this.projectService.dataProject.code + "/structure/" );
      }
    });
  }
}
