import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'descriptions'
})
export class DescriptionsPipe implements PipeTransform {

    transform(items: any[], key: any): any {
        if (!items) {
            return [];
        }

        items = items.sort(function (a, b) {
            if (a.type > b.type) {
                return 1;
            }

            if (a.type < b.type) {
                return -1;
            }

            return 0;
        });

        items = items.sort(function (a, b) {
            if (a.acceptabilityMap[key] > b.acceptabilityMap[key]) {
                return -1;
            }

            if (a.acceptabilityMap[key] < b.acceptabilityMap[key]) {
                return 1;
            }

            return 0;
        });

        return items;
    }
}
