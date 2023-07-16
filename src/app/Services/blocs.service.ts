import { Injectable } from '@angular/core';
import { Bloc } from './Beans/Bloc';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class BlocsService {

  private blocs : Bloc[] = [];

  constructor( public projectService : ProjectService, private http: HttpClient ) { 
    this.initMocks();
  }

  private initMocks(){
    let b1 = new Bloc( "b01" );
    b1.title = "Bloc 1"
    b1.content = "Contenu du bloc 1"
    this.blocs.push( b1 );

    let b2 = new Bloc( "b02" );
    b2.title = "Bloc 2"
    b2.content = "Contenu du bloc 2"
    this.blocs.push( b2 );

    let b3 = new Bloc( "b03" );
    b3.title = "Bloc 3"
    b3.content = "Contenu du bloc 3"
    this.blocs.push( b3 );

  }

  getBlocs() : Observable<Bloc[]> {

    if( this.blocs.length == 0 ){
      let obs = this.http.get<any>( ProjectService.url + this.projectService.getProject().code + "/blocs" );
      obs.subscribe( ( blocs : Bloc[] ) =>{
        if( blocs ){
          this.blocs = blocs;
        }else{
          console.error( "Impossible de récupérer les blocs" );
        }
      });
      return obs;
    }else{
      return new Observable( obs => {
        obs.next( this.blocs );
        obs.complete();
      });
    }
  }

  getBloc( id : string ) : Observable<Bloc> {
    if( this.blocs.length == 0 ){
      return new Observable( obs => {
        this.getBlocs().subscribe( ( blocs : Bloc[])=>{
          obs.next( this.blocs.filter( bb=> bb.getId()==id )[0] );
        })
        obs.complete();
      });
      
    }else{
      return new Observable( obs => {
        obs.next( this.blocs.filter( bb=> bb.getId()==id )[0] );
        obs.complete();
      });
    }
  }
}
