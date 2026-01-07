import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'refsetFilter'
})
export class RefsetFilterPipe implements PipeTransform {

    transform(items: any[], key: string): any {
        if (!items) {
            return [];
        }

        if (!key) {
            return items;
        }

        return items.filter(item => item.referenceSetType.pt.term.toLowerCase().includes(key));
    }

}
