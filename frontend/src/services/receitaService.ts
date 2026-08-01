import type {
    Receita,
    ReceitaDetalhe,
} from '../types/Receita'

export async function listarReceitas(): Promise<Receita[]> {
    const resposta = await fetch('/api/receitas', {
        headers: {
            Accept: 'application/json',
        },
    })

    if (!resposta.ok) {
        throw new Error(
            `Não foi possível carregar as receitas. Status: ${resposta.status}`,
        )
    }

    return resposta.json() as Promise<Receita[]>
}

export async function buscarReceitaPorId(
    id: number,
): Promise<ReceitaDetalhe> {
    const resposta = await fetch(`/api/receitas/${id}`, {
        headers: {
            Accept: 'application/json',
        },
    })

    if (!resposta.ok) {
        throw new Error(
            `Não foi possível carregar a receita. Status: ${resposta.status}`,
        )
    }

    return resposta.json() as Promise<ReceitaDetalhe>
}