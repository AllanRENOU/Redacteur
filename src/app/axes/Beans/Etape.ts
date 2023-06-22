import { Ordonable } from "src/app/Utils/Ordonable";

export class Etape extends Ordonable{
    
    title = "";
    content = "";
    idLigne = "";
    
    constructor( public id : string ){
        super();
    }
}