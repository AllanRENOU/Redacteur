import { Component, Input } from '@angular/core';
import { Etape } from '../Beans/Etape';
import { MenuItem } from 'src/app/Utils/float-menu/MenuItem';
import { AxesService } from 'src/app/Services/axes.service';
import { Ordonable } from 'src/app/Utils/Ordonable';
import { Axe } from '../Beans/Axe';

@Component({
  selector: 'app-etape',
  templateUrl: './etape.component.html',
  styleUrls: ['./etape.component.scss']
})
export class EtapeComponent {

  @Input()
  etape? : Etape;

  @Input()
  axe? : Axe;

  MENU_MORE_VALUES = [
    MenuItem.UPDATE,
    MenuItem.UP,
    MenuItem.DOWN,
  ]

  showMoreMenu = false;

  constructor( private axesService : AxesService ){

  }

  showAllEtapeContent( event : MouseEvent){
    console.log( event.target );
    ( event.target as HTMLElement).parentElement?.classList.remove( "plie" );
  }

  // ========== Bouton More ==========
  onClickMore( event : any ){
    this.showMoreMenu = true;
    event.stopPropagation();
  }

  onHideMenu(){
    this.showMoreMenu = false;
  }

  onClickMenu(  item : MenuItem ){
    if( this.etape ){
      if( MenuItem.UPDATE == item ){
        this.etape.content = "Etape modifiée";
      
      }else if( MenuItem.UP == item ){

        if( this.axe ){
          let lastEtape = Ordonable.getPrevious( this.axe.getEtapes(), this.etape );
          if( lastEtape ){

            // Si le précédent est sur la même ligne, on descend la position
            if( lastEtape.idLigne == this.etape.idLigne ){
              
              Ordonable.down( this.axe.getEtapes(), this.etape );
              this.axe.refreshOrderEtapes();
              
            }else{

              // Sinon, on change le numéo de ligne
              let ligne = this.axesService.getLigne( this.etape.idLigne );
              if( ligne ){
                let lignePrev = Ordonable.getPrevious( this.axesService.getLignes(), ligne );

                if( lignePrev ){
                  this.etape.idLigne = lignePrev.id;
                }else{
                  console.error( "La ligne précédente de ", this.etape.idLigne, " n'est pas retrouvée" );
                }
              }else{
                console.error( "La ligne ", this.etape.idLigne, " n'est pas retrouvée" );
              }
            }

          }

        }
        

      }else if( MenuItem.DOWN == item ){
        
        if( this.axe ){
          let nextEtape = Ordonable.getNext( this.axe.getEtapes(), this.etape );
          if( nextEtape ){

            // Si le précédent est sur la même ligne, on descend la position
            if( nextEtape.idLigne == this.etape.idLigne ){
              
              Ordonable.up( this.axe.getEtapes(), this.etape );
              this.axe.refreshOrderEtapes();
              
            }else{

              // Sinon, on change le numéo de ligne
              let ligne = this.axesService.getLigne( this.etape.idLigne );
              if( ligne ){
                let ligneNext = Ordonable.getNext( this.axesService.getLignes(), ligne );

                if( ligneNext ){
                  this.etape.idLigne = ligneNext.id;
                }else{
                  console.error( "La ligne suivante de ", this.etape.idLigne, " n'est pas retrouvée" );
                }
              }else{
                console.error( "La ligne ", this.etape.idLigne, " n'est pas retrouvée" );
              }
            }

          }

        }
      }
    }
  }

}
