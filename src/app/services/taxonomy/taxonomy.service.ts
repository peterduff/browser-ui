import {Injectable} from '@angular/core';
import {map, Observable, Subject, Subscription} from "rxjs";
import {Concept} from "../../models/concept";
import {Codesystem} from "../../models/codesystem";
import {Version} from "../../models/version";
import {HttpClient} from "@angular/common/http";
import {PathingService} from "../pathing/pathing.service";
import {ConceptService} from "../concept/concept.service";
import {Options} from "../../models/options";

@Injectable({
    providedIn: 'root'
})
export class TaxonomyService {

    activeCodesystem!: Codesystem;
    activeCodesystemSubscription: Subscription;
    activeVersion!: Version;
    activeVersionSubscription: Subscription;

    private taxonomyParents = new Subject<Concept[]>();
    private taxonomyConcept = new Subject<Concept>();

    constructor(private http: HttpClient,
                private pathingService: PathingService,
                private conceptService: ConceptService) {
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
        this.activeVersionSubscription = this.pathingService.getActiveVersion().subscribe(data => this.activeVersion = data);
    }

    setTaxonomyParents(taxonomyParents: Concept[]): void {
        this.taxonomyParents.next(taxonomyParents);
    }

    getTaxonomyParents(): Observable<Concept[]> {
        return this.taxonomyParents.asObservable();
    }

    setTaxonomyConcept(taxonomyConcept: Concept): void {
        this.taxonomyConcept.next(taxonomyConcept);
    }

    getTaxonomyConcept(): Observable<Concept> {
        return this.taxonomyConcept.asObservable();
    }

    findConcept(concept: Concept, view: boolean): void {
        this.setTaxonomyParents([]);
        this.setTaxonomyConcept(undefined!);

        if (concept) {
            this.httpGetTaxonomyParents(concept.conceptId, {descendantCountForm: view ? 'inferred' : 'stated'}).subscribe(data => {
                this.setTaxonomyParents(data);
            });

            this.httpGetTaxonomyConcept(concept.conceptId, {descendantCountForm: view ? 'inferred' : 'stated'}).subscribe(concept => {
                this.httpGetTaxonomyChildren(concept.conceptId, {descendantCountForm: view ? 'inferred' : 'stated'}).subscribe(children => {
                    concept.expanded = true;
                    concept.children = children;
                    this.setTaxonomyConcept(concept);
                });
            });
        }
    }

    httpGetTaxonomyParents(conceptId: string, options: Options): Observable<Concept[]> {

        let params = '';

        if(options.descendantCountForm) {
            params += '&form=' + options.descendantCountForm;
        }

        return this.http.get<Concept[]>('/snowstorm/snomed-ct/browser/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts/' + conceptId + '/parents?' + params);
    }

    httpGetTaxonomyConcept(conceptId: string, options: Options): Observable<Concept> {

        let params = '';

        if (options.descendantCountForm) {
            params += '&form=' + options.descendantCountForm;
        }

        return this.http.get<Concept>('/snowstorm/snomed-ct/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts/' + conceptId + '?' + params);
    }

    httpGetTaxonomyChildren(conceptId: string, options: Options): Observable<Concept[]> {

        let params = '';

        if (options.descendantCountForm) {
            params += '&form=' + options.descendantCountForm;
        }

        return this.http.get<Concept[]>('/snowstorm/snomed-ct/browser/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts/' + conceptId + '/children?&includeDescendantCount=true' + params);
    }
}
