import { Injectable } from '@angular/core';
import { Bloc } from './Beans/Bloc';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from './project.service';

const ID_ROOT_CONTAINER = "ROOT";

@Injectable({
  providedIn: 'root'
})
export class BlocsService {

  private allBlocs : Bloc[] = [];
  private childBlocs : Map<string, Bloc[]> = new Map();

  constructor( public projectService : ProjectService, private http: HttpClient ) { 
    this.initMocks();
  }

  private initMocks(){
    let b1 = new Bloc( "b01" );
    b1.title = "Bloc 1"
    b1.content = "Contenu du bloc 1"

    let b11 = new Bloc( "b1-1" );
    b11.title = "Bloc 1 - 1"
    b11.content = "Contenu du bloc 1 - 1"
    this.childBlocs.set( b1.getId(), [ b11 ] );

    let b2 = new Bloc( "b02" );
    b2.title = "Bloc 2"
    b2.content = "Contenu du bloc 2"

    let b3 = new Bloc( "b03" );
    b3.title = "Bloc 3"
    b3.content = "Contenu du bloc 3"

    this.childBlocs.set( ID_ROOT_CONTAINER, [ b1, b2, b3 ] );
    this.addBlocsSync( [ b1, b2, b3, b11 ] )

  }

  getChildrenBlocs( parentId : string | undefined ) : Observable<Bloc[]> {

    let id : string = "";
    if( parentId ){
      id = parentId;
    }else{
      id = ID_ROOT_CONTAINER;
    }


    if( !this.childBlocs.has( id ) ){
      let obs = this.http.post<any>( ProjectService.url + this.projectService.getProject().code + "/blocs", this.getBlocSync( id ).childrens );
      obs.subscribe( ( blocs : Bloc[] ) =>{
        if( blocs ){
          this.addBlocsSync( blocs );
          this.childBlocs.set( id, blocs );
        }else{
          console.error( "Impossible de récupérer les blocs" );
        }
      });
      return obs;
    }else{
      return new Observable( obs => {
        obs.next(  this.childBlocs.get( id ) );
        obs.complete();
      });
    }
  }

  getBloc( id : string ) : Observable<Bloc> {

    let bloc = this.getBlocSync( id );


    if( bloc ){
      return new Observable( obs => {
        obs.next( bloc );
        obs.complete();
      });
      
    }else{
      return new Observable( obs => {
        this.http.get<any>( ProjectService.url + this.projectService.getProject().code + "/blocs/" + id )
        .subscribe( ( newBloc : Bloc)=>{
          this.addBlocSync( newBloc );
          obs.next( newBloc );
          obs.complete();
        })
      });
    }
  }
  
/*
  getBlocsFromList( ids : string[] ) : Observable<Bloc[]> {



    if( this.blocs.length == 0 ){
      return new Observable( obs => {
        this.getBlocs().subscribe( ( blocs : Bloc[])=>{
          obs.next( this.getBlocsSync(ids) );
          obs.complete();
        })
      });
      
    }else{
      return new Observable( obs => {
        obs.next( this.getBlocsSync(ids) );
        obs.complete();
      });
    }
  }*/

  private getBlocSync(  id : string ) : Bloc{
    return this.allBlocs.filter( bb => id == bb.getId() )[0];
  }

  private getBlocsSync(  ids : string[] ) : Bloc[]{
    return this.allBlocs.filter( bb => ids.indexOf( bb.getId() ) != -1  );
  }

  private addBlocSync( bloc : Bloc ){
    let currentBloc = this.getBlocSync( bloc.getId() );

    if( !currentBloc ){
      this.allBlocs.push( bloc );
    }
  }

  private addBlocsSync( blocs : Bloc[]){

    let loadedBlocIds = this.getBlocsSync( blocs.map( bb =>bb.getId())).map( bb => bb.getId() );

    if( loadedBlocIds.length != blocs.length ){
      blocs.forEach( bb => {
        if( loadedBlocIds.indexOf( bb.getId() ) == -1 ){
          this.allBlocs.push( bb );
        }
      } );
    }
  }
}
