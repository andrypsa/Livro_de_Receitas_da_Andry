import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { loginAdministrador } from '../services/adminAuthService'

export function LoginAdmPage() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)

    async function enviarFormulario(
        evento: FormEvent<HTMLFormElement>,
    ) {
        evento.preventDefault()

        setErro('')
        setEnviando(true)

        try {
            await loginAdministrador({
                email,
                senha,
            })

            setSenha('')
            setMostrarSenha(false)

            navigate('/admin')
        } catch (erroRecebido) {
            const mensagemDeErro =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível realizar o login.'

            setErro(mensagemDeErro)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main className="pagina-login-adm">
            <section className="login-adm-painel">
                <Link className="link-voltar" to="/">
                    ← Voltar ao início
                </Link>

                <h1>Login administrativo</h1>

                <form
                    className="login-adm-formulario"
                    onSubmit={enviarFormulario}
                >
                    <label className="login-adm-campo">
                        <span>E-mail</span>

                        <input
                            type="email"
                            value={email}
                            onChange={(evento) => setEmail(evento.target.value)}
                            autoComplete="email"
                            disabled={enviando}
                            required
                        />
                    </label>

                    <label className="login-adm-campo">
                        <span>Senha</span>

                        <div className="campo-senha">
                            <input
                                type={mostrarSenha ? 'text' : 'password'}
                                value={senha}
                                onChange={(evento) => setSenha(evento.target.value)}
                                autoComplete="current-password"
                                disabled={enviando}
                                required
                            />

                            <button
                                className="botao-mostrar-senha"
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                disabled={enviando}
                                aria-label={
                                    mostrarSenha
                                        ? 'Ocultar senha'
                                        : 'Mostrar senha'
                                }
                                title={
                                    mostrarSenha
                                        ? 'Ocultar senha'
                                        : 'Mostrar senha'
                                }
                            >
                                {mostrarSenha ? '🙈' : '👁'}
                            </button>
                        </div>
                    </label>

                    {erro && (
                        <p className="mensagem-login mensagem-login--erro">
                            {erro}
                        </p>
                    )}

                    <button
                        className="login-botao"
                        type="submit"
                        disabled={enviando}
                    >
                        {enviando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </section>
        </main>
    )
}