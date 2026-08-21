import { Link } from 'react-router-dom'
import { Rodape } from '../components/Rodape'

export function HomePage() {
    return (
        <main className="pagina-home">
            <section className="home-painel">
                {/* Acesso rápido à área administrativa */}
                <div className="home-topo">
                    <Link
                        className="home-login-adm"
                        to="/login-adm"
                    >
                        Login adm
                    </Link>
                </div>

                {/* Conteúdo principal da página inicial */}
                <div className="home-conteudo">
                    <h1 className="home-titulo">
                        <span className="home-titulo-introducao">
                            Seja bem-vindo ao
                        </span>

                        <span className="home-titulo-principal">
                            Caderno digital de receitas da Andry
                        </span>
                    </h1>

                    {/* Ações principais de navegação */}
                    <div className="home-acoes">
                        <Link
                            className="home-botao"
                            to="/receitas"
                        >
                            Acessar receitas
                        </Link>

                        <Link
                            className="home-botao home-botao--secundario"
                            to="/sobre"
                        >
                            Sobre
                        </Link>
                    </div>
                </div>
            </section>

            {/* Rodapé compartilhado da aplicação */}
            <Rodape />
        </main>
    )
}