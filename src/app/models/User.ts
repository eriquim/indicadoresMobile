export class User {
    id: number;

    nome: string;

    login: string;

    email: string;

    password: string;

    token: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
