interface LoginAdministradorDados {
    email: string
    senha: string
}

interface LoginAdministradorResposta {
    email: string
    mensagem: string
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