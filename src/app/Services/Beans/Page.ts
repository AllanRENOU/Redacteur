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
}