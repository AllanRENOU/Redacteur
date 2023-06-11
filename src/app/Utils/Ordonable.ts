export abstract class Ordonable{

    position : number = -1;

    public static addInArray<T extends Ordonable>( list : T[], obj : T ){
        
        if( list.length > 0 ){
            obj.position = list.map( oo => oo.position).sort( (o1, o2)=>o1<o2?1:-1 )[0] + 1;
        }else{
            obj.position = 0;
        }

        list.push( obj );
    }

    
    public static removeFromArray<T extends Ordonable>( list : T[], obj : T ){
        let i = list.indexOf( obj );

        if( i != -1 ){
            list.splice( i, 1 );

            list.forEach( e => {
                if( e.position > obj.position ){
                    e.position = e.position-1;
                }
            });
        }else{
            console.warn( "L'élément ", obj, " n'est pas dans la liste ", list );
        }

    }

    public static up<T extends Ordonable>( list : T[], obj : T ){
        let i = list.indexOf( obj );

        if( i != -1 ){
            if( obj.position < list.length - 1){
                list.forEach( oo => {
                    if( oo.position == obj.position + 1){
                        oo.position = oo.position -1;
                    }
                })
                obj.position++;
            }else{
                console.warn( "L'élément ", obj, " est déjà en bout de file ", list );
            }
        }else{
            console.warn( "L'élément ", obj, " n'est pas dans la liste ", list );
        }
    }
    
    public static down<T extends Ordonable>( list : T[], obj : T ){
        let i = list.indexOf( obj );

        if( i != -1 ){
            if( obj.position > 0 ){
                list.forEach( oo => {
                    if( oo.position == obj.position - 1){
                        oo.position = oo.position +1;
                    }
                })
                obj.position--;
            }else{
                console.warn( "L'élément ", obj, " est déjà en bout de file ", list );
            }
        }else{
            console.warn( "L'élément ", obj, " n'est pas dans la liste ", list );
        }
    }

    public static last<T extends Ordonable>( list : T[] ) : T | undefined{
        if( list && list.length > 0 ){
            return list.sort( (aa, bb) => aa.position > bb.position ? 1 : -1 )[ list.length - 1 ];
        }else{
            return undefined;
        }
    }

    public static first<T extends Ordonable>( list : T[] ) : T | undefined{
        if( list && list.length > 0 ){
            return list.sort( (aa, bb) => aa.position > bb.position ? 1 : -1 )[ 0 ];
        }else{
            return undefined;
        }
    }
}