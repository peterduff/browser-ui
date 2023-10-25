import {Concept} from "./concept";

export class ReferenceSet {
    constructor(
        public additionalFields: AdditionalFields,
        public referencedComponent: Concept
    ) {
    }
}

export class AdditionalFields {
    constructor(
        public owlExpression: string
    ) {
    }
}
