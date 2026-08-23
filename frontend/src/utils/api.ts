interface ErroApi {
    mensagem?: string
    campos?: Record<string, string>
}

// Extrai a mensagem de erro retornada pela API
export async function obterMensagemErro(
    resposta: Response,
    mensagemPadrao: string,
): Promise<string> {
    const erro = (await resposta
        .json()
        .catch(() => ({}))) as ErroApi

    const primeiroErroDeCampo = erro.campos
        ? Object.values(erro.campos)[0]
        : undefined

    return primeiroErroDeCampo ??
        erro.mensagem ??
        `${mensagemPadrao} Status: ${resposta.status}`
}