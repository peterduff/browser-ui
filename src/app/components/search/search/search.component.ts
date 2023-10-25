import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
    Subscription,
    BehaviorSubject,
    debounceTime,
    switchMap,
    of,
    Subject,
    distinctUntilChanged,
    Observable, fromEvent
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

    searchType: string = 'WHOLE WORD';
    searchStatus: string = 'ACTIVE';
    searchAll: string = '';
    searchLanguage: string[] = [];
    searchGrouping: string = 'false';

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
        console.log('Performing search for:', searchValue);
        this.search(searchValue);
        // ... Your search logic ...
    }

    searchGateway(text: string): void {
        if (text.length >= 3) {
            this.onSearch(text);
        }
    }

    search(text: string): void {
        const options: Options = {
            limit: 100,
            term: text,
        }

        this.snowstormService.httpGetSearchDescriptions(options).subscribe(data => {
            this.snowstormService.setSearchDescriptions(data);
        });
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }
}
