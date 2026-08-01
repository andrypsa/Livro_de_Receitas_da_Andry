import type { Receita } from '../types/Receita'

export async function listarReceitasPublicas(): Promise<Receita[]> {
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