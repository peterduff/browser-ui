export class Concept {
    constructor(
        public conceptId: string,
        public active?: boolean,
        public definitionStatus?: string,
        public fsn?: FSN,
        public id?: string,
        public moduleId?: string,
        public descendantCount?: number,
        public pt?: PT,
        public descriptions?: Description[],
        public classAxioms?: ClassAxiom[],
        public relationships?: Relationship[],
        public children?: Concept[],
        public expanded?: boolean,
        public effectiveTime?: string
    ) {
    }
}

export class FSN {
    constructor(
        public lang: string,
        public term: string
    ) {
    }
}

export class PT {
    constructor(
        public lang: string,
        public term: string
    ) {
    }
}

export class Description {
    constructor(
        public descriptionId?: string,
        public term?: string,
        public type?: string,
        public caseSignificance?: string,
        public effectiveTime?: string,
        public moduleId?: string,
        public lang?: string,
        public acceptabilityMap?: any
    ) {
    }
}

export class ClassAxiom {
    constructor(
        public active: boolean,
        public relationships: Relationship[]
    ) {
    }
}

export class Relationship {
    constructor(
        public active: boolean,
        public groupId: number,
        public type: Concept,
        public target: Concept,
        public concreteValue?: ConcreteValue,
    ) {
    }
}

export class ConcreteValue {
    constructor(
        public value: number
    ) {
    }
}
