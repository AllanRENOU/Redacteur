export class PageBloc{

    id : string;
    title : string;
    texte : string;
    position : number;

    constructor( title : string, texte : string, position : number ){
        this.id = new Date().getTime().toString();
        this.title = title;
        this.texte = texte;
        this.position = position;
    }
}