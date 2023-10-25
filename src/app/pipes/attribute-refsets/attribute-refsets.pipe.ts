import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attributeRefsets'
})
export class AttributeRefsetsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
