export class Usuario {

    constructor(
        public nombre: string,
        public username: string,
        public password: string,
        public perfil?: string,
        public img?: string,
        // tslint:disable-next-line: variable-name
        public _id?: string
    ) { }
}
