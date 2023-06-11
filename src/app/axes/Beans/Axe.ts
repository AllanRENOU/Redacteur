import { Ordonable } from "src/app/Utils/Ordonable";
import { Etape } from "./Etape";

export class Axe extends Ordonable{

    private etapes : Etape[] = [];

    constructor( public id : string, public nom : String ){
        super();
    }

    addEtape( etape : Etape ){
        Ordonable.addInArray( this.etapes, etape );
    }

    removeEtape( etape : Etape ){
        Ordonable.removeFromArray( this.etapes, etape );
    }

    getEtapesOfLine( idLigne : string) : Etape[]{
        return this.etapes.filter( e => e.idLigne == idLigne );
    }

    getEtapes() : Etape[]{
        return this.etapes;
    }

    refreshOrderEtapes(){
        this.etapes = Ordonable.sortArray( this.etapes );
    }

}