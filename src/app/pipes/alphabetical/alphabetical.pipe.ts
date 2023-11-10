import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'alphabetical'
})
export class AlphabeticalPipe implements PipeTransform {

    transform(items: any[], key: string, subKey?: string): any {
        if (!items) {
            return [];
        }

        if (subKey) {
            items = items.sort(function (a, b) {
                if (a[key][subKey] > b[key][subKey]) {
                    return 1;
                }

                if (a[key][subKey] < b[key][subKey]) {
                    return -1;
                }

                return 0;
            });
        } else {
            items = items.sort(function (a, b) {
                if (a[key] > b[key]) {
                    return 1;
                }

                if (a[key] < b[key]) {
                    return -1;
                }

                return 0;
            });
        }

        return items;
    }
}
