import { obterMensagemErro } from '../utils/api'

export interface ConviteAdministradorPublico {
    nome: string
    email: string
    expiraEm: string
}

interface AdministradorCriadoResposta {
    id: number
    nome: string
    email: string
}

// Consulta os dados públicos de um convite pelo token
export async function consultarConviteAdministrador(
    token: string,
): Promise<ConviteAdministradorPublico> {
    const resposta = await fetch(
        `/api/convites-administrador/${encodeURIComponent(token)}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        },
    )

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível consultar o convite.',
            ),
        )
    }

    return resposta.json() as
        Promise<ConviteAdministradorPublico>
}

// Conclui o convite definindo a senha do novo administrador
export async function concluirConviteAdministrador(
    token: string,
    senha: string,
): Promise<AdministradorCriadoResposta> {
    const resposta = await fetch(
        `/api/convites-administrador/${encodeURIComponent(token)}/concluir`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                senha,
            }),
        },
    )

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível concluir o cadastro.',
            ),
        )
    }

    return resposta.json() as
        Promise<AdministradorCriadoResposta>
}