import { Link } from 'react-router-dom'

export function AdminInicioPage() {
    return (
        <main className="pagina-login-adm">
            <section className="login-adm-painel">
                <h1>Área administrativa</h1>

                <p>
                    Login realizado com sucesso. Esta será a página inicial
                    para o gerenciamento das receitas.
                </p>

                <Link className="login-botao" to="/">
                    Voltar ao início
                </Link>
            </section>
        </main>
    )
}