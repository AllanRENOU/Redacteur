import { Ordonable } from "src/app/Utils/Ordonable";
import { Etape } from "./Etape";

export class Axe extends Ordonable{

    private etapes : Etape[] = [];
    public isRemoved = false;

    constructor( public id : string, public nom : string ){
        super();
    }

    addEtape( etape : Etape ){
        Ordonable.addInArray( this.etapes, etape );
    }

    removeEtape( etape : Etape ){
        Ordonable.removeFromArray( this.etapes, etape );
    }

    setEtapes( etapes : Etape[] ){
        this.etapes = etapes;
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

    public static instanciate( obj : {id:string, nom : string, isRemoved?:boolean, position?:number} ) : Axe {
        let axe = new Axe( obj.id, obj.nom );
        //if( "isRemoved" in obj ){
            axe.isRemoved = obj.isRemoved || false;
        //}
        axe.position = obj.position || 0;
        return axe;
    }

}