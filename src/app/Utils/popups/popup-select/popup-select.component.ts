import { Component, ComponentRef, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popup-select',
  templateUrl: './popup-select.component.html',
  styleUrls: ['./popup-select.component.scss']
})
export class PopupSelectComponent {

  @Input()
  title = "Sélectionner une valeur";

  @Input()
  values : {text : string, id : string}[] = [];

  @Input()
  comp? : ComponentRef<PopupSelectComponent>;

  @Output()
  onValueSelected : EventEmitter<string> = new EventEmitter();

  @ViewChild('btValidate')
  btValidate!: ElementRef;

  selectedValue : {text : string, id : string} | null = null;

  constructor( ){
    
    for( let i = 0; i < 20; i++ ){
      this.values.push( {text : "Valeur " + i, id : ""+i } );
    }

  }
  
  onSelectValue( value : {text : string, id : string}){
    this.selectedValue = value;
    console.log( "selectedValue ", this.selectedValue)
    if( this.btValidate ){
      (this.btValidate.nativeElement as HTMLElement).classList.remove( "disabled" );
    }
  }

  onValidate(){
    if( this.selectedValue ){
      this.onValueSelected.emit( this.selectedValue.id );
      this.close();
    }else{
      console.error( "Aucune valeur sélectionnée" );
    }
  }

  onCancel(){
    console.log( "onCancel ")
    this.close();
  }

  private close(){
    console.log( "close ");
    if( this.comp ){
      this.comp.destroy();
    }
  }
}
