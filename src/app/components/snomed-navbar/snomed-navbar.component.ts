import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Location} from '@angular/common';
import { AuthoringService } from 'src/app/services/authoring/authoring.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { User } from '../../models/user';
import {forkJoin, Subscription} from 'rxjs';
import {PathingService} from '../../services/pathing/pathing.service';
import {ActivatedRoute, Router} from '@angular/router';
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

    @Output() emitter = new EventEmitter<any>();

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

    activeConcept!: Concept | undefined;
    activeConceptSubscription: Subscription;

    inferredView!: boolean;
    inferredViewSubscription: Subscription;

    constructor(private authoringService: AuthoringService,
                private authenticationService: AuthenticationService,
                private conceptService: ConceptService,
                private pathingService: PathingService,
                private membersService: MembersService,
                private location: Location,
                private reverseAlphabeticalPipe: ReverseAlphabeticalPipe,
                private router: Router) {
        this.codesystemsSubscription = this.pathingService.getCodesystems().subscribe(data => this.codesystems = data);
        this.activeCodesystemSubscription = this.pathingService.getActiveCodesystem().subscribe(data => this.activeCodesystem = data);
        this.versionsSubscription = this.pathingService.getVersions().subscribe(data => this.versions = data);
        this.activeVersionSubscription = this.pathingService.getActiveVersion().subscribe(data => this.activeVersion = data);
        this.inferredViewSubscription = this.conceptService.getInferredView().subscribe(data => this.inferredView = data);
        this.activeConceptSubscription = this.conceptService.getActiveConcept().subscribe(data => this.activeConcept = data);
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.path = this.location.path();
    }

    ngOnInit() {
        this.path = this.location.path();

        this.pathingService.httpGetCodesystems().subscribe(codesystems => {
            this.pathingService.setCodesystems(codesystems);
            let main: Codesystem = codesystems.find(codesystem => codesystem.branchPath === 'MAIN')!;

            if (main) {
                if (this.findCodesystemFromPath(codesystems)) {
                    this.pathingService.setActiveCodesystem(this.findCodesystemFromPath(codesystems));
                } else {
                    this.pathingService.setActiveCodesystem(main);
                    this.router.navigate([main.branchPath]);
                }

                this.pathingService.httpGetVersions(this.findCodesystemFromPath(codesystems) ? this.findCodesystemFromPath(codesystems) : main).subscribe(versions => {
                    this.pathingService.setVersions(versions);

                    if (this.findVersionFromPath(versions)) {
                        this.pathingService.setActiveVersion(this.findVersionFromPath(versions));
                    } else {
                        this.pathingService.setActiveVersion(this.findLatestVersion(versions));
                        this.router.navigate([main.branchPath, this.findLatestVersion(versions).version]);
                    }

                    this.membersService.httpGetMembers().subscribe(data => {
                        this.membersService.setMembers(data);
                    });

                    this.findInitialConcept();
                });
            }
        });
    }

    findCodesystemFromPath(codesystems: Codesystem[]): Codesystem {
        let codesystemPath = this.path;
        codesystemPath = codesystemPath.replace(/\d{6,18}/g, '');
        codesystemPath = codesystemPath.replace(/\/[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]/g, '');

        if (codesystemPath.startsWith('/')) {
            codesystemPath = codesystemPath.substring(1);
        }

        if (codesystemPath.endsWith('/')) {
            codesystemPath = codesystemPath.substring(0, codesystemPath.length - 1);
        }

        return codesystems.find(codesystem => codesystem.branchPath === codesystemPath)!;
    }

    findVersionFromPath(versions: Version[]): Version {
        return versions.find(version => this.path.includes(version.version))!;
    }

    setCodesystem(codesystem: Codesystem): void {
        this.pathingService.setActiveCodesystem(codesystem);
        this.pathingService.setActiveVersion(null!);

        this.pathingService.httpGetVersions(codesystem).subscribe(versions => {
            this.pathingService.setVersions(versions);
            this.pathingService.setActiveVersion(this.findLatestVersion(versions));

            if (this.activeConcept) {
                this.router.navigate([codesystem.branchPath, this.findLatestVersion(versions).version, this.activeConcept.conceptId]);
            } else {
                this.router.navigate([codesystem.branchPath, this.findLatestVersion(versions).version]);
            }
        });
    }

    setVersion(version: Version): void {
        this.pathingService.setActiveVersion(version);

        if (this.activeConcept) {
            this.router.navigate([this.activeCodesystem.branchPath, version.version, this.activeConcept.conceptId]);
        } else {
            this.router.navigate([this.activeCodesystem.branchPath, version.version]);
        }
    }

    findInitialConcept(): void {
        if (this.path.match(/\d{6,18}/g)) {
            let conceptId = this.path.match(/\d{6,18}/g)![0];

            forkJoin([
                this.conceptService.httpBrowserGetConcept(conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}),
                this.conceptService.httpGetChildren(conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'}),
                this.conceptService.httpGetParents(conceptId, {descendantCountForm: this.inferredView ? 'inferred' : 'stated'})
            ]).subscribe(([concept, children, parents]) => {
                this.conceptService.setActiveConcept(concept);
                this.conceptService.setActiveChildren(children);
                this.conceptService.setActiveParents(parents);
                this.emitter.emit(false);
            });
        } else {
            this.emitter.emit(false);
        }
    }

    findLatestVersion(versions: Version[]): Version {
        return this.reverseAlphabeticalPipe.transform(versions, 'effectiveDate')[0];
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }
}
