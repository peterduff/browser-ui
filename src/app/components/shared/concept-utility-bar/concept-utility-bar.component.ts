import {Component, EventEmitter, Output} from '@angular/core';
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

    conceptHistory!: Concept[];
    conceptHistorySubscription: Subscription;
    activeConcept!: Concept;
    activeConceptSubscription: Subscription;
    inferredView!: boolean;
    inferredViewSubscription: Subscription;

    @Output() emitter = new EventEmitter<any>();

    constructor(private conceptService: ConceptService,
                private membersService: MembersService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.inferredViewSubscription = this.conceptService.getInferredView().subscribe(data => this.inferredView = data);
        this.conceptHistorySubscription = this.conceptService.getConceptHistory().subscribe(data => this.conceptHistory = data);
    }

    setInferredView(inferredView: boolean): void {
        this.conceptService.setInferredView(inferredView);
        this.emitter.emit();
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }
}
