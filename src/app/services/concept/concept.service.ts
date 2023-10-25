import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {Concept} from "../../models/concept";
import {HttpClient} from "@angular/common/http";
import {Options} from "../../models/options";
import {Codesystem} from "../../models/codesystem";
import {Version} from "../../models/version";
import {PathingService} from "../pathing/pathing.service";
import {MembersService} from "../members/members.service";

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

    constructor(private http: HttpClient,
                private pathingService: PathingService,
                private membersService: MembersService) {
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
        this.activeVersionSubscription = this.pathingService.getActiveVersion().subscribe(data => this.activeVersion = data);
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

    findConcept(concept: Concept): void {
        this.setActiveConcept(undefined!);

        if (concept) {
            this.httpGetConcept(concept.conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}).subscribe(data => {
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
        }
    }
    httpGetConcept(conceptId: string, options: Options): Observable<Concept> {

        let params = '';

        if(options.descendantCountForm) {
            params += '&descendantCountForm=' + options.descendantCountForm;
        }

        return this.http.get<Concept>('/snowstorm/snomed-ct/browser/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts/' + conceptId + '?' + params);
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
