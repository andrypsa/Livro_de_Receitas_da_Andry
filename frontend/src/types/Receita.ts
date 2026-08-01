export type Categoria = 'DOCE' | 'SALGADO' | 'MISTO'

export type Dificuldade = 'FACIL' | 'MEDIA' | 'DIFICIL'

export interface Receita {
    id: number
    nome: string
    categoria: Categoria
    tempoPreparoMinutos: number | null
    rendimento: string | null
    dificuldade: Dificuldade | null
    imagemUrl: string | null
}