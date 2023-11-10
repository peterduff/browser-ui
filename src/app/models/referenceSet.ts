import {Concept, FSN} from "./concept";

export class ReferenceSet {
    constructor(
        public additionalFields: AdditionalFields,
        public referencedComponent: Concept,
        public refsetId: string,
        public conceptId?: string,
        public children?: ReferenceSet[],
        public definitionStatus?: string,
        public fsn?: FSN,
        public moduleId?: string,
        public expanded?: boolean,
        public descendantCount?: number
    ) {
    }
}

export class AdditionalFields {
    constructor(
        public owlExpression: string
    ) {
    }
}
