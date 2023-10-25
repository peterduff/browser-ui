import {Concept} from "./concept";

export class Items {
    constructor(
        public items: any[],
        public limit: number,
        public offset: number,
        public total: number
    ) {
    }
}

export class SearchItem {
    constructor(
        public active: boolean,
        public languageCode: string,
        public module: string,
        public term: string,
        public concept: Concept
    ) {
    }
}
