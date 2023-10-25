import { Component } from '@angular/core';
import {Concept, Description} from "../../../models/concept";
import {Subscription} from "rxjs";
import {ConceptService} from "../../../services/concept/concept.service";
import {MembersService} from "../../../services/members/members.service";
import {ReferenceSet} from "../../../models/referenceSet";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    activeChildren!: Concept[];
    activeChildrenSubscription: Subscription;
    activeParents!: Concept[];
    activeParentsSubscription: Subscription;
    inferredView!: boolean;
    inferredViewSubscription: Subscription;
    referenceSets!: ReferenceSet[];
    referenceSetsSubscription: Subscription;

    constructor(private conceptService: ConceptService,
                private membersService: MembersService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.activeChildrenSubscription = this.conceptService.getActiveChildren().subscribe(data => this.activeChildren = data);
        this.activeParentsSubscription = this.conceptService.getActiveParents().subscribe(data => this.activeParents = data);
        this.inferredViewSubscription = this.conceptService.getInferredView().subscribe(data => this.inferredView = data);
        this.referenceSetsSubscription = this.membersService.getReferenceSets().subscribe(data => this.referenceSets = data);
    }

    calculateMaps(concept: Concept): any {
        let maps: any = {};

        concept.descriptions?.forEach(description => {
            maps = { ...maps, ...description.acceptabilityMap}
        });

        return maps;
    }

    findMap(key: any): any {
        return this.referenceSets[key];
    }

    getAcceptability(description: Description, acceptabilityId: any): any {
        return description.acceptabilityMap[acceptabilityId];
    }
}
