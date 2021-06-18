import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'languageFilter'
})
export class LanguageFilterPipe implements PipeTransform {

  transform(items: any[], filter: any): any {
    //return list without filtering for incoming null values and default values
    if (!items || !filter || filter == 'Choose...') {
      return items;
    }
    //return filtered list for filtered language
    return items.filter(item =>
      item.movieLanguage == filter
    );
  }

}
