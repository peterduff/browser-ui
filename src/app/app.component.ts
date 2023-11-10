import {Component, Inject, OnInit} from '@angular/core';
import {PathingService} from "./services/pathing/pathing.service";
import {AuthenticationService} from "./services/authentication/authentication.service";
import {AuthoringService} from "./services/authoring/authoring.service";
import {DOCUMENT} from "@angular/common";
import {ConceptService} from "./services/concept/concept.service";
import {MembersService} from "./services/members/members.service";
import {HistoryService} from "./services/history/history.service";
import {ReferencesService} from "./services/references/references.service";
import {Concept} from "./models/concept";
import {map, Observable, Subscription} from "rxjs";
import {ReferenceSet} from "./models/referenceSet";
import {TaxonomyService} from "./services/taxonomy/taxonomy.service";
import {DiagramComponent} from "./components/results/diagram/diagram.component";
import {EChartsOption} from "echarts";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [DiagramComponent]
})
export class AppComponent implements OnInit {

    environment!: string;
    loading: boolean = true;

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    inferredView!: boolean;
    inferredViewSubscription: Subscription;
    taxonomyConcept!: Concept;
    taxonomyConceptSubscription: Subscription;

    options!: Observable<EChartsOption>;

    constructor(private authenticationService: AuthenticationService,
                private authoringService: AuthoringService,
                private pathingService: PathingService,
                private conceptService: ConceptService,
                private taxonomyService: TaxonomyService,
                private membersService: MembersService,
                private historyService: HistoryService,
                private referencesService: ReferencesService,
                private diagramComponent: DiagramComponent,
                private http: HttpClient,
                @Inject(DOCUMENT) private document: Document) {
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.inferredViewSubscription = this.conceptService.getInferredView().subscribe(data => this.inferredView = data);
        this.taxonomyConceptSubscription = this.taxonomyService.getTaxonomyConcept().subscribe(data => this.taxonomyConcept = data);
    }

    ngOnInit() {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];

        this.conceptService.setFavourites(JSON.parse(localStorage.getItem('favourites')!));

        this.assignFavicon();
    }

    onSearchTabSwitch(index: number) {
        switch(index) {
            case 0:
                this.setupSearchTab();
                return;
            case 1:
                this.setTaxonomyTab();
                return;
            case 2:
                this.setupEclTab();
                return;
            case 3:
                this.setupFavouritesTab();
                return;
            case 4:
                this.setupRefsetTab();
                return;
        }
    }

    setupSearchTab() {
        console.log('setupSearchTab');
    }

    setTaxonomyTab() {
        console.log('setTaxonomyTab');

        if (this.activeConcept) {
            this.taxonomyService.findConcept(this.activeConcept, true);
        } else {
            this.taxonomyService.findConcept({conceptId: '138875005'}, true);
        }

        // if (this.activeConcept) {
        //     this.taxonomyService.httpGetTaxonomyParents(this.activeConcept.conceptId, {descendantCountForm: 'inferred'}).subscribe(data => {
        //         this.taxonomyService.setTaxonomyParents(data);
        //     });
        //
        //     this.taxonomyService.httpGetTaxonomyConcept(this.activeConcept.conceptId, {descendantCountForm: 'inferred'}).subscribe(data => {
        //         this.taxonomyService.setTaxonomyConcept(data);
        //     });
        // }
    }

    setupEclTab() {
        console.log('setupEclTab');
    }

    setupFavouritesTab() {
        console.log('setupFavouritesTab');
    }

    setupRefsetTab() {
        console.log('setupRefsetTab');
    }

    onResultsTabSwitch(index: number) {
        switch(index) {
            case 0:
                this.setupSummaryTab();
                return;
            case 1:
                this.setupDetailsTab();
                return;
            case 2:
                this.setupDiagramTab();
                return;
            case 3:
                this.setupExpressionTab();
                return;
            case 4:
                this.setupRefsetsTab();
                return;
            case 5:
                this.setupMembersTab();
                return;
            case 6:
                this.setupHistoryTab();
                return;
            case 7:
                this.setupReferencesTab();
                return;
            case 8:
                this.setupNodeTab();
                return;
        }
    }

    setupSummaryTab() {
        if (this.activeConcept) {
            this.conceptService.httpGetChildren(this.activeConcept.conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}).subscribe(data => {
                this.conceptService.setActiveChildren(data);
            });
            this.conceptService.httpGetParents(this.activeConcept.conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}).subscribe(data => {
                this.conceptService.setActiveParents(data);
            });
        }
    }

    setupDetailsTab() {
    }

    setupDiagramTab() {
        console.log('setupDiagramTab');
        this.diagramComponent.renderDiagram();
    }

    setupExpressionTab() {
        this.membersService.setOwlExpressionSet(undefined!);

        if (this.activeConcept) {
            this.membersService.httpGetOwlExpression(this.activeConcept.conceptId).subscribe(data => {
                this.membersService.setOwlExpressionSet(data);
            });
        }
    }

    setupRefsetsTab() {
        this.membersService.setReferenceSets([]);
        this.conceptService.setMapConcepts([]);

        if (this.activeConcept) {
            this.membersService.httpGetReferenceSets(this.activeConcept.conceptId).subscribe(data => {
                this.membersService.setReferenceSets(data);
                this.findMapConcepts(data);
            });
        }
    }

    setupMembersTab() {
    }

    setupHistoryTab() {
        this.historyService.setHistory([]);

        if (this.activeConcept) {
            this.historyService.httpGetHistory(this.activeConcept.conceptId).subscribe(data => {
                this.historyService.setHistory(data);
            });
        }
    }

    setupReferencesTab() {
        this.referencesService.setReferences([]);

        if (this.activeConcept) {
            this.referencesService.httpGetReferences(this.activeConcept.conceptId, this.inferredView).subscribe(data => {
                this.referencesService.setReferences(data);
            });
        }
    }

    setupNodeTab() {
        console.log('setupNodeTab');

        this.options = this.http.get<any>('assets/les-miserables.json', { responseType: 'json' }).pipe(
            map((graph) => ({
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove',
                },
                legend: [
                    {
                        // selectedMode: 'single',
                        data: graph.categories.map(function (a: { name: string }) {
                            return a.name;
                        })
                    }
                ],
                animationDuration: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                        name: 'Les Miserables',
                        type: 'graph',
                        layout: 'none',
                        data: graph.nodes,
                        links: graph.links,
                        categories: graph.categories,
                        roam: true,
                        label: {
                            position: 'right',
                            formatter: '{b}'
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
            }))
        );
    }

    findMapConcepts(data: ReferenceSet[]) {

        let ids: string[] = [];
        let results: Concept[] = [];

        data.forEach((referenceSet: ReferenceSet) => {
            if (!ids.includes(referenceSet.refsetId)) {
                ids.push(referenceSet.refsetId);
            }
        });

        ids.forEach((id: string) => {
            this.conceptService.httpGetConcept(id).subscribe(data => {
                results.push(data);
            });
        });

        this.conceptService.setMapConcepts(results);
    }

    assignFavicon() {
        switch (this.environment) {
            case 'local':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_grey.ico');
                break;
            case 'dev':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_red.ico');
                break;
            case 'uat':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_green.ico');
                break;
            case 'training':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_yellow.ico');
                break;
            default:
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon.ico');
                break;
        }
    }
}
