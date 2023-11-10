import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
    Subscription,
    BehaviorSubject,
    debounceTime,
    switchMap,
    of,
    Subject,
    distinctUntilChanged,
    Observable, fromEvent, timeInterval
} from "rxjs";
import {Items} from "../../../models/items";
import {Options} from "../../../models/options";
import {SnowstormService} from "../../../services/snowstorm/snowstorm.service";
import {Concept} from "../../../models/concept";
import {ConceptService} from "../../../services/concept/concept.service";
import {MembersService} from "../../../services/members/members.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    searchDescriptions!: Items;
    searchDescriptionsSubscription: Subscription;

    private searchSubject = new Subject<string>();
    inputText: string = '';
    recentSearches: string[] = [];
    loading: boolean = false;
    responseTime: number = 0;

    searchType: string = 'WHOLE WORD';
    searchStatus: string = 'ACTIVE';
    searchAll: string = 'ALL';
    searchLanguage: string[] = [];
    searchGrouping: string = 'GROUP BY CONCEPT';

    inferredView!: boolean;
    inferredViewSubscription: Subscription;

    constructor(private snowstormService: SnowstormService,
                private conceptService: ConceptService) {
        this.searchDescriptionsSubscription = this.snowstormService.getSearchDescriptions().subscribe(data => this.searchDescriptions = data);
        this.inferredViewSubscription = this.conceptService.getInferredView().subscribe(data => this.inferredView = data);
    }

    ngOnInit() {
        this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchValue) => {
            this.performSearch(searchValue);
        });
    }

    onSearch(searchValue: string) {
        this.searchSubject.next(searchValue);
    }

    performSearch(searchValue: string) {
        // Perform the actual search operation here
        this.search(searchValue);
        this.recentSearches.push(searchValue);
        // ... Your search logic ...
    }

    searchGateway(text: string): void {
        if (text.length >= 3) {
            this.onSearch(text);
        }
    }

    search(text: string): void {
        if (text.length >= 3) {
            const options: Options = {
                limit: 100,
                term: text
            }

            switch(this.searchType) {
                case 'WHOLE WORD':
                    options.searchMode = 'WHOLE_WORD';
                    break;
                case 'PREFIXES':
                    break;
            }

            switch(this.searchStatus) {
                case 'ACTIVE':
                    options.active = 'true';
                    options.conceptActive = 'true';
                    break;
                case 'INACTIVE':
                    options.conceptActive = 'false';
                    break;
                case 'ALL':
                    options.active = 'true';
                    break;
            }

            switch(this.searchAll) {
                case 'ALL':
                    break;
                case 'NO DEFINITIONS':
                    options.type = '&type=900000000000013009&type=900000000000003001';
                    break;
                case 'FSN':
                    options.type = '&type=900000000000003001';
                    break;
                case 'PREFERRED TERMS':
                    options.preferredIn = '&preferredIn=900000000000509007&preferredIn=900000000000508004&type=900000000000013009';
                    break;
            }

            if (this.searchLanguage.length) {
                options.type = '&type=900000000000013009';
                options.preferredOrAcceptableIn = '';

                this.searchLanguage.forEach(lang => {
                    switch(lang) {
                        case 'US English':
                            options.preferredOrAcceptableIn += '&preferredOrAcceptableIn=900000000000509007';
                            break;
                        case 'GB English':
                            options.preferredOrAcceptableIn += '&preferredOrAcceptableIn=900000000000508004';
                            break;
                    }
                });
            }

            switch(this.searchGrouping) {
                case 'GROUP BY CONCEPT':
                    options.groupByConcept = 'true';
                    break;
                case 'NO GROUPING':
                    break;
            }

            this.loading = true;
            this.snowstormService.httpGetSearchDescriptions(options).pipe(timeInterval()).subscribe(data => {
                this.snowstormService.setSearchDescriptions(data.value);
                this.responseTime = data.interval;
                this.loading = false;
            });
        }
    }

    toggleLang(lang: string): void {
        if (this.searchLanguage.includes(lang)) {
            this.searchLanguage = this.searchLanguage.filter(item => item !== lang);
        } else {
            this.searchLanguage.push(lang);
        }
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }
}
