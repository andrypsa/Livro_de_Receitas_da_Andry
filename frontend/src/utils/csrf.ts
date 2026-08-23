import { obterMensagemErro } from './api'

// Lê um cookie pelo nome informado
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

// Prepara a sessão e retorna o token CSRF usado nas requisições protegidas
export async function carregarCsrf(): Promise<string> {
    const resposta = await fetch('/api/auth/admin/csrf', {
        method: 'GET',
        credentials: 'include',
    })

    if (!resposta.ok) {
        throw new Error(
            await obterMensagemErro(
                resposta,
                'Não foi possível preparar a sessão segura.',
            ),
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