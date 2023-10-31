import {Component, Inject, OnInit} from '@angular/core';
import {PathingService} from "./services/pathing/pathing.service";
import {AuthenticationService} from "./services/authentication/authentication.service";
import {AuthoringService} from "./services/authoring/authoring.service";
import {DOCUMENT} from "@angular/common";
import {ConceptService} from "./services/concept/concept.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    environment!: string;

    constructor(private authenticationService: AuthenticationService,
                private authoringService: AuthoringService,
                private pathingService: PathingService,
                private conceptService: ConceptService,
                @Inject(DOCUMENT) private document: Document) {
    }

    ngOnInit() {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];

        this.conceptService.setFavourites(JSON.parse(localStorage.getItem('favourites')!));

        this.assignFavicon();
    }

    onTabSwitch(index: number) {
        switch(index) {
            case 0:
                this.setupSummaryTab();
                return;
            case 1:
                this.setupDetailsTab();
                return;
            case 2:
                this.setupDiagramTab();
                return;
            case 3:
                this.setupExpressionTab();
                return;
            case 4:
                this.setupRefsetsTab();
                return;
            case 5:
                this.setupMembersTab();
                return;
            case 6:
                this.setupHistoryTab();
                return;
            case 7:
                this.setupReferencesTab();
                return;
        }
    }

    setupSummaryTab() {
        console.log('setupSummaryTab');
    }

    setupDetailsTab() {
        console.log('setupDetailsTab');
    }

    setupDiagramTab() {
        console.log('setupDiagramTab');
    }

    setupExpressionTab() {
        console.log('setupExpressionTab');
    }

    setupRefsetsTab() {
        console.log('setupRefsetsTab');
    }

    setupMembersTab() {
        console.log('setupMembersTab');
    }

    setupHistoryTab() {
        console.log('setupHistoryTab');
    }

    setupReferencesTab() {
        console.log('setupReferencesTab');
    }

    assignFavicon() {
        switch (this.environment) {
            case 'local':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_grey.ico');
                break;
            case 'dev':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_red.ico');
                break;
            case 'uat':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_green.ico');
                break;
            case 'training':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_yellow.ico');
                break;
            default:
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon.ico');
                break;
        }
    }
}
