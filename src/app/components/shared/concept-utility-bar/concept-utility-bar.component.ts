import { Component } from '@angular/core';
import {Concept} from "../../../models/concept";
import {Subscription} from "rxjs";
import {ConceptService} from "../../../services/concept/concept.service";
import {MembersService} from "../../../services/members/members.service";

@Component({
  selector: 'app-concept-utility-bar',
  templateUrl: './concept-utility-bar.component.html',
  styleUrls: ['./concept-utility-bar.component.scss']
})
export class ConceptUtilityBarComponent {

    activeConcept!: Concept;
    activeConceptSubscription: Subscription;
    inferredView!: boolean;
    inferredViewSubscription: Subscription;

    constructor(private conceptService: ConceptService,
                private membersService: MembersService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.inferredViewSubscription = this.conceptService.getInferredView().subscribe(data => this.inferredView = data);
    }

    setInferredView(inferredView: boolean): void {
        this.conceptService.setInferredView(inferredView);
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }
}
