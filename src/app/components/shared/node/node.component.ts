import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.scss']
})
export class NodeComponent {

    @Input() node!: any;
    @Input() count!: any;

    @Output() emitFindConcept = new EventEmitter<any>();
    @Output() emitFindChildren = new EventEmitter<any>();

    findConcept(node: any): void {
        this.emitFindConcept.emit(node);
    }

    findChildren(node: any): void {
        this.emitFindChildren.emit(node);
    }
}
