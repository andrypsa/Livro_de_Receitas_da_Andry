import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

export function LoginAdmPage() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()

        /*
         * A autenticação real será conectada ao back-end posteriormente.
         * Não coloque e-mail ou senha reais diretamente neste arquivo.
         */
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
                            required
                        />
                    </label>

                    <label className="login-adm-campo">
                        <span>Senha</span>

                        <input
                            type="password"
                            value={senha}
                            onChange={(evento) => setSenha(evento.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    <button className="login-botao" type="submit">
                        Entrar
                    </button>
                </form>
            </section>
        </main>
    )
}