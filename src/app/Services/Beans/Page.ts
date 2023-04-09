import { PageBloc } from "./Page.bloc";

export class Page{

    id : string;
    titre : string;
    description : string;
    blocs : PageBloc[] = [];

    constructor( id : string, titre : string, description : string ){
        this.id = id.replaceAll( " ", "" ).replaceAll( "'", "" );
        this.titre = titre;
        this.description = description;
    }

    addBloc( titre : string, texte : string ){
        this.blocs.push( new PageBloc( titre, texte, this.blocs.length ) );
    }

    monterBloc( blocAMonter : PageBloc ){
        
        if( blocAMonter.position > 0 ){
            let blocDessus = this.blocs.filter( bb => bb.position == blocAMonter.position-1 )[0];
            blocAMonter.position--;
            blocDessus.position++;
            this.refreshOrderBlocs();
            console.log( this.blocs );
        }else{
            console.log( "Le bloc est déjà en haut" );
        }

    }

    descendreBloc( blocADescendre : PageBloc ){

        if( blocADescendre.position < this.blocs.length - 1 ){
            let blocDessous = this.blocs.filter( bb => bb.position == blocADescendre.position+1 )[0];
            blocADescendre.position++;
            blocDessous.position--;
            this.refreshOrderBlocs();
            console.log( this.blocs );
        }else{
            console.log( "Le bloc est déjà en bas" );
        }
    }

    private refreshOrderBlocs(){
        this.blocs = this.blocs.sort( (b1, b2)=>{
            return b1.position - b2.position; 
        } );
    }
}