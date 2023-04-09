import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '../Services/project.service';

@Pipe({
  name: 'idTransform'
})
export class IdTransformPipe implements PipeTransform {


    constructor( private projectService : ProjectService ){
        
    }

  transform(value: string): string {

    return this.projectService.generateIdFromString( value );

  }
}