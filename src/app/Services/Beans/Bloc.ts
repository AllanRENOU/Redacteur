import { Ordonable } from "src/app/Utils/Ordonable";

export class Bloc extends Ordonable{
    
    title : string = "";
    content = "";
    childrens : string[] = [];

    constructor( private id : string ){
        super();
    }

    getId(){
        return this.id;
    }
}