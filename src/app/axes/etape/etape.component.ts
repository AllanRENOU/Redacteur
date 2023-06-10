import { Component, Input } from '@angular/core';
import { Etape } from '../Beans/Etape';
import { MenuItem } from 'src/app/Utils/float-menu/MenuItem';

@Component({
  selector: 'app-etape',
  templateUrl: './etape.component.html',
  styleUrls: ['./etape.component.scss']
})
export class EtapeComponent {

  @Input()
  etape? : Etape;

  MENU_MORE_VALUES = [
    MenuItem.UPDATE,
    MenuItem.UP,
    MenuItem.DOWN,
  ]

  showMoreMenu = false;

  constructor( ){

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
      }
    }
  }

}
