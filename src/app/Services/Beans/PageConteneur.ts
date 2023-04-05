export class PageConteneur{

    id : string;
    titre : string;
    pages : string[] = [];
    subContainer : string[] = [];

    constructor( id : string, titre : string ){
        this.id = id;
        this.titre = titre;
    }
}