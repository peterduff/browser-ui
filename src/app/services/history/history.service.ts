import {Injectable} from '@angular/core';
import {map, Observable, Subject, Subscription} from "rxjs";
import {History} from "../../models/history";
import {Codesystem} from "../../models/codesystem";
import {Version} from "../../models/version";
import {HttpClient} from "@angular/common/http";
import {PathingService} from "../pathing/pathing.service";

@Injectable({
    providedIn: 'root'
})
export class HistoryService {

    activeCodesystem!: Codesystem;
    activeCodesystemSubscription: Subscription;
    activeVersion!: Version;
    activeVersionSubscription: Subscription;

    private history = new Subject<History[]>();

    constructor(private http: HttpClient,
                private pathingService: PathingService) {
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
        this.activeVersionSubscription = this.pathingService.getActiveVersion().subscribe(data => this.activeVersion = data);
    }

    setHistory(history: History[]): void {
        this.history.next(history);
    }

    getHistory(): Observable<History[]> {
        return this.history.asObservable();
    }

    httpGetHistory(conceptId: string): Observable<History[]> {
        return this.http.get<History[]>('/snowstorm/snomed-ct/browser/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/concepts/' + conceptId + '/history?showFutureVersions=false').pipe(map((data: any) => {
            return data.history;
        }));

    }
}
