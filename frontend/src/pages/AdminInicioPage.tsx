import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ReceitaCard } from '../components/ReceitaCard'
import { logoutAdministrador } from '../services/adminAuthService'
import { listarReceitasAdmin } from '../services/receitaService'
import type { Receita } from '../types/Receita'

import './ListaReceitasPage.css'

export function AdminInicioPage() {
    const navigate = useNavigate()

    const [receitas, setReceitas] = useState<Receita[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erroReceitas, setErroReceitas] = useState('')
    const [erroLogout, setErroLogout] = useState('')
    const [saindo, setSaindo] = useState(false)

    useEffect(() => {
        async function carregarReceitas() {
            try {
                const receitasCarregadas = await listarReceitasAdmin()
                setReceitas(receitasCarregadas)
            } catch {
                setErroReceitas(
                    'Não foi possível carregar as receitas neste momento.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarReceitas()
    }, [])

    async function sair() {
        setErroLogout('')
        setSaindo(true)

        try {
            await logoutAdministrador()
            navigate('/login-adm', { replace: true })
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível encerrar a sessão.'

            setErroLogout(mensagem)
        } finally {
            setSaindo(false)
        }
    }

    return (
        <main
            className={`pagina-receitas ${carregando || erroReceitas || receitas.length === 0
                ? 'pagina-receitas--centralizada'
                : ''
                }`}
        >
            <section className="receitas-painel">
                <header className="receitas-cabecalho">
                    <h1>Área administrativa</h1>

                    <p>
                        Gerencie as receitas cadastradas no sistema.
                    </p>
                    <p>
                        Total de receitas carregadas: {receitas.length}
                    </p>
                    <Link
                        className="login-botao"
                        to="/admin/receitas/nova"
                    >
                        Nova receita
                    </Link>

                    <button
                        className="login-botao"
                        type="button"
                        onClick={sair}
                        disabled={saindo}
                    >
                        {saindo ? 'Saindo...' : 'Sair'}
                    </button>
                </header>

                {erroLogout && (
                    <p className="mensagem-login mensagem-login--erro">
                        {erroLogout}
                    </p>
                )}

                {carregando && (
                    <p className="mensagem-centralizada">
                        Carregando receitas...
                    </p>
                )}

                {erroReceitas && (
                    <p className="mensagem-erro">
                        {erroReceitas}
                    </p>
                )}

                {!carregando &&
                    !erroReceitas &&
                    receitas.length === 0 && (
                        <p className="mensagem-centralizada">
                            Nenhuma receita cadastrada.
                        </p>
                    )}

                {!carregando &&
                    !erroReceitas &&
                    receitas.length > 0 && (
                        <div className="grade-receitas">
                            {receitas.map((receita) => (
                                <ReceitaCard
                                    key={receita.id}
                                    receita={receita}
                                    modoAdmin
                                />
                            ))}
                        </div>
                    )}
            </section>
        </main>
    )
}