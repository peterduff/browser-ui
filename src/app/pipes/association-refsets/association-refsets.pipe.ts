import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'associationRefsets'
})
export class AssociationRefsetsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
