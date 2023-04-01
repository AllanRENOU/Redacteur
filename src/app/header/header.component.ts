import { Component } from '@angular/core';
import { ProjectService } from '../Services/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  title :string = "Rédacteur";

  constructor( private projectService : ProjectService ){
    this.title = projectService.name;
  }

}
