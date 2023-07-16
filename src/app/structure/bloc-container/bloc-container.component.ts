import { Component, Input } from '@angular/core';
import { Bloc } from 'src/app/Services/Beans/Bloc';
import { BlocsService } from 'src/app/Services/blocs.service';

@Component({
  selector: 'app-bloc-container',
  templateUrl: './bloc-container.component.html',
  styleUrls: ['./bloc-container.component.scss']
})
export class BlocContainerComponent {

  @Input()
  blocs : Bloc[] = []

  constructor( private blocService : BlocsService){

  }
}
