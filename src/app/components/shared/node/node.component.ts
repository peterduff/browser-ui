import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TaxonomyService} from "../../../services/taxonomy/taxonomy.service";
import {Concept} from "../../../models/concept";

@Component({
    selector: 'app-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.scss']
})
export class NodeComponent {

    @Input() node!: Concept;
    @Input() count!: boolean;
    @Input() view!: boolean;
    loading: boolean = false;

    @Output() emitFindConcept = new EventEmitter<any>();

    constructor(private taxonomyService: TaxonomyService) {
    }

    findConcept(node: any): void {
        this.emitFindConcept.emit(node);
    }

    findChildren(node: any): void {
        this.loading = true;
        this.taxonomyService.httpGetTaxonomyChildren(node.conceptId, {descendantCountForm: this.view ? 'inferred' : 'stated'}).subscribe(data => {
            node.children = data;
            this.loading = false;
        });
    }
}
