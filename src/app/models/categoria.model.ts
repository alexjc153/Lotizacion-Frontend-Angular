export class Categoria {

    constructor(
        public nombre: string,
        public descripcion: string,
        public grupo?: string,
        // tslint:disable-next-line: variable-name
        public _id?: string
    ) { }
}
