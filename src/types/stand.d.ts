export interface Stand {
    uuid: string;
    formaConstrutiva: {
        tipoForma: {
            uuid: string;
            descricao: string;
            tipoBase: string;
        };
    };
    dimensao: {
        tipoDimensao: {
            uuid: string;
            descricao: string;
            tipoBase: string;
        };
        area: number;
        lateral: number;
        frente: number;
        peDireito: number;
    };
    piso: {
        tipoPiso: {
            uuid: string;
            descricao: string;
            tipoBase: string;
        };
    };
    parede: {
        tipoParede: {
            uuid: string;
            descricao: string;
            tipoBase: string;
        };
    };
    ambientes: {
        uuid: string;
        tipoAmbiente: {
            uuid: string;
            descricao: string;
            tipoBase: string;
        };
    }[];
    logo: null;
    uuidCliente: string;
    uuidEvento: string;
    status: "AGUARDANDO_PROJETO";
}[];
