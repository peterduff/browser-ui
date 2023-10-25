export class History {
    constructor(
        public branch: string,
        public componentTypes: string[],
        public effectiveTime: string
    ) {
    }
}
