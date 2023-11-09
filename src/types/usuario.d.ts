export interface Usuario {
    nome: string;
    email: string;
    uuid: string;
    roleDto: {
        uuidRole: string;
        descricaoRole: string;
    }
}