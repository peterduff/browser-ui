import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DiagramService {

    private options = new BehaviorSubject<any>({
        serverUrl: "/snowstorm/snomed-ct",
        queryServerUrl: "",
        queryBranch: "",
        edition: "",
        release: "",
        showIds: false,
        hideNotAcceptable: true,
        displayInactiveDescriptions: false,
        displaySynonyms: true,
        selectedView: "inferred",
        displayChildren: false,
        languages: ["en"],
        languagesArray: {
            'en': 'English'
        },
        defaultLanguage: 'en',
        defaultAcceptLanguage: "",
        closeButton: false,
        collapseButton: false,
        linkerButton: true,
        subscribersMarker: false,
        searchMode: "partialMatching",
        searchLang: "english",
        diagrammingMarkupEnabled: false,
        statusSearchFilter: "activeOnly",
        highlightByEffectiveTime: "false",
        dailyBuildBrowser: false,
        publicBrowser: false,
        previewBrowser: false,
        tsBrowser: false,
        communityBrowser: false,
        communityContentReleases: [],
        modules: [],
        ecl: "",
        history: false
    });

    constructor() {
    }

    setOptions(options: any): void {
        this.options.next(options);
    }

    getOptions(): Observable<any> {
        return this.options.asObservable();
    }
}
