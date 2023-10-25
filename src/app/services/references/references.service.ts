import {Injectable} from '@angular/core';
import {Codesystem} from "../../models/codesystem";
import {map, Observable, Subject, Subscription} from "rxjs";
import {Version} from "../../models/version";
import {Reference} from "../../models/reference";
import {HttpClient} from "@angular/common/http";
import {PathingService} from "../pathing/pathing.service";

@Injectable({
    providedIn: 'root'
})
export class ReferencesService {

    activeCodesystem!: Codesystem;
    activeCodesystemSubscription: Subscription;
    activeVersion!: Version;
    activeVersionSubscription: Subscription;

    private references = new Subject<Reference[]>();

    constructor(private http: HttpClient,
                private pathingService: PathingService) {
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
        this.activeVersionSubscription = this.pathingService.getActiveVersion().subscribe(data => this.activeVersion = data);
    }

    setReferences(references: Reference[]): void {
        this.references.next(references);
    }

    getReferences(): Observable<Reference[]> {
        return this.references.asObservable();
    }

    httpGetReferences(conceptId: string, inferred: boolean): Observable<Reference[]> {
        return this.http.get<Reference[]>('/snowstorm/snomed-ct/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts/' + conceptId + '/references?stated=' + inferred).pipe(map((data: any) => {
            return data.referencesByType;
        }));
    }
}
