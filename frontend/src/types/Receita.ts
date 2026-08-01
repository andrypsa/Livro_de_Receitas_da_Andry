export type Categoria = 'DOCE' | 'SALGADO' | 'MISTO'

export type Dificuldade = 'FACIL' | 'MEDIA' | 'DIFICIL'

export type OrigemReceita =
    | 'AUTORAL'
    | 'YOUTUBE'
    | 'TIKTOK'
    | 'INSTAGRAM'
    | 'FACEBOOK'
    | 'SITE'
    | 'LIVRO_DE_RECEITAS'
    | 'OUTROS'

export type StatusReceita =
    | 'NAO_TESTADA'
    | 'TESTADA_E_APROVADA'
    | 'TESTADA_E_REPROVADA'
    | 'PRECISA_DE_AJUSTES'

export interface Receita {
    id: number
    nome: string
    categoria: Categoria
    tempoPreparoMinutos: number | null
    rendimento: string | null
    dificuldade: Dificuldade | null
    imagemUrl: string | null
}

export interface ReceitaDetalhe extends Receita {
    ingredientes: string
    modoPreparo: string
    observacoes: string | null
    origem: OrigemReceita | null
    status: StatusReceita | null
}