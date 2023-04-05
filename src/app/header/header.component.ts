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

  constructor( private projectService : ProjectService, private router: Router){
    this.title = projectService.name;

    this.router.events.subscribe((aa : any) => {
      if( aa instanceof NavigationEnd){
        console.log( "Url : ", aa.url)
      }
    });


  }

  onUrlChanged( obj: any ){
    console.log( "url changed ", obj)
  }

}
