import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { AuthoringService } from 'src/app/services/authoring/authoring.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import {PathingService} from '../../services/pathing/pathing.service';
import {ActivatedRoute} from '@angular/router';
import {Codesystem} from "../../models/codesystem";
import {Version} from "../../models/version";
import {ReverseAlphabeticalPipe} from "../../pipes/reverse-alphabetical/reverse-alphabetical.pipe";
import {Concept} from "../../models/concept";
import {ConceptService} from "../../services/concept/concept.service";
import {MembersService} from "../../services/members/members.service";

@Component({
    selector: 'app-snomed-navbar',
    templateUrl: './snomed-navbar.component.html',
    styleUrls: ['./snomed-navbar.component.scss'],
    providers: [ReverseAlphabeticalPipe]
})
export class SnomedNavbarComponent implements OnInit {

    environment: string;
    path: string;

    codesystems!: Codesystem[];
    codesystemsSubscription: Subscription;
    activeCodesystem!: Codesystem;
    activeCodesystemSubscription: Subscription;

    versions!: Version[];
    versionsSubscription: Subscription;
    activeVersion!: Version;
    activeVersionSubscription: Subscription;

    inferredView!: boolean;
    inferredViewSubscription: Subscription;

    constructor(private authoringService: AuthoringService,
                private authenticationService: AuthenticationService,
                private conceptService: ConceptService,
                private pathingService: PathingService,
                private membersService: MembersService,
                private location: Location,
                private reverseAlphabeticalPipe: ReverseAlphabeticalPipe,
                private route: ActivatedRoute) {
        this.codesystemsSubscription = this.pathingService.getCodesystems().subscribe(data => this.codesystems = data);
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
        this.versionsSubscription = this.pathingService.getVersions().subscribe(data => this.versions = data);
        this.activeVersionSubscription = this.pathingService.getActiveVersion().subscribe(data => this.activeVersion = data);
        this.inferredViewSubscription = this.conceptService.getInferredView().subscribe(data => this.inferredView = data);
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.path = this.location.path();
    }

    ngOnInit() {
        this.pathingService.httpGetCodesystems().subscribe(codesystems => {
            this.pathingService.setCodesystems(codesystems);
            let main: Codesystem = codesystems.find(codesystem => codesystem.branchPath === 'MAIN')!;

            if (main) {
                this.pathingService.setActiveCodesystem(main);

                this.pathingService.httpGetVersions(main).subscribe(versions => {
                    this.pathingService.setVersions(versions);
                    this.pathingService.setActiveVersion(this.reverseAlphabeticalPipe.transform(versions, 'effectiveDate')[0]);

                    this.membersService.httpGetMembers().subscribe(data => {
                        this.membersService.setMembers(data);
                    });


                    let concept: Concept = {
                        // conceptId: '318351000221106'
                        conceptId: '22298006'
                        // conceptId: '1222625002'
                        // conceptId: '293584003'
                    }

                    this.findConcept(concept);
                });
            }
        });
    }

    setCodesystem(codesystem: Codesystem): void {
        this.pathingService.setActiveCodesystem(codesystem);
        this.pathingService.setActiveVersion(null!);

        this.pathingService.httpGetVersions(codesystem).subscribe(versions => {
            this.pathingService.setVersions(versions);
            this.pathingService.setActiveVersion(this.reverseAlphabeticalPipe.transform(versions, 'effectiveDate')[0]);
        });
    }

    setVersion(version: Version): void {
        this.pathingService.setActiveVersion(version);
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }
}
