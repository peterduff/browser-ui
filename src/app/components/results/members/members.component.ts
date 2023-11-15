import {Component} from '@angular/core';
import {Concept} from "../../../models/concept";
import {Subscription} from "rxjs";
import {ConceptService} from "../../../services/concept/concept.service";
import {MembersService} from "../../../services/members/members.service";
import {ReferenceSet} from "../../../models/referenceSet";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent {

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;

    referenceSetMembers!: ReferenceSet[];
    referenceSetMembersSubscription: Subscription;

    constructor(private conceptService: ConceptService,
                private membersService: MembersService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.referenceSetMembersSubscription = this.membersService.getReferenceSetMembers().subscribe(data => this.referenceSetMembers = data);
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }
}
