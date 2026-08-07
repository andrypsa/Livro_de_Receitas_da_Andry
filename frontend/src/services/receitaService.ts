import type {
    CriarReceitaDados,
    Receita,
    ReceitaDetalhe,
} from '../types/Receita'

interface ImagemReceitaResposta {
    imagemUrl: string
}

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

export async function enviarImagemReceita(
    arquivo: File,
): Promise<string> {
    const formulario = new FormData()
    formulario.append('imagem', arquivo)

    const resposta = await fetch('/api/receitas/imagens', {
        method: 'POST',
        credentials: 'include',
        body: formulario,
    })

    if (!resposta.ok) {
        const erro = await resposta
            .json()
            .catch(() => null)

        throw new Error(
            erro?.mensagem ??
            'Não foi possível enviar a imagem.',
        )
    }

    const dados =
        (await resposta.json()) as ImagemReceitaResposta

    return dados.imagemUrl
}

export async function criarReceita(
    dados: CriarReceitaDados,
): Promise<ReceitaDetalhe> {
    const resposta = await fetch('/api/receitas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dados),
    })

    if (!resposta.ok) {
        const erro = await resposta
            .json()
            .catch(() => null)

        throw new Error(
            erro?.mensagem ??
            'Não foi possível cadastrar a receita.',
        )
    }

    return resposta.json() as Promise<ReceitaDetalhe>
}