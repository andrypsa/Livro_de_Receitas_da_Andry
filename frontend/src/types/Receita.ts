// Tipos utilizados para representar os valores aceitos pelo backend
export type Categoria =
    | 'DOCE'
    | 'SALGADO'
    | 'MISTO'

export type Dificuldade =
    | 'FACIL'
    | 'MEDIA'
    | 'DIFICIL'

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

// Representa os dados resumidos de uma receita usados nas listagens
export interface Receita {
    id: number
    nome: string
    categoria: Categoria
    tempoPreparoMinutos: number | null
    rendimento: string | null
    dificuldade: Dificuldade | null
    imagemUrl: string | null
}

// Representa os dados completos exibidos na página de detalhes
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
    privacidade: PrivacidadeReceita
    favorita: boolean
    comentariosAtivos: boolean
}

// Representa os dados enviados ao backend no cadastro e edição de receitas
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