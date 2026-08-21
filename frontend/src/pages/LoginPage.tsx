import { Link } from 'react-router-dom'

export function LoginPage() {
    return (
        <main className="pagina-login">
            <section className="login-painel">
                {/* Navegação de retorno para a página inicial */}
                <Link className="link-voltar" to="/">
                    ← Voltar ao início
                </Link>

                <h1>Fazer login</h1>

                {/* Opções de autenticação dos visitantes */}
                <div className="login-acoes">
                    <button
                        className="login-botao"
                        type="button"
                    >
                        Entrar com Google
                    </button>

                    <button
                        className="login-botao"
                        type="button"
                    >
                        Entrar com Facebook
                    </button>
                </div>
            </section>
        </main>
    )
}