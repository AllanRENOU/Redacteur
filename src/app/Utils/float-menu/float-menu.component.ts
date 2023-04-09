import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MenuItem } from './MenuItem';

@Component({
  selector: 'app-float-menu',
  templateUrl: './float-menu.component.html',
  styleUrls: ['./float-menu.component.scss']
})
export class FloatMenuComponent {

  private isClickIn : boolean = false;

  @Input()
  values:MenuItem[] = [];

  @Output() 
  toHide = new EventEmitter<boolean>();
  
  @Output() 
  onClick = new EventEmitter<MenuItem>();
  
  constructor( ){

  }


  @HostListener('click')
  clickOut(){
    this.isClickIn = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.isClickIn) {
      this.notifyCloseMenu();
    }
    this.isClickIn = false;
  }

  notifyCloseMenu(){
    this.toHide.emit(true);
  }

  onClickItem( $event : any , item : MenuItem ){
    $event.stopPropagation();
    this.onClick.emit(item);
    this.notifyCloseMenu();
  }

}
