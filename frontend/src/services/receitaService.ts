import { obterMensagemErro } from '../utils/api'
import { carregarCsrf } from '../utils/csrf'

import type {
    Receita,
    ReceitaDetalhe,
    SalvarReceitaDados,
} from '../types/Receita'

interface ImagemReceitaResposta {
    imagemUrl: string
}

// Lista as receitas públicas disponíveis para visitantes
export async function listarReceitas(): Promise<Receita[]> {
    const resposta = await fetch('/api/receitas', {
        headers: {
            Accept: 'application/json',
        },
    })

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível carregar as receitas.',
            ),
        )
    }

    return resposta.json() as Promise<Receita[]>
}

// Lista todas as receitas disponíveis na área administrativa
export async function listarReceitasAdmin(): Promise<Receita[]> {
    const resposta = await fetch('/api/admin/receitas', {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        },
    })

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível carregar as receitas administrativas.',
            ),
        )
    }

    return resposta.json() as Promise<Receita[]>
}

// Busca os detalhes de uma receita pública pelo ID
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
            await obterMensagemErro(
                resposta,
                'Não foi possível carregar a receita.',
            ),
        )
    }

    return resposta.json() as Promise<ReceitaDetalhe>
}

// Busca os detalhes completos de uma receita na área administrativa
export async function buscarReceitaAdminPorId(
    id: number,
): Promise<ReceitaDetalhe> {
    const resposta = await fetch(
        `/api/admin/receitas/${id}`,
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
            },
        },
    )

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível carregar a receita administrativa.',
            ),
        )
    }

    return resposta.json() as Promise<ReceitaDetalhe>
}

// Envia uma imagem ao backend e retorna a URL gerada
export async function enviarImagemReceita(
    arquivo: File,
): Promise<string> {
    const csrfToken = await carregarCsrf()

    const formulario = new FormData()
    formulario.append('imagem', arquivo)

    const resposta = await fetch('/api/receitas/imagens', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-XSRF-TOKEN': csrfToken,
        },
        body: formulario,
    })

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível enviar a imagem.',
            ),
        )
    }

    const dados =
        (await resposta.json()) as ImagemReceitaResposta

    return dados.imagemUrl
}

// Cadastra uma nova receita
export async function criarReceita(
    dados: SalvarReceitaDados,
): Promise<ReceitaDetalhe> {
    const csrfToken = await carregarCsrf()

    const resposta = await fetch('/api/receitas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(dados),
    })

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível cadastrar a receita.',
            ),
        )
    }

    return resposta.json() as Promise<ReceitaDetalhe>
}

// Atualiza uma receita existente na área administrativa
export async function atualizarReceita(
    id: number,
    dados: SalvarReceitaDados,
): Promise<ReceitaDetalhe> {
    const csrfToken = await carregarCsrf()

    const resposta = await fetch(
        `/api/admin/receitas/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(dados),
        },
    )

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível atualizar a receita.',
            ),
        )
    }

    return resposta.json() as Promise<ReceitaDetalhe>
}

// Exclui uma receita da área administrativa
export async function excluirReceita(
    id: number,
): Promise<void> {
    const csrfToken = await carregarCsrf()

    const resposta = await fetch(
        `/api/admin/receitas/${id}`,
        {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'X-XSRF-TOKEN': csrfToken,
            },
        },
    )

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível excluir a receita.',
            ),
        )
    }
}