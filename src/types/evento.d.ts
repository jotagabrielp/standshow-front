export interface Evento {
    "uuid": "string",
    "nome": "string",
    "dataHoraInicioFormatada": "string",
    "dataHoraFimFormatada": "string",
    "site": "string",
    "outro": "string",
    imagem: any,
    "clientesVinculados": [
        {
        "endereco": "string",
        "numero": 0,
        "complemento": "string",
        "bairro": "string",
        "cep": "string",
        "uf": "string",
        "municipio": "string",
        "uuid": "string",
        "site": "string",
        "cnpj": "string",
        "nomeEmpresarial": "string",
        "nomeFantasia": "string",
        "porte": "string",
        "codigoDescricao": "string",
        "logradouro": "string",
        "enderecoEletronico": "string",
        "telefone": "string",
        "telefoneComercial": "string",
        "situacaoCadastral": "string"
        }
    ],
    "endereco": "string",
    "numero": 0,
    "complemento": "string",
    "bairro": "string",
    "cep": "string",
    "uf": "string",
    "municipio": "string",
    uuidUsuarioComercial: string,
    organizador: {
        nome: string,
        responsavel: string,
        telefone: string,
        email: string
    }
}