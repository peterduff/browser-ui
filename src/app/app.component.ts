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
import {Reference} from "./models/reference";
import {History} from "./models/history";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [DiagramComponent]
})
export class AppComponent implements OnInit {

    environment!: string;
    initialising: boolean = true;

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;
    activeChildren!: Concept[];
    activeChildrenSubscription: Subscription;
    activeParents!: Concept[];
    activeParentsSubscription: Subscription;
    inferredView!: boolean;
    inferredViewSubscription: Subscription;
    taxonomyConcept!: Concept;
    taxonomyConceptSubscription: Subscription;
    owlExpressionSet!: ReferenceSet;
    owlExpressionSetSubscription: Subscription;
    referenceSets!: ReferenceSet[];
    referenceSetsSubscription: Subscription;
    mapConcepts!: Concept[];
    mapConceptsSubscription: Subscription;
    referenceSetMembers!: ReferenceSet[];
    referenceSetMembersSubscription: Subscription;
    references!: Reference[]
    referencesSubscription: Subscription;
    history!: History[];
    historySubscription: Subscription;
    activeResultsTab!: number;
    activeResultsTabSubscription: Subscription;

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
        this.activeChildrenSubscription = this.conceptService.getActiveChildren().subscribe(data => this.activeChildren = data);
        this.activeParentsSubscription = this.conceptService.getActiveParents().subscribe(data => this.activeParents = data);
        this.inferredViewSubscription = this.conceptService.getInferredView().subscribe(data => this.inferredView = data);
        this.taxonomyConceptSubscription = this.taxonomyService.getTaxonomyConcept().subscribe(data => this.taxonomyConcept = data);
        this.activeResultsTabSubscription = this.pathingService.getActiveResultsTab().subscribe(data => this.activeResultsTab = data);
        this.owlExpressionSetSubscription = this.membersService.getOwlExpressionSet().subscribe(data => this.owlExpressionSet = data);
        this.referenceSetsSubscription = this.membersService.getReferenceSets().subscribe(data => this.referenceSets = data);
        this.mapConceptsSubscription = this.conceptService.getMapConcepts().subscribe(data => this.mapConcepts = data);
        this.referenceSetMembersSubscription = this.membersService.getReferenceSetMembers().subscribe(data => this.referenceSetMembers = data);
        this.referencesSubscription = this.referencesService.getReferences().subscribe(data => this.references = data);
        this.historySubscription = this.historyService.getHistory().subscribe(data => this.history = data);
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
    }

    setTaxonomyTab() {
        if (this.activeConcept) {
            this.taxonomyService.findConcept(this.activeConcept, true);
        } else {
            this.taxonomyService.findConcept({conceptId: '138875005'}, true);
        }
    }

    setupEclTab() {
    }

    setupFavouritesTab() {
    }

    setupRefsetTab() {
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
                this.setupNodeTab();
                return;
            case 4:
                this.setupExpressionTab();
                return;
            case 5:
                this.setupRefsetsTab();
                return;
            case 6:
                this.setupMembersTab();
                return;
            case 7:
                this.setupHistoryTab();
                return;
            case 8:
                this.setupReferencesTab();
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
        this.membersService.setReferenceSets(undefined!);
        this.conceptService.setMapConcepts(undefined!);

        if (this.activeConcept) {
            this.membersService.httpGetReferenceSets(this.activeConcept.conceptId).subscribe(data => {
                this.membersService.setReferenceSets(data);

                let ids: string[] = [];

                data.forEach((referenceSet: ReferenceSet) => {
                    if (!ids.includes(referenceSet.refsetId)) {
                        ids.push(referenceSet.refsetId);
                    }
                });

                this.conceptService.httpBulkGetConcepts(ids).subscribe(data => {
                    this.conceptService.setMapConcepts(data);
                });
            });
        }
    }

    setupMembersTab() {
        this.membersService.setReferenceSetMembers(undefined!);

        if(this.activeConcept) {
            this.membersService.httpGetReferenceSetChildren(this.activeConcept.conceptId).subscribe(data => {
                this.membersService.setReferenceSetMembers(data);
            });
        }
    }

    setupHistoryTab() {
        this.historyService.setHistory(undefined!);

        if (this.activeConcept) {
            this.historyService.httpGetHistory(this.activeConcept.conceptId).subscribe(data => {
                this.historyService.setHistory(data);
            });
        }
    }

    setupReferencesTab() {
        this.referencesService.setReferences(undefined!);

        if (this.activeConcept) {
            this.referencesService.httpGetReferences(this.activeConcept.conceptId, this.inferredView).subscribe(data => {
                this.referencesService.setReferences(data);
            });
        }
    }

    setupNodeTab() {
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
