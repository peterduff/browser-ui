import {Component} from '@angular/core';
import {Subscription} from "rxjs";
import {Concept, Relationship} from "../../../models/concept";
import {ConceptService} from "../../../services/concept/concept.service";
import {ClipboardService} from "ngx-clipboard";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    activeChildren!: Concept[];
    activeChildrenSubscription: Subscription;
    activeParents!: Concept[];
    activeParentsSubscription: Subscription;
    inferredView!: boolean;
    inferredViewSubscription: Subscription;
    favourites!: Concept[];
    favouritesSubscription: Subscription;

    constructor(private conceptService: ConceptService,
                public clipboardService: ClipboardService,
                private toastr: ToastrService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.activeChildrenSubscription = this.conceptService.getActiveChildren().subscribe(data => this.activeChildren = data);
        this.activeParentsSubscription = this.conceptService.getActiveParents().subscribe(data => this.activeParents = data);
        this.inferredViewSubscription = this.conceptService.getInferredView().subscribe(data => this.inferredView = data);
        this.favouritesSubscription = this.conceptService.getFavourites().subscribe(data => this.favourites = data);
    }

    formatRelationships(relationships: Relationship[]) {
        // relationships = relationships.filter(item => item.groupId !== 0);
        relationships = relationships.filter(item => item.type.id !== '116680003');
        relationships = relationships.sort((a,b) => (a.groupId > b.groupId) ? 1 : ((b.groupId > a.groupId) ? -1 : 0));

        let response: any[] = [];
        let group: any[] = [];
        let counter: number = relationships[0]?.groupId;

        relationships.forEach((relationship) => {
            if (relationship.groupId === counter) {
                group.push(relationship);
            } else {
                response.push({groups: group, groupId: counter});
                group = [];
                group.push(relationship);
                counter++;
            }
        });

        response.push({groups: group, groupId: counter});

        return response;
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }

    addToFavourites(concept: Concept) {
        if (!this.favourites) {
            this.favourites = [];
        }

        this.favourites.push(concept);
        this.conceptService.setFavourites(this.favourites);
    }

    copyUrl(): void {
        this.clipboardService.copy(window.location.href);
        this.copySuccess();
    }

    copySuccess(): void {
        this.toastr.success('Copied to clipboard', 'SUCCESS');
    }
}
