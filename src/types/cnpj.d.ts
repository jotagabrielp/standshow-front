// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

export interface Cnpj {
    uuid: string;
    atividade_principal:    Atividade[];
    data_situacao:          string;
    telefoneComercial:          string;
    complemento:            string;
    tipo:                   string;
    nome:                   string;
    telefone:               string;
    email:                  string;
    atividades_secundarias: Atividade[];
    qsa:                    Qsa[];
    situacao:               string;
    bairro:                 string;
    logradouro:             string;
    numero:                 string;
    cep:                    string;
    municipio:              string;
    uf:                     string;
    porte:                  string;
    abertura:               string;
    natureza_juridica:      string;
    cnpj:                   string;
    ultima_atualizacao:     string;
    status:                 string;
    nomeFantasia:               string;
    nomeEmpresarial:               string;
    efr:                    string;
    motivo_situacao:        string;
    situacao_especial:      string;
    data_situacao_especial: string;
    capital_social:         string;
    extra:                  Extra;
    billing:                Billing;
}

export interface Atividade {
    code: string;
    text: string;
}

export interface Billing {
    free:     boolean;
    database: boolean;
}

export interface Extra {
}

export interface Qsa {
    nome:            string;
    qual:            string;
    pais_origem?:    string;
    nome_rep_legal?: string;
    qual_rep_legal?: string;
}
