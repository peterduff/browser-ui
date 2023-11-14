import {Component, Input} from '@angular/core';
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

    @Input() loading: boolean = true;

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    conceptLoading!: boolean;
    conceptLoadingSubscription: Subscription;

    referenceSetMembers!: ReferenceSet[];
    referenceSetMembersSubscription: Subscription;

    constructor(private conceptService: ConceptService,
                private membersService: MembersService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.referenceSetMembersSubscription = this.membersService.getReferenceSetMembers().subscribe(data => this.referenceSetMembers = data);
        this.conceptLoadingSubscription = this.conceptService.getConceptLoading().subscribe(data => this.conceptLoading = data);
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }
}
