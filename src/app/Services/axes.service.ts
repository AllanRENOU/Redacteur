import { Injectable } from '@angular/core';
import { Axe } from '../axes/Beans/Axe';

@Injectable({
  providedIn: 'root'
})
export class AxesService {

  private axes : Axe[] = [];

  constructor() { }

  public getAxes(){
    return this.axes;
  }
}
