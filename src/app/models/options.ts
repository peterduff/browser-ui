export class Options {
    constructor(
        public limit?: number,
        public term?: string,
        public descendantCountForm?: string,
        public ecl?: string,
        public active?: string,
        public conceptActive?: string,
        public searchMode?: string,
        public type?: string,
        public preferredIn?: string,
        public groupByConcept?: string,
        public preferredOrAcceptableIn?: string
    ) {
    }
}
