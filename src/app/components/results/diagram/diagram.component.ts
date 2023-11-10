import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Concept} from "../../../models/concept";
import {Subscription} from "rxjs";
import {ConceptService} from "../../../services/concept/concept.service";
declare function drawConceptDiagram(concept: Concept, id: string, options: any, panel: any): void;
import {Codesystem} from "../../../models/codesystem";
import {PathingService} from "../../../services/pathing/pathing.service";
import {DiagramService} from "../../../services/diagram/diagram.service";

@Component({
    selector: 'app-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterViewInit {

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    activeCodesystem!: Codesystem;
    activeCodesystemSubscription: Subscription;
    options!: any;
    optionsSubscription: Subscription;

    @ViewChild("conceptDiagram") conceptDiagram!: ElementRef;

    constructor(private conceptService: ConceptService,
                private pathingService: PathingService,
                private diagramService: DiagramService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.optionsSubscription = this.diagramService.getOptions().subscribe(data => this.options = data);
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
    }

    ngAfterViewInit() {
        // this.renderDiagram();
    }

    renderDiagram(): void {
        console.log('rendering func');
        this.options.edition = this.activeCodesystem.branchPath;

        drawConceptDiagram(this.activeConcept!, 'concept-diagram', this.options, {});
    }
}
