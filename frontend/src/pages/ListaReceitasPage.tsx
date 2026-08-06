import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { ReceitaCard } from '../components/ReceitaCard'
import { listarReceitas } from '../services/receitaService'
import type { Categoria, Receita } from '../types/Receita'

import './ListaReceitasPage.css'

type CategoriaSelecionada = 'TODAS' | Categoria

export function ListaReceitasPage() {
    const [receitas, setReceitas] = useState<Receita[]>([])
    const [busca, setBusca] = useState('')
    const [categoriaSelecionada, setCategoriaSelecionada] =
        useState<CategoriaSelecionada>('TODAS')
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(false)

    useEffect(() => {
        async function carregarReceitas() {
            try {
                const receitasCarregadas = await listarReceitas()
                setReceitas(receitasCarregadas)
            } catch {
                setErro(true)
            } finally {
                setCarregando(false)
            }
        }

        carregarReceitas()
    }, [])

    const receitasFiltradas = useMemo(() => {
        const termoPesquisado = busca.trim().toLowerCase()

        return receitas.filter((receita) => {
            const correspondeAoNome = receita.nome
                .toLowerCase()
                .includes(termoPesquisado)

            const correspondeACategoria =
                categoriaSelecionada === 'TODAS' ||
                receita.categoria === categoriaSelecionada

            return correspondeAoNome && correspondeACategoria
        })
    }, [busca, categoriaSelecionada, receitas])

    const paginaSemReceitas =
        carregando || erro || receitasFiltradas.length === 0

    return (
        <main
            className={`pagina-receitas ${paginaSemReceitas ? 'pagina-receitas--centralizada' : ''
                }`}
        >
            <section className="receitas-painel">
                <Link className="link-voltar" to="/">
                    ← Voltar ao início
                </Link>

                <header className="receitas-cabecalho">
                    <h1>Receitas</h1>

                    <input
                        className="campo-busca"
                        type="search"
                        value={busca}
                        onChange={(evento) => setBusca(evento.target.value)}
                        placeholder="Qual receita gostaria de fazer hoje?"
                        aria-label="Pesquisar receitas pelo nome"
                    />

                    <nav
                        className="filtros-categoria"
                        aria-label="Filtrar receitas por categoria"
                    >
                        <button
                            className={`filtro-categoria ${categoriaSelecionada === 'TODAS'
                                ? 'filtro-categoria--ativo'
                                : ''
                                }`}
                            type="button"
                            onClick={() => setCategoriaSelecionada('TODAS')}
                        >
                            Todas
                        </button>

                        <button
                            className={`filtro-categoria ${categoriaSelecionada === 'SALGADO'
                                ? 'filtro-categoria--ativo'
                                : ''
                                }`}
                            type="button"
                            onClick={() => setCategoriaSelecionada('SALGADO')}
                        >
                            Salgadas
                        </button>

                        <button
                            className={`filtro-categoria ${categoriaSelecionada === 'DOCE'
                                ? 'filtro-categoria--ativo'
                                : ''
                                }`}
                            type="button"
                            onClick={() => setCategoriaSelecionada('DOCE')}
                        >
                            Doces
                        </button>

                        <button
                            className={`filtro-categoria ${categoriaSelecionada === 'MISTO'
                                ? 'filtro-categoria--ativo'
                                : ''
                                }`}
                            type="button"
                            onClick={() => setCategoriaSelecionada('MISTO')}
                        >
                            Mistas
                        </button>
                    </nav>
                </header>

                {carregando && (
                    <p className="mensagem-centralizada">
                        Carregando receitas...
                    </p>
                )}

                {erro && (
                    <p className="mensagem-erro">
                        Não foi possível carregar as receitas neste momento.
                    </p>
                )}

                {!carregando && !erro && receitasFiltradas.length === 0 && (
                    <p className="mensagem-centralizada">
                        Nenhuma receita encontrada.
                    </p>
                )}

                {!carregando && !erro && receitasFiltradas.length > 0 && (
                    <div className="grade-receitas">
                        {receitasFiltradas.map((receita) => (
                            <ReceitaCard key={receita.id} receita={receita} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}