export class PageConteneur{

    id : string;
    titre : string;
    pages : string[] = [];
    subContainer : { position : number, id : string }[] = [];
    isRemoved = false;

    constructor( id : string, titre : string ){
        this.id = id;
        this.titre = titre;
    }

    removePage( idPage : string ) : boolean{
        let containPage = false;

        this.pages.forEach( ( id, index ) => {
            if( id == idPage ){
                containPage = true;
                this.pages.splice( index, 1 );
            }
        } );

        return containPage;
    }

    addSubContainer( cont : PageConteneur ){
        this.subContainer.push( { position : this.subContainer.length, id : cont.id } );
    }

    removeSubContainer( dossier : PageConteneur ){

        let posIdToRemove : { position : number, id : string } = { position : -1, id : "" };

        // Suppression du dossier fils
        this.subContainer.forEach( ( posId, index)=>{
            if( posId.id == dossier.id ){
                posIdToRemove = posId;
                this.subContainer.splice( index, 1 );
            }
        } );

        // Si dossier a été supprimé, on remonte ceux du dessous
        if( posIdToRemove.position != -1 ){

            this.subContainer
            .filter( posId => { return posId.position > posIdToRemove.position })
            .forEach( posId => { posId.position-- } )

            return true;
        }else{
            return false;
        }

    }

    monter( sousDossier : PageConteneur ){

        let scPos : { position : number, id : string } = { position : -1, id : "" };

        this.subContainer
        .filter( sc => { return sc.id == sousDossier.id } )
        .forEach( sc => {
            scPos = sc;
        });

        if( scPos.position != -1 ){
            if( scPos.position != 0 ){

                let tmp = this.subContainer
                .filter( sc => { return sc.position == scPos.position - 1 } );
                
                if( tmp.length == 1 ){
                    tmp[0].position++;
                    scPos.position--;

                }else{
                    console.error( tmp.length, " dossiers sont à la position ", ( scPos.position - 1 ) );
                }
            }else{
                console.log( "Le dossier est déjà en haut" );
            }
        }else{
            console.error( "Sous dossier introuvable" );
        }

        this.updateOrderSubFolder();
    }

    descendre( sousDossier : PageConteneur ){

        let scPos : { position : number, id : string } = { position : -1, id : "" };

        this.subContainer
        .filter( sc => { return sc.id == sousDossier.id } )
        .forEach( sc => {
            scPos = sc;
        });

        if( scPos.position != -1 ){
            if( scPos.position != this.subContainer.length - 1 ){

                let tmp = this.subContainer
                .filter( sc => { return sc.position == scPos.position + 1 } );
                
                if( tmp.length == 1 ){
                    tmp[0].position--;
                    scPos.position++;

                }else{
                    console.error( tmp.length, " dossiers sont à la position ", ( scPos.position + 1 ) );
                }
            }else{
                console.log( "Le dossier est déjà en bas" );
            }
        }else{
            console.error( "Sous dossier introuvable" );
        }

        this.updateOrderSubFolder();
        
    }

    private updateOrderSubFolder(){
        this.subContainer = this.subContainer.sort( (c1, c2) =>{
            if( c1.position > c2.position ){
                return 1;
            }else{
                return -1;
            }
        } );
        console.log( "New order ", this.subContainer );
    }
}