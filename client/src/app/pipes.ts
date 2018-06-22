import { Pipe, PipeTransform } from '@angular/core';
declare var jQuery:any;

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any, filter: any): any {
      if (filter && Array.isArray(items)) {
          let filterKeys = Object.keys(filter);
          return items.filter(function(item){
                                var cond = false;
                                jQuery.each(filterKeys,function(i,v){
                                                           if(filter[v])
                                                              cond = cond || (item[v].toLowerCase().indexOf(filter[v].toLowerCase()) !== -1 );
                                                           else
                                                              cond = true;
                                                  });                                                 
								return  cond;                                                 
                               });
      } else {
          return items;
      }
    }
}
 
@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
    transform(items: any[], sortedBy: string): any {
        console.log('sortedBy', sortedBy);
       
        return items.sort((a, b) => {return b[sortedBy] - a[sortedBy]});
    }
}