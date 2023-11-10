import {Component} from '@angular/core';
import {Concept} from "../../../models/concept";
import {ConceptService} from "../../../services/concept/concept.service";

@Component({
    selector: 'app-ecl',
    templateUrl: './ecl.component.html',
    styleUrls: ['./ecl.component.scss']
})
export class EclComponent {

    ecl: string = '<  404684003 | Clinical finding|  : \n' +
        '     116676008 | Associated morphology|  = \n' +
        '    <<  55641003 | Infarct|  OR \n' +
        '     42752001 | Due to|  = \n' +
        '    <<  22298006 | Myocardial infarction|';
    eclResults!: Concept[];
    filter: string = '';
    loading: boolean = false;

    constructor(private conceptService: ConceptService) {
    }

    executeEcl() {
        this.loading = true;
        this.conceptService.httpGetConcepts({ecl: this.ecl}).subscribe(data => {
            this.loading = false;
            this.eclResults = data
        });
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }
}
