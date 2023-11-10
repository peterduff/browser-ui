import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Concept} from "../../../models/concept";
import {TaxonomyService} from "../../../services/taxonomy/taxonomy.service";

@Component({
    selector: 'app-parent-node',
    templateUrl: './parent-node.component.html',
    styleUrls: ['./parent-node.component.scss']
})
export class ParentNodeComponent {

    @Input() node!: Concept;
    @Input() count!: boolean;
    @Input() view!: boolean;

    @Output() emitFindConcept = new EventEmitter<any>();
    @Output() emitFindParents = new EventEmitter<any>();

    constructor(private taxonomyService: TaxonomyService) {
    }

    findConcept(node: any): void {
        console.log('findConcept');
        this.emitFindConcept.emit(node);
    }

    findParents(node: any): void {
        console.log('findParents');
        this.emitFindParents.emit(node);
    }
}
