import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ReceitaCard } from '../components/ReceitaCard'
import {
    consultarSessaoAdministrador,
    logoutAdministrador,
} from '../services/adminAuthService'
import { listarReceitasAdmin } from '../services/receitaService'
import type {
    Categoria,
    Receita,
} from '../types/Receita'

import './ListaReceitasPage.css'

export function AdminInicioPage() {
    const navigate = useNavigate()

    const [administradorPrincipal, setAdministradorPrincipal] =
        useState(false)

    const [receitas, setReceitas] =
        useState<Receita[]>([])

    const [carregando, setCarregando] =
        useState(true)

    const [erroReceitas, setErroReceitas] =
        useState('')

    const [erroLogout, setErroLogout] =
        useState('')

    const [saindo, setSaindo] =
        useState(false)

    const [busca, setBusca] =
        useState('')

    const [categoriaSelecionada, setCategoriaSelecionada] =
        useState<Categoria | 'TODAS'>('TODAS')

    // Filtra as receitas administrativas por nome e categoria
    const receitasFiltradas = useMemo(() => {
        const termoBusca = busca
            .trim()
            .toLocaleLowerCase('pt-BR')

        return receitas.filter((receita) => {
            const correspondeBusca =
                receita.nome
                    .toLocaleLowerCase('pt-BR')
                    .includes(termoBusca)

            const correspondeCategoria =
                categoriaSelecionada === 'TODAS' ||
                receita.categoria === categoriaSelecionada

            return correspondeBusca && correspondeCategoria
        })
    }, [
        receitas,
        busca,
        categoriaSelecionada,
    ])

    // Carrega as receitas e identifica o tipo de administrador autenticado
    useEffect(() => {
        async function carregarDadosAdministrativos() {
            try {
                const [
                    receitasCarregadas,
                    sessao,
                ] = await Promise.all([
                    listarReceitasAdmin(),
                    consultarSessaoAdministrador(),
                ])

                setReceitas(receitasCarregadas)
                setAdministradorPrincipal(
                    sessao.principal,
                )
            } catch {
                setErroReceitas(
                    'Não foi possível carregar os dados administrativos.',
                )
            } finally {
                setCarregando(false)
            }
        }

        carregarDadosAdministrativos()
    }, [])

    // Encerra a sessão do administrador e retorna para a tela de login
    async function sair() {
        setErroLogout('')
        setSaindo(true)

        try {
            await logoutAdministrador()

            navigate(
                '/login-adm',
                { replace: true },
            )
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
            className={`pagina-receitas ${carregando ||
                erroReceitas ||
                receitas.length === 0
                ? 'pagina-receitas--centralizada'
                : ''
                }`}
        >
            <section className="receitas-painel">
                <header className="receitas-cabecalho">
                    <button
                        className="botao-sair-admin"
                        type="button"
                        onClick={sair}
                        disabled={saindo}
                    >
                        {saindo ? 'Saindo...' : 'Sair'}
                    </button>

                    <h1>Área administrativa</h1>

                    {administradorPrincipal && (
                        <Link
                            className="botao-admin-menor"
                            to="/admin/administradores"
                        >
                            Gerenciar administradores
                        </Link>
                    )}

                    <p>
                        Gerencie as receitas cadastradas no sistema.
                    </p>

                    <input
                        className="campo-busca"
                        type="search"
                        placeholder="Buscar receita por nome..."
                        value={busca}
                        onChange={(evento) =>
                            setBusca(evento.target.value)
                        }
                    />

                    <div className="filtros-categoria">
                        <Link
                            className="botao-nova-receita"
                            to="/admin/receitas/nova"
                        >
                            Nova receita
                        </Link>
                        <button
                            className={`filtro-categoria ${categoriaSelecionada === 'TODAS'
                                ? 'filtro-categoria--ativo'
                                : ''
                                }`}
                            type="button"
                            onClick={() =>

                                setCategoriaSelecionada('TODAS')
                            }
                        >
                            Todas
                        </button>

                        <button
                            className={`filtro-categoria ${categoriaSelecionada === 'SALGADO'
                                ? 'filtro-categoria--ativo'
                                : ''
                                }`}
                            type="button"
                            onClick={() =>
                                setCategoriaSelecionada('SALGADO')
                            }
                        >
                            Salgadas
                        </button>

                        <button
                            className={`filtro-categoria ${categoriaSelecionada === 'DOCE'
                                ? 'filtro-categoria--ativo'
                                : ''
                                }`}
                            type="button"
                            onClick={() =>
                                setCategoriaSelecionada('DOCE')
                            }
                        >
                            Doces
                        </button>

                        <button
                            className={`filtro-categoria ${categoriaSelecionada === 'MISTO'
                                ? 'filtro-categoria--ativo'
                                : ''
                                }`}
                            type="button"
                            onClick={() =>
                                setCategoriaSelecionada('MISTO')
                            }
                        >
                            Mistas
                        </button>
                    </div>
                </header>

                {/* Exibe mensagens e estados do carregamento da área administrativa */}
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
                    receitas.length > 0 &&
                    receitasFiltradas.length === 0 && (
                        <p className="mensagem-centralizada">
                            Nenhuma receita encontrada com os filtros selecionados.
                        </p>
                    )}

                {!carregando &&
                    !erroReceitas &&
                    receitasFiltradas.length > 0 && (
                        <div className="grade-receitas">
                            {receitasFiltradas.map((receita) => (
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