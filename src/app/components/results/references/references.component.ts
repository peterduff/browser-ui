import {Component, Input} from '@angular/core';
import {Concept} from "../../../models/concept";
import {Subscription} from "rxjs";
import {Reference} from "../../../models/reference";
import {ConceptService} from "../../../services/concept/concept.service";
import {ReferencesService} from "../../../services/references/references.service";

@Component({
    selector: 'app-references',
    templateUrl: './references.component.html',
    styleUrls: ['./references.component.scss']
})
export class ReferencesComponent {

    @Input() loading: boolean = true;

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    references!: Reference[]
    referencesSubscription: Subscription;
    conceptLoading!: boolean;
    conceptLoadingSubscription: Subscription;

    constructor(private conceptService: ConceptService,
                private referencesService: ReferencesService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.referencesSubscription = this.referencesService.getReferences().subscribe(data => this.references = data);
        this.conceptLoadingSubscription = this.conceptService.getConceptLoading().subscribe(data => this.conceptLoading = data);
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }
}
