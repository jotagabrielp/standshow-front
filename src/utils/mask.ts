export const MASKS = {
    cnpj: {
       mask: (v: string) => v.replace(/\D/g,"").replace(/^(\d{2})(\d)/,"$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3").replace(/\.(\d{3})(\d)/,".$1/$2").replace(/(\d{4})(\d)/,"$1-$2"),
       unmask: (v:string) => v.replaceAll(".", "").replaceAll("/", "").replaceAll("-", "")
    },
    cep: {
        mask: (v: string) => v.replace(/\D/g,"").replace(/^(\d{5})(\d)/,"$1-$2"),
        unmask: (v:string) => v.replaceAll("-", "")
    },
    telefone: {
        mask: (v: string) => v?.replace(/\D/g,"").replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{4})(\d)/,"$1-$2"),
        unmask: (v:string) => v.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll(" ", "")
    },
}


    