import { Component } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { ProjectService } from '../Services/project.service';
import { Location } from '@angular/common';
import { BlocsService } from '../Services/blocs.service';
import { Bloc } from '../Services/Beans/Bloc';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss']
})
export class StructureComponent {

  public rootBlocs : Bloc[] = [];

  constructor( public projectService : ProjectService, private router: Router, private _location: Location, public blocService : BlocsService){
    this.router.events.subscribe((aa : any) => {
      if( aa instanceof ActivationEnd){
        this._location.go( "/" + this.projectService.dataProject.code + "/structure/" );
      }
    });

    this.blocService.getChildrenBlocs( undefined ).subscribe( blocs => this.rootBlocs = blocs );
  }
}
