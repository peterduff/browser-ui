import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'mapRefsets'
})
export class MapRefsetsPipe implements PipeTransform {

    transform(items: any[]): any {
        if (!items) {
            return [];
        }

        return items.filter(item => item.additionalFields?.mapTarget);
    }

}
