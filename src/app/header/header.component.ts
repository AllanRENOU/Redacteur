import { Component } from '@angular/core';
import { ProjectService } from '../Services/project.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  title : string = "Rédacteur";

  constructor( public projectService : ProjectService){
    this.title = projectService.name;
  }


}
