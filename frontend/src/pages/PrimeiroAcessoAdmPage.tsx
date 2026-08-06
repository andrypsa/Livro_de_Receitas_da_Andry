import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { criarPrimeiroAdministrador } from '../services/adminAuthService'

export function PrimeiroAcessoAdmPage() {
    const navigate = useNavigate()

    const [nome, setNome] = useState('')
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
            await criarPrimeiroAdministrador({
                nome,
                email,
                senha,
            })

            navigate('/login-adm', { replace: true })
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível criar o administrador.'

            setErro(mensagem)
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

                <h1>Primeiro acesso administrativo</h1>

                <p>
                    Cadastre o primeiro administrador do sistema.
                </p>

                <form
                    className="login-adm-formulario"
                    onSubmit={enviarFormulario}
                >
                    <label className="login-adm-campo">
                        <span>Nome</span>

                        <input
                            type="text"
                            value={nome}
                            onChange={(evento) => setNome(evento.target.value)}
                            autoComplete="name"
                            disabled={enviando}
                            required
                        />
                    </label>

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
                                autoComplete="new-password"
                                minLength={8}
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
                        {enviando
                            ? 'Cadastrando...'
                            : 'Cadastrar administrador'}
                    </button>
                </form>
            </section>
        </main>
    )
}