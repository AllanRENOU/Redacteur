import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '../Services/project.service';
import { Page } from '../Services/Beans/Page';

@Pipe({
  name: 'autocompletion'
})
export class AutocompletionPipe implements PipeTransform {


  transform(pages : Page[], filter : string ): Page[] {
    console.log( filter )
    return pages.filter( (pp)=>{ return pp.id.indexOf( filter ) != -1 || pp.titre.indexOf( filter ) != -1; } );
  }

}
