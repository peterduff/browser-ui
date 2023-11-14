import {Component, Input} from '@angular/core';
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

    @Input() mapsloading: boolean = true;
    @Input() refsetsloading: boolean = true;

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    referenceSets!: ReferenceSet[];
    referenceSetsSubscription: Subscription;
    mapConcepts!: Concept[];
    mapConceptsSubscription: Subscription;
    conceptLoading!: boolean;
    conceptLoadingSubscription: Subscription;

    constructor(private conceptService: ConceptService,
                private membersService: MembersService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.referenceSetsSubscription = this.membersService.getReferenceSets().subscribe(data => this.referenceSets = data);
        this.mapConceptsSubscription = this.conceptService.getMapConcepts().subscribe(data => this.mapConcepts = data);
        this.conceptLoadingSubscription = this.conceptService.getConceptLoading().subscribe(data => this.conceptLoading = data);
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
        console.log('concept: ', concept);
    }

    openUrl(id: string) {
        window.open('https://mapping.ihtsdotools.org/#/record/conceptId/' + id + '/autologin?refSetId=P447562003', '_blank');
    }

    findMapConcept(refsetId: string): Concept | undefined {
        return this.mapConcepts.find(concept => concept.id === refsetId);

    }
}
