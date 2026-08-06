interface LoginAdministradorDados {
    email: string
    senha: string
}

interface LoginAdministradorResposta {
    email: string
    mensagem: string
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
        const erro = (await resposta
            .json()
            .catch(() => ({}))) as ErroApi

        throw new Error(
            erro.mensagem ?? 'Não foi possível realizar o login.',
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