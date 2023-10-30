export interface Cliente {
    endereco: string;
    numero: number;
    complemento: string;
    bairro: string;
    cep: string;
    uf: string;
    municipio: string;
    uuid: string;
    site: string;
    cnpj: string;
    nomeEmpresarial: string;
    nomeFantasia: string;
    porte: string;
    codigoDescricao: string;
    logradouro: string;
    enderecoEletronico: string;
    telefone: string;
    telefoneComercial: string | null;
    situacaoCadastral: string;
}
