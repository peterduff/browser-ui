import { Component } from '@angular/core';
import {Concept} from "../../../models/concept";
import {Subscription} from "rxjs";
import {ReferenceSet} from "../../../models/referenceSet";
import {ConceptService} from "../../../services/concept/concept.service";
import {MembersService} from "../../../services/members/members.service";

@Component({
  selector: 'app-refsets',
  templateUrl: './refsets.component.html',
  styleUrls: ['./refsets.component.scss']
})
export class RefsetsComponent {

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    referenceSets!: ReferenceSet[];
    referenceSetsSubscription: Subscription;
    mapConcepts!: Concept[];
    mapConceptsSubscription: Subscription;

    constructor(private conceptService: ConceptService,
                private membersService: MembersService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.referenceSetsSubscription = this.membersService.getReferenceSets().subscribe(data => this.referenceSets = data);
        this.mapConceptsSubscription = this.conceptService.getMapConcepts().subscribe(data => this.mapConcepts = data);
    }

    openUrl(id: string) {
        window.open('https://mapping.ihtsdotools.org/#/record/conceptId/' + id + '/autologin?refSetId=P447562003', '_blank');
    }

    findMapName(refsetId: string): string | undefined {
        return this.mapConcepts.find(concept => concept.id === refsetId)?.pt?.term;
    }
}
