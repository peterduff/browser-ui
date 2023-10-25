export class UIConfiguration {
    constructor(
        public endpoints: Endpoints,
        public features: Features
    ) {
    }
}

export class Endpoints {
    constructor(
        public imsEndpoint: string
    ) {
    }
}

export class Features {
    constructor(
        public copyrightNotice: string
    ) {
    }
}
