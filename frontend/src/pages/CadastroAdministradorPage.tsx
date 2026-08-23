import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import {
    concluirConviteAdministrador,
    consultarConviteAdministrador,
} from '../services/conviteAdministradorService'

import type {
    ConviteAdministradorPublico,
} from '../services/conviteAdministradorService'

export function CadastroAdministradorPage() {
    const [parametros] = useSearchParams()

    const token =
        parametros.get('token')?.trim() ?? ''

    const [convite, setConvite] =
        useState<ConviteAdministradorPublico | null>(null)

    const [senha, setSenha] =
        useState('')

    const [confirmacaoSenha, setConfirmacaoSenha] =
        useState('')

    const [carregando, setCarregando] =
        useState(Boolean(token))

    const [salvando, setSalvando] =
        useState(false)

    const [erro, setErro] =
        useState('')

    const [cadastroConcluido, setCadastroConcluido] =
        useState(false)

    // Consulta e valida o convite recebido pelo link
    useEffect(() => {
        if (!token) {
            return
        }

        consultarConviteAdministrador(token)
            .then((conviteCarregado) => {
                setConvite(conviteCarregado)
            })
            .catch((erroRecebido: unknown) => {
                const mensagem =
                    erroRecebido instanceof Error
                        ? erroRecebido.message
                        : 'Não foi possível carregar o convite.'

                setErro(mensagem)
            })
            .finally(() => {
                setCarregando(false)
            })
    }, [token])

    // Define a senha e conclui o cadastro do novo administrador
    async function concluirCadastro(
        evento: FormEvent<HTMLFormElement>,
    ) {
        evento.preventDefault()

        setErro('')

        if (senha.length < 8) {
            setErro(
                'A senha deve ter pelo menos 8 caracteres.',
            )
            return
        }

        if (senha !== confirmacaoSenha) {
            setErro(
                'As senhas informadas não coincidem.',
            )
            return
        }

        setSalvando(true)

        try {
            await concluirConviteAdministrador(
                token,
                senha,
            )

            setCadastroConcluido(true)
            setSenha('')
            setConfirmacaoSenha('')
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível concluir o cadastro.'

            setErro(mensagem)
        } finally {
            setSalvando(false)
        }
    }

    if (!token) {
        return (
            <main className="pagina-login-adm">
                <section className="login-adm-painel">
                    <h1>
                        Convite indisponível
                    </h1>

                    <p className="mensagem-erro">
                        O link do convite é inválido.
                    </p>

                    <Link
                        className="link-voltar"
                        to="/"
                    >
                        ← Voltar para página inicial
                    </Link>
                </section>
            </main>
        )
    }

    if (carregando) {
        return (
            <main className="pagina-login-adm">
                <section className="login-adm-painel">
                    <p className="mensagem-centralizada">
                        Validando convite...
                    </p>
                </section>
            </main>
        )
    }

    if (cadastroConcluido) {
        return (
            <main className="pagina-login-adm">
                <section className="login-adm-painel">
                    <h1>
                        Cadastro concluído
                    </h1>

                    <p>
                        Seu acesso administrativo foi
                        criado com sucesso.
                    </p>

                    <Link
                        className="login-botao"
                        to="/login-adm"
                    >
                        Ir para o login
                    </Link>
                </section>
            </main>
        )
    }

    if (erro && !convite) {
        return (
            <main className="pagina-login-adm">
                <section className="login-adm-painel">
                    <h1>
                        Convite indisponível
                    </h1>

                    <p className="mensagem-erro">
                        {erro}
                    </p>

                    <Link
                        className="link-voltar"
                        to="/"
                    >
                        ← Voltar para página inicial
                    </Link>
                </section>
            </main>
        )
    }

    return (
        <main className="pagina-login-adm">
            <section className="login-adm-painel">
                <h1>
                    Cadastro de administrador
                </h1>

                {convite && (
                    <>
                        <p>
                            Olá, <strong>{convite.nome}</strong>.
                        </p>

                        <p>
                            O convite foi enviado para{' '}
                            <strong>
                                {convite.email}
                            </strong>.
                        </p>
                    </>
                )}

                <form
                    className="login-adm-formulario"
                    onSubmit={concluirCadastro}
                >
                    <label className="login-adm-campo">
                        <span>
                            Crie sua senha
                        </span>

                        <input
                            type="password"
                            value={senha}
                            onChange={(evento) =>
                                setSenha(
                                    evento.target.value,
                                )
                            }
                            minLength={8}
                            maxLength={100}
                            autoComplete="new-password"
                            required
                        />
                    </label>

                    <label className="login-adm-campo">
                        <span>
                            Confirme sua senha
                        </span>

                        <input
                            type="password"
                            value={confirmacaoSenha}
                            onChange={(evento) =>
                                setConfirmacaoSenha(
                                    evento.target.value,
                                )
                            }
                            minLength={8}
                            maxLength={100}
                            autoComplete="new-password"
                            required
                        />
                    </label>

                    {erro && (
                        <p className="mensagem-login mensagem-login--erro">
                            {erro}
                        </p>
                    )}

                    <button
                        className="login-botao"
                        type="submit"
                        disabled={salvando}
                    >
                        {salvando
                            ? 'Criando acesso...'
                            : 'Criar acesso'}
                    </button>
                </form>
            </section>
        </main>
    )
}