import {Injectable} from '@angular/core';
import {UIConfiguration} from "../../models/uiConfiguration";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthoringService {

    public environmentEndpoint: string;

    private uiConfiguration = new Subject<UIConfiguration>();

    constructor(private http: HttpClient) {
        this.environmentEndpoint = window.location.origin + '/';
    }

    setUIConfiguration(uiConfiguration: UIConfiguration): void {
        this.uiConfiguration.next(uiConfiguration);
    }

    getUIConfiguration(): Observable<UIConfiguration> {
        return this.uiConfiguration.asObservable();
    }

    httpGetUIConfiguration(): Observable<UIConfiguration> {
        return this.http.get<UIConfiguration>('/authoring-services/ui-configuration');
    }
}
