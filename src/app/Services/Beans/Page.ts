export class Page{

    id : string;
    titre : string;
    description : string;
    blocs : { title : string, texte : string}[] = [];

    constructor( id : string, titre : string, description : string ){
        this.id = id.replaceAll( " ", "" ).replaceAll( "'", "" );
        this.titre = titre;
        this.description = description;
    }

    addBloc( titre : string, texte : string ){
        this.blocs.push( { title : titre, texte : texte } );
    }
}