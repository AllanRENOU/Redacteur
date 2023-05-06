import { Component } from '@angular/core';
import { ProjectService } from '../Services/project.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})

export class AccueilComponent {


  projects : { code:string, name:string, lettre:string, top:string, left:string, delay:number, opacity:number, color : string }[] = [];
  isLoaded = false;

  constructor( private projectService : ProjectService){

    projectService.getProjects().subscribe( ( data : { projects: { code:string, name:string }[] } ) =>{

      this.refresh( data.projects );

    });
  }

  addProject(){
    let name = prompt( "Saisir le titre du projet", "" );
    
    if( name ){

        this.projectService.createProject( name,  this.projectService.generateIdFromString( name ) ).subscribe( (res : { projects: { code:string, name:string }[] }) =>{
          this.refresh( res.projects );
        }, ( err : any)=>{
          console.error( "Erreur", err);
        });

      
    }else{
      console.error( "Nom invalide" );
    }
  }
  
  refresh( projects : { code:string, name:string }[] ){
    console.log ("Refresh", projects);
     /*
      data.projects.push( { code : "F1", name : "Fake 1"} );
      data.projects.push( { code : "F2", name : "Fake 2"} );
      data.projects.push( { code : "F3", name : "Fake 3"} );
      data.projects.push( { code : "F4", name : "Fake 4"} );
      data.projects.push( { code : "F5", name : "Fake 5"} );
      data.projects.push( { code : "F6", name : "Fake 6"} );
      data.projects.push( { code : "F7", name : "Fake 7"} );
      data.projects.push( { code : "F8", name : "Fake 8"} );
    */
   
    const BT_SIZE = "5rem";
    const OFFSET_DELAY = 1500;//temps transition bouton +
    const DELAY = 500;
    const COLORS = [ "red", "green", "orange", "yellow", "turquoise", "blue", "violet" ];
    this.projects = [];
    projects.forEach( (pp, ii) =>{

      let left = "calc( ( 100% - " + BT_SIZE + " ) * " + ( ( Math.cos( ii / projects.length * Math.PI * 2 ) ) + 1 ) / 2 + " )";
      let top = "calc( ( 100% - " + BT_SIZE + " ) * " + ( ( Math.sin( ii / projects.length * Math.PI * 2 ) ) + 1 ) / 2 + " )";
      
      this.projects.push( { 
        code : pp.code,
        name : pp.name,
        lettre : this.getLetter( pp.name ),
        top : top,
        left : left,
        delay : ( ii + 1 ) * DELAY + OFFSET_DELAY,
        opacity : 0,
        color : COLORS[ ii % COLORS.length ]
      } );
    });

    this.isLoaded = true

    this.projects.forEach( (project, index)=>{
      setTimeout(() => {
        project.opacity = 1;
      }, project.delay);
    } );
  }

  getLetter( name : string ) : string {
    name = name.toUpperCase();
    if( name.startsWith( "UN ") || name.startsWith( "LE ") || name.startsWith( "LA ") || name.startsWith( "L' ") ){
      return name[3];
    }else if( name.startsWith( "LES ") || name.startsWith( "UNE ") || name.startsWith( "DES ") ){
      return name[4];
    }else{
      return name[0];
    }
  }
}
