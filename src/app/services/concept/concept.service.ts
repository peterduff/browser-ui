import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, map, Observable, Subject, Subscription} from "rxjs";
import {Concept} from "../../models/concept";
import {HttpClient} from "@angular/common/http";
import {Options} from "../../models/options";
import {Codesystem} from "../../models/codesystem";
import {Version} from "../../models/version";
import {PathingService} from "../pathing/pathing.service";

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
    private conceptHistory = new Subject<Concept[]>();
    private conceptLoading = new BehaviorSubject<boolean>(false);

    _inferredView!: boolean;
    _inferedViewSubscription: Subscription;
    _conceptLoading!: boolean;
    _conceptLoadingSubscription: Subscription;

    constructor(private http: HttpClient,
                private pathingService: PathingService) {
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
        this.activeVersionSubscription = this.pathingService.getActiveVersion().subscribe(data => this.activeVersion = data);
        this._inferedViewSubscription = this.getInferredView().subscribe(data => this._inferredView = data);
        this._conceptLoadingSubscription = this.getConceptLoading().subscribe(data => this._conceptLoading = data);
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

    setConceptHistory(conceptHistory: Concept[]): void {
        this.conceptHistory.next(conceptHistory);
    }

    getConceptHistory(): Observable<Concept[]> {
        return this.conceptHistory.asObservable();
    }

    setConceptLoading(conceptLoading: boolean): void {
        this.conceptLoading.next(conceptLoading);
    }

    getConceptLoading(): Observable<boolean> {
        return this.conceptLoading.asObservable();
    }

    findConcept(concept: Concept): void {
        this.setActiveConcept(undefined!);
        this.setActiveChildren([]);
        this.setActiveParents([]);

        if (concept) {
            this.setConceptLoading(true);
            forkJoin([
                this.httpBrowserGetConcept(concept.conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}),
                this.httpGetChildren(concept.conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}),
                this.httpGetParents(concept.conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'})
            ]).subscribe(([concept, children, parents]) => {
                this.setActiveConcept(concept);
                this.setActiveChildren(children);
                this.setActiveParents(parents);
                this.setConceptLoading(false);
            });
        }
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
