import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortString'
})
export class SortStringPipe implements PipeTransform {

  transform(value: any): any {
    let x;
    if (value.length > 24) {
      x = value.substring(0, 24);

      return x + '...'
    }
    else {
      return value;
    }
  }

}
