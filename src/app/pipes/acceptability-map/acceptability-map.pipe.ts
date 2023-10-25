import {Pipe, PipeTransform} from '@angular/core';
import {Description} from "../../models/concept";

@Pipe({
    name: 'acceptabilityMap'
})
export class AcceptabilityMapPipe implements PipeTransform {

    transform(items: any[], key: any): any {
        if (!items) {
            return [];
        }

        // @ts-ignore
        items = items.filter((item: Description) => item.acceptabilityMap[key]);

        return items;
    }

}
