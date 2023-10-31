import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'alphabetical'
})
export class AlphabeticalPipe implements PipeTransform {

    transform(items: any[], key: string, subKey?: string, referencedComponent?: boolean): any {
        if (!items) {
            return [];
        }

        if (referencedComponent) {
            if (subKey) {
                items = items.sort(function (a, b) {
                    if (a.referencedComponent[key][subKey] > b.referencedComponent[key][subKey]) {
                        return 1;
                    }

                    if (a.referencedComponent[key][subKey] < b.referencedComponent[key][subKey]) {
                        return -1;
                    }

                    return 0;
                });
            } else {
                items = items.sort(function (a, b) {
                    if (a.referencedComponent[key] > b.referencedComponent[key]) {
                        return 1;
                    }

                    if (a.referencedComponent[key] < b.referencedComponent[key]) {
                        return -1;
                    }

                    return 0;
                });
            }
        } else {
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
        }

        return items;
    }
}
