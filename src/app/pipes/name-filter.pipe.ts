import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameFilter'
})
export class NameFilterPipe implements PipeTransform {

//this pipe accepting movieList and movieName
  transform(movieListToBeFilter: any[], nameFilter: any): any {
    //null values check and return lis without filtering
    if (!movieListToBeFilter || !nameFilter) {
      return movieListToBeFilter;
    }
    //return filtered list for entered name
    return movieListToBeFilter.filter(item=>
      item.movieName.toLowerCase().includes(nameFilter.toString().toLowerCase())
    );
  }

}
