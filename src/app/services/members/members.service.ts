import {Injectable} from '@angular/core';
import {map, Observable, Subject, Subscription} from "rxjs";
import {ReferenceSet} from "../../models/referenceSet";
import {HttpClient} from "@angular/common/http";
import {PathingService} from "../pathing/pathing.service";
import {Codesystem} from "../../models/codesystem";
import {Version} from "../../models/version";

@Injectable({
    providedIn: 'root'
})
export class MembersService {

    activeCodesystem!: Codesystem;
    activeCodesystemSubscription: Subscription;
    activeVersion!: Version;
    activeVersionSubscription: Subscription;

    private members = new Subject<ReferenceSet[]>();
    private referenceSets = new Subject<ReferenceSet[]>();
    private owlExpressionSet = new Subject<ReferenceSet>();

    constructor(private http: HttpClient,
                private pathingService: PathingService) {
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
        this.activeVersionSubscription = this.pathingService.getActiveVersion().subscribe(data => this.activeVersion = data);
    }

    setMembers(members: ReferenceSet[]): void {
        this.members.next(members);
    }

    getMembers(): Observable<ReferenceSet[]> {
        return this.members.asObservable();
    }

    httpGetMembers(): Observable<ReferenceSet[]> {
        return this.http.get('/snowstorm/snomed-ct/browser/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/members?active=true').pipe(map((data: any) => {
            return data.referenceSets;
        }));
    }

    setReferenceSets(referenceSets: ReferenceSet[]): void {
        this.referenceSets.next(referenceSets);
    }

    getReferenceSets(): Observable<ReferenceSet[]> {
        return this.referenceSets.asObservable();
    }

    httpGetReferenceSets(referencedComponentId: string): Observable<ReferenceSet[]> {
        return this.http.get('/snowstorm/snomed-ct/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/members?active=true&referencedComponentId=' + referencedComponentId).pipe(map((data: any) => {
            return data.items;
        }));
    }

    setOwlExpressionSet(referenceSet: ReferenceSet): void {
        this.owlExpressionSet.next(referenceSet);
    }

    getOwlExpressionSet(): Observable<ReferenceSet> {
        return this.owlExpressionSet.asObservable();
    }

    httpGetOwlExpression(referencedComponentId: string): Observable<ReferenceSet> {
        return this.http.get('/snowstorm/snomed-ct/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/members?referenceSet=733073007&referencedComponentId=' + referencedComponentId).pipe(map((data: any) => {
            return data.items[0];
        }));
    }
}
