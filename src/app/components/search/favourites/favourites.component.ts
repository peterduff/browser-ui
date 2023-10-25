import {Component} from '@angular/core';
import {Concept} from "../../../models/concept";
import {ConceptService} from "../../../services/concept/concept.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent {

    favourites!: Concept[];
    favouritesSubscription: Subscription;

    constructor(private conceptService: ConceptService) {
        this.favouritesSubscription = this.conceptService.getFavourites().subscribe(data => this.favourites = data);
    }

    findConcept(concept: Concept): void {
        this.conceptService.findConcept(concept);
    }

    removeFromFavourites(concept: Concept) {
        this.favourites.splice(this.favourites.indexOf(concept), 1);
        this.conceptService.setFavourites(this.favourites);
    }
}
