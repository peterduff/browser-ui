import {Component, OnInit} from '@angular/core';
import {Concept} from "../../../models/concept";
import {Subscription} from "rxjs";
import {TaxonomyService} from "../../../services/taxonomy/taxonomy.service";
import {ConceptService} from "../../../services/concept/concept.service";

@Component({
    selector: 'app-taxonomy',
    templateUrl: './taxonomy.component.html',
    styleUrls: ['./taxonomy.component.scss']
})
export class TaxonomyComponent implements OnInit {

    view: boolean = true;
    count: boolean = false;
    recentSearches: Concept[] = [];

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;

    taxonomyParents!: Concept[];
    taxonomyParentsSubscription: Subscription;
    taxonomyConcept!: Concept;
    taxonomyConceptSubscription: Subscription;

    constructor(private taxonomyService: TaxonomyService,
                private conceptService: ConceptService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.taxonomyParentsSubscription = this.taxonomyService.getTaxonomyParents().subscribe(data => this.taxonomyParents = data);
        this.taxonomyConceptSubscription = this.taxonomyService.getTaxonomyConcept().subscribe(data => this.taxonomyConcept = data);
    }

    ngOnInit() {

    }

    findConcept(concept: Concept): void {
        if (!this.recentSearches.find(c => c.conceptId === concept.conceptId)) {
            this.recentSearches.push(concept);
        }
        this.conceptService.findConcept(concept);
    }

    findParents(concept: Concept) {
        this.taxonomyService.httpGetTaxonomyParents(concept.conceptId, {descendantCountForm: this.view ? 'inferred' : 'stated'}).subscribe(parents => {
            this.taxonomyService.setTaxonomyParents(parents);
        });

        this.taxonomyService.httpGetTaxonomyConcept(concept.conceptId, {descendantCountForm: this.view ? 'inferred' : 'stated'}).subscribe(concept => {
            concept.expanded = true;

            this.taxonomyService.httpGetTaxonomyChildren(concept.conceptId, {descendantCountForm: this.view ? 'inferred' : 'stated'}).subscribe(children => {
                concept.children = children;
                this.taxonomyService.setTaxonomyConcept(concept);
            });
        });
    }
}
