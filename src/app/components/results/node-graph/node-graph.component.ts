import {Component, Input} from '@angular/core';
import {Concept} from "../../../models/concept";
import {forkJoin, Subscription} from "rxjs";
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
    activeChildren!: Concept[];
    activeChildrenSubscription: Subscription;
    activeParents!: Concept[];
    activeParentsSubscription: Subscription;
    inferredView!: boolean;
    inferredViewSubscription: Subscription;

    constructor(private conceptService: ConceptService) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.activeChildrenSubscription = this.conceptService.getActiveChildren().subscribe(data => this.activeChildren = data);
        this.activeParentsSubscription = this.conceptService.getActiveParents().subscribe(data => this.activeParents = data);
        this.inferredViewSubscription = this.conceptService.getInferredView().subscribe(data => this.inferredView = data);
    }

    chartClick(event: any): void {
        this.generateGraph(event.data.conceptId);
    }

    generateGraph(conceptId: string): void {
        forkJoin([
            this.conceptService.httpBrowserGetConcept(conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}),
            this.conceptService.httpGetChildren(conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}),
            this.conceptService.httpGetParents(conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'})
        ]).subscribe(([concept, children, parents]) => {
            this.conceptService.setActiveConcept(concept);
            this.conceptService.setActiveChildren(children);
            this.conceptService.setActiveParents(parents);

            this.options = {
                tooltip: {},
                legend: [
                    {
                        data: this.createGraphCategories().map(function (a: { name: string }) {
                            return a.name;
                        })
                    }
                ],
                animationDuration: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                        type: 'graph',
                        layout: 'none',
                        data: this.createGraphNodes(),
                        links: this.createGraphLinks(),
                        categories: this.createGraphCategories(),
                        roam: true,
                        label: {
                            show: true,
                            position: 'bottom',
                            formatter: '{b}'
                        },
                        labelLayout: {
                            hideOverlap: true
                        },
                        lineStyle: {
                            color: 'source',
                            curveness: 0.3
                        },
                        emphasis: {
                            focus: 'adjacency',
                            lineStyle: {
                                width: 10
                            }
                        }
                    }
                ]
            };
        });
    }

    createGraphNodes(): any {
        let nodes: any[] = [];

        nodes.push({
            id: "0",
            name: this.activeConcept?.pt?.term!,
            symbolSize: 40,
            x: 0,
            y: 0,
            value: this.activeChildren?.length,
            conceptId: this.activeConcept?.id,
            category: 0
        });

        if (this.activeParents) {
            this.activeParents.forEach((parent, index) => {
                nodes.push({
                    id: (index + 1).toString(),
                    name: parent?.pt?.term!,
                    symbolSize: 20,
                    x: this.randomIntFromInterval(-50, -200),
                    y: this.randomIntFromInterval(-200, 200),
                    value: parent.descendantCount,
                    conceptId: parent.id,
                    category: 1
                });
            });
        }

        if (this.activeChildren) {
            this.activeChildren.forEach((child, index) => {
                nodes.push({
                    id: (index + this.activeParents.length + 1).toString(),
                    name: child?.pt?.term!,
                    symbolSize: 20,
                    x: this.randomIntFromInterval(50, 200),
                    y: this.randomIntFromInterval(-200, 200),
                    value: child.descendantCount,
                    conceptId: child.id,
                    category: 2
                });
            });
        }

        return nodes;
    }

    createGraphLinks(): any {
        let links: any[] = [];

        if (this.activeParents) {
            this.activeParents.forEach((parent, index) => {
                links.push({
                    source: (index + 1).toString(),
                    target: "0",
                });
            });
        }

        if (this.activeChildren) {
            this.activeChildren.forEach((children, index) => {
                links.push({
                    source: "0",
                    target: (index + this.activeParents.length + 1).toString(),
                });
            });
        }

        return links;
    }

    createGraphCategories(): any {
        return [{name: "Concept"}, {name: "Parent"}, {name: "Child"}];
    }

    randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
