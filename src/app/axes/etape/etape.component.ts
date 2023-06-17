import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  isUpdate = false;

  // Form
  nameEtape : string = "";
  contentEtape : string = "";

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
        //this.etape.content = "Etape modifiée";
        this.nameEtape = this.etape.title;
        this.contentEtape = this.etape.content;
        this.isUpdate = true;
        setTimeout( ()=>this.refreshHeight(), 100 );
      
      }else if( MenuItem.UP == item ){

        if( this.axe ){
          let prevEtape = Ordonable.getPrevious( this.axe.getEtapes(), this.etape );

          // Si le précédent est sur la même ligne, on descend la position
          if( prevEtape && prevEtape.idLigne == this.etape.idLigne ){
              
              Ordonable.down( this.axe.getEtapes(), this.etape );
              this.axe.refreshOrderEtapes();
              
          // Sinon, on change le numéo de ligne
          }else{

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
      }else if( MenuItem.DOWN == item ){
        
        if( this.axe ){
          let nextEtape = Ordonable.getNext( this.axe.getEtapes(), this.etape );


          // Si le précédent est sur la même ligne, on descend la position
          if( nextEtape && nextEtape.idLigne == this.etape.idLigne ){
              
            Ordonable.up( this.axe.getEtapes(), this.etape );
            this.axe.refreshOrderEtapes();
            
          // Sinon, on change le numéo de ligne
          }else{

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


  // ========== Update ==========

  onDescChanged( texte : string ){
    this.contentEtape = texte;
  }
  onClickLink( link : string ){
    console.log( "lien : ", link )
  }

  @ViewChild( 'textAreaContentEtape' ) textAreaContent?: ElementRef<HTMLElement>;
  onTextChanged(){
    this.refreshHeight();
  }

  private refreshHeight(){
    if( this.textAreaContent ){
      this.textAreaContent.nativeElement.style.height = "auto";
      this.textAreaContent.nativeElement.style.height = this.textAreaContent.nativeElement.scrollHeight + "px";
    }
  }

  onSubmit(){
    if( this.etape ){
      this.etape.title = this.nameEtape;
      this.etape.content = this.contentEtape;
      this.isUpdate = false;
    }
    
  }

}
