import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {SnomedNavbarComponent} from "./components/snomed-navbar/snomed-navbar.component";
import {AlphabeticalPipe} from "./pipes/alphabetical/alphabetical.pipe";
import {ReverseAlphabeticalPipe} from "./pipes/reverse-alphabetical/reverse-alphabetical.pipe";
import {SnomedFooterComponent} from "./components/snomed-footer/snomed-footer.component";
import {MatTabsModule} from "@angular/material/tabs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { SearchComponent } from './components/search/search/search.component';
import { TaxonomyComponent } from './components/search/taxonomy/taxonomy.component';
import { EclComponent } from './components/search/ecl/ecl.component';
import { FavouritesComponent } from './components/search/favourites/favourites.component';
import { RefsetsComponent } from './components/search/refsets/refsets.component';
import { SummaryComponent } from './components/results/summary/summary.component';
import { DetailsComponent } from './components/results/details/details.component';
import { DiagramComponent } from './components/results/diagram/diagram.component';
import { ExpressionComponent } from './components/results/expression/expression.component';
import { RefsetComponent } from './components/results/refset/refset.component';
import { MembersComponent } from './components/results/members/members.component';
import { HistoryComponent } from './components/results/history/history.component';
import { ReferencesComponent } from './components/results/references/references.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { ConceptComponent } from './components/shared/concept/concept.component';
import { ActivePipe } from './pipes/active/active.pipe';
import { ConceptUtilityBarComponent } from './components/shared/concept-utility-bar/concept-utility-bar.component';
import { AcceptabilityMapPipe } from './pipes/acceptability-map/acceptability-map.pipe';
import { DescriptionsPipe } from './pipes/descriptions/descriptions.pipe';
import {AuthenticationService} from "./services/authentication/authentication.service";
import {AuthoringService} from "./services/authoring/authoring.service";
import {ConceptService} from "./services/concept/concept.service";
import {MembersService} from "./services/members/members.service";
import {ModalService} from "./services/modal/modal.service";
import {PathingService} from "./services/pathing/pathing.service";
import {SnowstormService} from "./services/snowstorm/snowstorm.service";

@NgModule({
    declarations: [
        AppComponent,
        SnomedNavbarComponent,
        SnomedFooterComponent,
        AlphabeticalPipe,
        ReverseAlphabeticalPipe,
        SearchComponent,
        TaxonomyComponent,
        EclComponent,
        FavouritesComponent,
        RefsetsComponent,
        SummaryComponent,
        DetailsComponent,
        DiagramComponent,
        ExpressionComponent,
        RefsetComponent,
        MembersComponent,
        HistoryComponent,
        ReferencesComponent,
        ConceptComponent,
        ActivePipe,
        ConceptUtilityBarComponent,
        AcceptabilityMapPipe,
        DescriptionsPipe
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        MatTabsModule,
        MatSlideToggleModule,
        BrowserAnimationsModule
    ],
    providers: [
        AuthenticationService,
        AuthoringService,
        ConceptService,
        MembersService,
        ModalService,
        PathingService,
        SnowstormService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
