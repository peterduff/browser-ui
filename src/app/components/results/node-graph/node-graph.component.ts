import {Component, Input} from '@angular/core';
import {Concept} from "../../../models/concept";
import {Subscription} from "rxjs";
import {ConceptService} from "../../../services/concept/concept.service";

@Component({
    selector: 'app-node-graph',
    templateUrl: './node-graph.component.html',
    styleUrls: ['./node-graph.component.scss']
})
export class NodeGraphComponent {

    @Input() options: any;

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    constructor(private conceptService: ConceptService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
    }
}
