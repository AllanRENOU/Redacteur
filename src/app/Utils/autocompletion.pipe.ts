import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '../Services/project.service';
import { Page } from '../Services/Beans/Page';

@Pipe({
  name: 'autocompletion'
})
export class AutocompletionPipe implements PipeTransform {


  transform(pages : Page[], filter : string ): Page[] {
    console.log( filter )
    filter = filter.toUpperCase();
    return pages.filter( (pp)=>{ return pp.id.toUpperCase().indexOf( filter ) != -1 || pp.titre.toUpperCase().indexOf( filter ) != -1; } );
  }

}
