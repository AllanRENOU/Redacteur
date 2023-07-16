import { Component, Input } from '@angular/core';
import { Bloc } from 'src/app/Services/Beans/Bloc';
import { BlocsService } from 'src/app/Services/blocs.service';

@Component({
  selector: 'app-bloc',
  templateUrl: './bloc.component.html',
  styleUrls: ['./bloc.component.scss']
})
export class BlocComponent {

  protected _bloc? : Bloc;
  children : Bloc[] = [];
  @Input()
  set bloc ( bb: Bloc) {
    this._bloc=bb;
    this.blocService.getChildrenBlocs( bb.getId() ).subscribe( blocs => this.children = blocs );
  };

  constructor( private blocService : BlocsService ){
    
  }
}
