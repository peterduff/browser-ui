import {Concept} from "./concept";

export class ReferenceSet {
    constructor(
        public additionalFields: AdditionalFields,
        public referencedComponent: Concept,
        public refsetId: string
    ) {
    }
}

export class AdditionalFields {
    constructor(
        public owlExpression: string
    ) {
    }
}
