import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-node-graph',
    templateUrl: './node-graph.component.html',
    styleUrls: ['./node-graph.component.scss']
})
export class NodeGraphComponent {

    @Input() options: any;

    constructor() {
    }
}
