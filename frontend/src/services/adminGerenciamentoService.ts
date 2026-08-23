import { obterMensagemErro } from '../utils/api'
import { carregarCsrf } from '../utils/csrf'

export interface AdministradorResumo {
    id: number
    nome: string
    email: string
    ativo: boolean
    primeiroAdministrador: boolean
}

export interface AdministradoresResposta {
    principal: AdministradorResumo
    secundarios: AdministradorResumo[]
}

export interface ConviteAdministradorResposta {
    id: number
    nome: string
    email: string
    token: string
    expiraEm: string
}

interface GerarConviteDados {
    nome: string
    email: string
}

// Lista o administrador principal e os administradores secundários
export async function listarAdministradores():
    Promise<AdministradoresResposta> {

    const resposta = await fetch(
        '/api/admin/administradores',
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
                'Não foi possível carregar os administradores.',
            ),
        )
    }

    return resposta.json() as
        Promise<AdministradoresResposta>
}

// Gera um convite para um novo administrador secundário
export async function gerarConviteAdministrador(
    dados: GerarConviteDados,
): Promise<ConviteAdministradorResposta> {

    const csrfToken = await carregarCsrf()

    const resposta = await fetch(
        '/api/admin/administradores/convites',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(dados),
        },
    )

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível gerar o convite.',
            ),
        )
    }

    return resposta.json() as
        Promise<ConviteAdministradorResposta>
}

// Desativa o acesso de um administrador secundário
export async function desativarAdministrador(
    id: number,
): Promise<AdministradorResumo> {

    const csrfToken = await carregarCsrf()

    const resposta = await fetch(
        `/api/admin/administradores/${id}/desativar`,
        {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'X-XSRF-TOKEN': csrfToken,
            },
        },
    )

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível desativar o administrador.',
            ),
        )
    }

    return resposta.json() as
        Promise<AdministradorResumo>
}

// Reativa um administrador secundário desativado
export async function reativarAdministrador(
    id: number,
): Promise<AdministradorResumo> {

    const csrfToken = await carregarCsrf()

    const resposta = await fetch(
        `/api/admin/administradores/${id}/reativar`,
        {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'X-XSRF-TOKEN': csrfToken,
            },
        },
    )

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível reativar o administrador.',
            ),
        )
    }

    return resposta.json() as
        Promise<AdministradorResumo>
}