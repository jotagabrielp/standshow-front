export const getCnpjUrl = (cnpj: string) => `/cnpj/${cnpj}`

export const getLoginUrl = () => `/auth/signin`

export const getRegisterUrl = () => `/register`

export const getEventosUrl = () => `/evento`

export const getItemUrl = () => `/tipo-item`

export const getTipoItemUrl = (item: string) => `/tipo-item/${item}`

export const getProjetosUrl = () => `/estande`

export const deleteProjetosUrl = (uuid: string) => `/estande/${uuid}`

export const getEventoUrl = (uuid: string) => `/evento/${uuid}`

export const getCepUrl = (cep: string) => `https://viacep.com.br/ws/${cep}/json/`

export const getSolicitacoesUrl = () => `/evento/solicitacoes-existentes`

export const getClienteUrl = () => `/cliente`