export class User {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public login: string,
        public langKey: string,
        public roles: string[]
    ) {
    }
}
