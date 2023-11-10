import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'refsetAlphabetical'
})
export class RefsetAlphabeticalPipe implements PipeTransform {

    transform(items: any[], key: string): any {
        if (!items) {
            return [];
        }

        items = items.sort(function (a, b) {
            if (a.referencedComponent[key].term > b.referencedComponent[key].term) {
                return 1;
            }

            if (a.referencedComponent[key].term < b.referencedComponent[key].term) {
                return -1;
            }

            return 0;
        });

        return items;
    }
}
