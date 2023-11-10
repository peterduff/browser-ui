import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MembersService} from "../../../services/members/members.service";
import {ReferenceSet} from "../../../models/referenceSet";

@Component({
    selector: 'app-members-node',
    templateUrl: './members-node.component.html',
    styleUrls: ['./members-node.component.scss']
})
export class MembersNodeComponent {

    @Input() node!: ReferenceSet;
    @Input() count!: boolean;
    @Input() view!: boolean;
    loading: boolean = false;

    @Output() emitFindConcept = new EventEmitter<any>();

    constructor(private membersService: MembersService) {
    }

    findConcept(node: any): void {
        this.emitFindConcept.emit(node);
    }

    findChildren(node: any): void {
        this.loading = true;

        this.membersService.httpGetReferenceSetChildren(node.conceptId!).subscribe(data => {
            node.children = data;
            this.loading = false;
        });
    }
}
