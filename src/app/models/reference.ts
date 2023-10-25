import {Concept} from "./concept";

export class Reference {
    constructor(
        public referenceType: Concept,
        public referencingConcepts: Concept[]
    ) {
    }
}
