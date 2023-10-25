import {Component} from '@angular/core';
import {Concept} from "../../../models/concept";
import {Subscription} from "rxjs";
import {ConceptService} from "../../../services/concept/concept.service";
import {ReferenceSet} from "../../../models/referenceSet";
import {MembersService} from "../../../services/members/members.service";

@Component({
    selector: 'app-expression',
    templateUrl: './expression.component.html',
    styleUrls: ['./expression.component.scss']
})
export class ExpressionComponent {

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    owlExpressionSet!: ReferenceSet;
    owlExpressionSetSubscription: Subscription;

    constructor(private conceptService: ConceptService,
                private membersService: MembersService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.owlExpressionSetSubscription = this.membersService.getOwlExpressionSet().subscribe(data => this.owlExpressionSet = data);
    }

}
