import { Ordonable } from "src/app/Utils/Ordonable";

export class Ligne extends Ordonable{

    //etapes : Etape[] = [];
    nom = "";
    content = "";
    
    constructor( public id : string ){
        super();
    }
}