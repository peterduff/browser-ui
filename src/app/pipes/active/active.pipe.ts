import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'active'
})
export class ActivePipe implements PipeTransform {

    transform(items: any[]): any {
        if (!items) {
            return [];
        }

        return items.filter(item => item.active);
    }

}
