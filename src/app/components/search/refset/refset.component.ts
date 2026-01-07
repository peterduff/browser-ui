import {Component} from '@angular/core';
import {ReferenceSet} from "../../../models/referenceSet";
import {Subscription} from "rxjs";
import {MembersService} from "../../../services/members/members.service";
import {Concept} from "../../../models/concept";
import {ConceptService} from "../../../services/concept/concept.service";

@Component({
    selector: 'app-refset',
    templateUrl: './refset.component.html',
    styleUrls: ['./refset.component.scss']
})
export class RefsetComponent {

    refsetFilter: string = '';

    members!: ReferenceSet[];
    membersSubscription: Subscription;
    memberCounts!: Object[];
    memberCountsSubscription: Subscription;

    constructor(private conceptService: ConceptService,
                private membersService: MembersService) {
        this.membersSubscription = this.membersService.getMembers().subscribe(data => this.members = Object.values(data));
        this.memberCountsSubscription = this.membersService.getMemberCounts().subscribe(data => this.memberCounts = data);
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }

    findCount(concept: any): any {
        return this.memberCounts[concept.conceptId];
    }
}
