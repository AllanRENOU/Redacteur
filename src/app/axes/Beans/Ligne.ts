import { Ordonable } from "src/app/Utils/Ordonable";

export class Ligne extends Ordonable{

    nom = "";
    content = "";
    
    constructor( public id : string ){
        super();
    }

    
    public static instanciate( obj : {id:string, isRemoved?:boolean, position?:number, nom?:string, content?:string} ) : Ligne {
        let ligne = new Ligne( obj.id );
        
        //axe.isRemoved = obj.isRemoved || false;
        ligne.position = obj.position || 0;
        ligne.nom = obj.nom || "Sans nom";
        ligne.content = obj.content || "";
        return ligne;
    }
}