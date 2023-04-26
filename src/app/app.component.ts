import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { ProjectService } from './Services/project.service';
import { URL_PARAM_ID_PROJET, URL_PARAM_ID_FICHE } from './app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit{

  constructor( private projectService : ProjectService, private router: Router){
    this.router.events.subscribe((aa : any) => {
      if( aa instanceof ActivationEnd){
        let actEnd : ActivationEnd = aa;
        this.projectService.setProject( actEnd.snapshot.params[ URL_PARAM_ID_PROJET ]  )
        //console.log( "Url - projet : ", actEnd.snapshot.params[ URL_PARAM_ID_PROJET ] );
        //console.log( "Url - id page : ", actEnd.snapshot.params[ URL_PARAM_ID_FICHE ] );
      }

      /*
      if( aa instanceof NavigationEnd){
        console.log( "Url : ", aa.url)
      }*/

    });
  }
  
  ngOnInit(): void {
   
  }

  onUrlChanged( obj: any ){
    console.log( "url changed ", obj)
  }
}
