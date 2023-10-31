import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, Subject, Subscription} from "rxjs";
import {Concept} from "../../models/concept";
import {HttpClient} from "@angular/common/http";
import {Options} from "../../models/options";
import {Codesystem} from "../../models/codesystem";
import {Version} from "../../models/version";
import {PathingService} from "../pathing/pathing.service";
import {MembersService} from "../members/members.service";
import {ReferenceSet} from "../../models/referenceSet";
import {HistoryService} from "../history/history.service";
import {ReferencesService} from "../references/references.service";

@Injectable({
    providedIn: 'root'
})
export class ConceptService {

    activeCodesystem!: Codesystem;
    activeCodesystemSubscription: Subscription;
    activeVersion!: Version;
    activeVersionSubscription: Subscription;

    private activeConcept = new Subject<Concept>();
    private activeChildren = new Subject<Concept[]>();
    private activeParents = new Subject<Concept[]>();
    private inferredView = new BehaviorSubject<boolean>(true);
    private mapConcepts = new Subject<Concept[]>();
    private favourites = new Subject<Concept[]>();

    _inferredView!: boolean;
    _inferedViewSubscription: Subscription;

    constructor(private http: HttpClient,
                private pathingService: PathingService,
                private membersService: MembersService,
                private historyService: HistoryService,
                private referencesService: ReferencesService) {
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
        this.activeVersionSubscription = this.pathingService.getActiveVersion().subscribe(data => this.activeVersion = data);
        this._inferedViewSubscription = this.getInferredView().subscribe(data => this._inferredView = data);
    }

    setActiveConcept(activeConcept: Concept): void {
        this.activeConcept.next(activeConcept);
    }

    getActiveConcept(): Observable<Concept> {
        return this.activeConcept.asObservable();
    }

    setActiveChildren(activeChildren: Concept[]): void {
        this.activeChildren.next(activeChildren);
    }

    getActiveChildren(): Observable<Concept[]> {
        return this.activeChildren.asObservable();
    }

    setActiveParents(activeParents: Concept[]): void {
        this.activeParents.next(activeParents);
    }

    getActiveParents(): Observable<Concept[]> {
        return this.activeParents.asObservable();
    }

    setInferredView(inferredView: boolean): void {
        this.inferredView.next(inferredView);
    }

    getInferredView(): Observable<boolean> {
        return this.inferredView.asObservable();
    }

    setMapConcepts(mapConcepts: Concept[]): void {
        this.mapConcepts.next(mapConcepts);
    }

    getMapConcepts(): Observable<Concept[]> {
        return this.mapConcepts.asObservable();
    }

    setFavourites(favourites: Concept[]): void {
        this.favourites.next(favourites);
        localStorage.setItem('favourites', JSON.stringify(favourites));
    }

    getFavourites(): Observable<Concept[]> {
        return this.favourites.asObservable();
    }

    findConcept(concept: Concept): void {
        this.setActiveConcept(undefined!);
        this.historyService.setHistory([]);
        this.referencesService.setReferences([]);

        if (concept) {
            this.httpBrowserGetConcept(concept.conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}).subscribe(data => {
                this.setActiveConcept(data);
            });
            this.httpGetChildren(concept.conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}).subscribe(data => {
                this.setActiveChildren(data);
            });
            this.httpGetParents(concept.conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}).subscribe(data => {
                this.setActiveParents(data);
            });
            this.membersService.httpGetOwlExpression(concept.conceptId).subscribe(data => {
                this.membersService.setOwlExpressionSet(data);
            });
            this.membersService.httpGetReferenceSets(concept.conceptId).subscribe(data => {
                this.membersService.setReferenceSets(data);

                this.findMapConcepts(data);
            });
            this.historyService.httpGetHistory(concept.conceptId).subscribe(data => {
                this.historyService.setHistory(data);
            });
            this.referencesService.httpGetReferences(concept.conceptId, !this._inferredView).subscribe(data => {
                this.referencesService.setReferences(data);
            });
        }
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
            this.httpGetConcept(id).subscribe(data => {
                results.push(data);
            });
        });

        this.setMapConcepts(results);
    }

    httpBrowserGetConcept(conceptId: string, options: Options): Observable<Concept> {

        let params = '';

        if(options.descendantCountForm) {
            params += '&descendantCountForm=' + options.descendantCountForm;
        }

        return this.http.get<Concept>('/snowstorm/snomed-ct/browser/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts/' + conceptId + '?' + params);
    }

    httpGetConcept(conceptId: string, options?: Options): Observable<Concept> {
        return this.http.get<Concept>('/snowstorm/snomed-ct/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts/' + conceptId);
    }

    httpGetConcepts(options: Options): Observable<Concept[]> {

        let params = '';

        if(options.ecl) {
            params += '&ecl=' + encodeURI(options.ecl);
        }

        return this.http.get<Concept[]>('/snowstorm/snomed-ct/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts?' + params).pipe(map((data: any) => {
            return data.items;
        }));
    }

    httpGetChildren(conceptId: string, options: Options): Observable<Concept[]> {

        let params = '';

        if(options.descendantCountForm) {
            params += '&form=' + options.descendantCountForm;
        }

        return this.http.get<Concept[]>('/snowstorm/snomed-ct/browser/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts/' + conceptId + '/children?' + params);
    }

    httpGetParents(conceptId: string, options: Options): Observable<Concept[]> {

        let params = '';

        if(options.descendantCountForm) {
            params += '&form=' + options.descendantCountForm;
        }

        return this.http.get<Concept[]>('/snowstorm/snomed-ct/browser/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts/' + conceptId + '/parents?' + params);
    }
}
