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

export type PrivacidadeReceita =
    | 'PUBLICA'
    | 'PRIVADA'

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

    ingredientesRecheio: string | null
    modoPreparoRecheio: string | null

    ingredientesCobertura: string | null
    modoPreparoCobertura: string | null
    imagens: string[]
    observacoes: string | null
    origem: OrigemReceita | null
    status: StatusReceita | null
}

export interface CriarReceitaDados {
    nome: string
    categoria: Categoria
    ingredientes: string
    modoPreparo: string
    ingredientesRecheio: string | null
    modoPreparoRecheio: string | null
    ingredientesCobertura: string | null
    modoPreparoCobertura: string | null
    imagensUrls: string[]
    observacoes: string | null
    tempoPreparoMinutos: number | null
    rendimento: string | null
    dificuldade: Dificuldade | null
    origem: OrigemReceita | null
    status: StatusReceita | null
    privacidade: PrivacidadeReceita | null
    favorita: boolean
    comentariosAtivos: boolean
}