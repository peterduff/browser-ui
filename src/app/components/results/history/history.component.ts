import { Component } from '@angular/core';
import {Concept} from "../../../models/concept";
import {Subscription} from "rxjs";
import {ConceptService} from "../../../services/concept/concept.service";
import {HistoryService} from "../../../services/history/history.service";
import {History} from "../../../models/history";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    history!: History[];
    historySubscription: Subscription;

    constructor(private conceptService: ConceptService,
                private historyService: HistoryService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.historySubscription = this.historyService.getHistory().subscribe(data => this.history = data);
    }

    formatEffectiveTime(effectiveTime: string): string {
        return effectiveTime.substring(0, 4) + '-' + effectiveTime.substring(4, 6) + '-' + effectiveTime.substring(6, 8);
    }
}
