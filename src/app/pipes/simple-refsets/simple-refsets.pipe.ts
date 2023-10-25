import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'simpleRefsets'
})
export class SimpleRefsetsPipe implements PipeTransform {

    transform(items: any[]): any {
        if (!items) {
            return [];
        }

        return items.filter(item => !Object.keys(item.additionalFields).length);
    }

}
