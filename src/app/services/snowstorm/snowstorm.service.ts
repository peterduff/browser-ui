import {Injectable} from '@angular/core';
import {Items} from "../../models/items";
import {debounceTime, Observable, Subject, Subscription, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {PathingService} from "../pathing/pathing.service";
import {Codesystem} from "../../models/codesystem";
import {Version} from "../../models/version";
import {Options} from "../../models/options";

@Injectable({
    providedIn: 'root'
})
export class SnowstormService {

    activeCodesystem!: Codesystem;
    activeCodesystemSubscription: Subscription;
    activeVersion!: Version;
    activeVersionSubscription: Subscription;

    private searchDescriptions = new Subject<Items>();

    constructor(private http: HttpClient,
                private pathingService: PathingService) {
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
        this.activeVersionSubscription = this.pathingService.getActiveVersion().subscribe(data => this.activeVersion = data);
    }

    setSearchDescriptions(searchDescriptions: Items) {
        this.searchDescriptions.next(searchDescriptions);
    }

    getSearchDescriptions() {
        return this.searchDescriptions.asObservable();
    }

    httpGetSearchDescriptions(options: Options): Observable<Items> {

        let params = '';

        if(options.limit) {
            params += '&limit=' + options.limit;
        }

        if(options.term) {
            params += '&term=' + options.term;
        }

        if(options.active) {
            params += '&active=' + options.active;
        }

        if(options.conceptActive) {
            params += '&conceptActive=' + options.conceptActive;
        }

        if(options.searchMode) {
            params += '&searchMode=' + options.searchMode;
        }

        if(options.type) {
            params += options.type;
        }

        if(options.preferredIn) {
            params += options.preferredIn;
        }

        if(options.preferredOrAcceptableIn) {
            params += options.preferredOrAcceptableIn;
        }

        return this.http.get<Items>('/snowstorm/snomed-ct/browser/' + this.activeCodesystem.branchPath + '/' + this.activeVersion.version + '/descriptions?' + params);
    }
}



