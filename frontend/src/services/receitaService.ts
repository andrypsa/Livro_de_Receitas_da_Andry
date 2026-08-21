import type {
    CriarReceitaDados,
    Receita,
    ReceitaDetalhe,
} from '../types/Receita'

interface ImagemReceitaResposta {
    imagemUrl: string
}

interface ErroApi {
    mensagem?: string
}

// Lê um cookie pelo nome para recuperar o token CSRF
function lerCookie(nome: string): string | null {
    const prefixo = `${nome}=`

    const cookie = document.cookie
        .split('; ')
        .find((item) => item.startsWith(prefixo))

    return cookie
        ? decodeURIComponent(
            cookie.substring(prefixo.length),
        )
        : null
}

// Prepara e recupera o token CSRF usado nas requisições protegidas
async function carregarCsrf(): Promise<string> {
    const resposta = await fetch('/api/auth/admin/csrf', {
        method: 'GET',
        credentials: 'include',
    })

    if (!resposta.ok) {
        throw new Error(
            `Não foi possível preparar a sessão segura. Status: ${resposta.status}`,
        )
    }

    const token = lerCookie('XSRF-TOKEN')

    if (!token) {
        throw new Error(
            'O token de segurança não foi encontrado.',
        )
    }

    return token
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
            `Não foi possível carregar as receitas. Status: ${resposta.status}`,
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
            `Não foi possível carregar as receitas administrativas. Status: ${resposta.status}`,
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
            `Não foi possível carregar a receita. Status: ${resposta.status}`,
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
            `Não foi possível carregar a receita administrativa. Status: ${resposta.status}`,
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
        const erro = (await resposta
            .json()
            .catch(() => ({}))) as ErroApi

        throw new Error(
            erro.mensagem ??
            `Não foi possível enviar a imagem. Status: ${resposta.status}`,
        )
    }

    const dados =
        (await resposta.json()) as ImagemReceitaResposta

    return dados.imagemUrl
}

// Cadastra uma nova receita
export async function criarReceita(
    dados: CriarReceitaDados,
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
        const erro = (await resposta
            .json()
            .catch(() => ({}))) as ErroApi

        throw new Error(
            erro.mensagem ??
            `Não foi possível cadastrar a receita. Status: ${resposta.status}`,
        )
    }

    return resposta.json() as Promise<ReceitaDetalhe>
}

// Atualiza uma receita existente na área administrativa
export async function atualizarReceita(
    id: number,
    dados: CriarReceitaDados,
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
        const erro = (await resposta
            .json()
            .catch(() => ({}))) as ErroApi

        throw new Error(
            erro.mensagem ??
            `Não foi possível atualizar a receita. Status: ${resposta.status}`,
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
        const erro = (await resposta
            .json()
            .catch(() => ({}))) as ErroApi

        throw new Error(
            erro.mensagem ??
            `Não foi possível excluir a receita. Status: ${resposta.status}`,
        )
    }
}