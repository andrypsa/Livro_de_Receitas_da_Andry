interface LoginAdministradorDados {
    email: string
    senha: string
}

interface CriarPrimeiroAdministradorDados {
    nome: string
    email: string
    senha: string
}

interface LoginAdministradorResposta {
    email: string
    mensagem: string
}

interface AdministradorCriadoResposta {
    id: number
    nome: string
    email: string
}

interface MensagemResposta {
    mensagem: string
}

export interface SessaoAdministradorResposta {
    autenticado: boolean
    email: string
}

interface ErroApi {
    mensagem?: string
    campos?: Record<string, string>
}

async function obterMensagemErro(
    resposta: Response,
    mensagemPadrao: string,
): Promise<string> {
    const erro = (await resposta
        .json()
        .catch(() => ({}))) as ErroApi

    const primeiroErroDeCampo = erro.campos
        ? Object.values(erro.campos)[0]
        : undefined

    return primeiroErroDeCampo ?? erro.mensagem ?? mensagemPadrao
}

export async function criarPrimeiroAdministrador(
    dados: CriarPrimeiroAdministradorDados,
): Promise<AdministradorCriadoResposta> {
    const resposta = await fetch(
        '/api/auth/admin/primeiro-acesso',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(dados),
        },
    )

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível criar o administrador.',
            ),
        )
    }

    return resposta.json() as Promise<AdministradorCriadoResposta>
}

export async function loginAdministrador(
    dados: LoginAdministradorDados,
): Promise<LoginAdministradorResposta> {
    const resposta = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dados),
    })

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível realizar o login.',
            ),
        )
    }

    return resposta.json() as Promise<LoginAdministradorResposta>
}

export async function consultarSessaoAdministrador():
    Promise<SessaoAdministradorResposta> {
    const resposta = await fetch('/api/auth/admin/sessao', {
        method: 'GET',
        credentials: 'include',
    })

    if (!resposta.ok) {
        throw new Error('Sessão administrativa não encontrada.')
    }

    return resposta.json() as Promise<SessaoAdministradorResposta>
}

export async function logoutAdministrador():
    Promise<MensagemResposta> {
    const resposta = await fetch('/api/auth/admin/logout', {
        method: 'POST',
        credentials: 'include',
    })

    if (!resposta.ok) {
        throw new Error('Não foi possível encerrar a sessão.')
    }

    return resposta.json() as Promise<MensagemResposta>
}

export async function carregarCsrf(): Promise<void> {
    const resposta = await fetch('/api/auth/admin/csrf', {
        method: 'GET',
        credentials: 'include',
    })

    if (!resposta.ok) {
        throw new Error('Não foi possível preparar a sessão segura.')
    }
}