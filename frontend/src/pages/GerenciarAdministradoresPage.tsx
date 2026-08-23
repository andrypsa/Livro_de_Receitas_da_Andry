import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
    desativarAdministrador,
    gerarConviteAdministrador,
    listarAdministradores,
    reativarAdministrador,
} from '../services/adminGerenciamentoService'

import type {
    AdministradorResumo,
    AdministradoresResposta,
    ConviteAdministradorResposta,
} from '../services/adminGerenciamentoService'

export function GerenciarAdministradoresPage() {
    const [dados, setDados] =
        useState<AdministradoresResposta | null>(null)

    const [nomeConvite, setNomeConvite] =
        useState('')

    const [emailConvite, setEmailConvite] =
        useState('')

    const [conviteGerado, setConviteGerado] =
        useState<ConviteAdministradorResposta | null>(null)

    const [carregando, setCarregando] =
        useState(true)

    const [processando, setProcessando] =
        useState(false)

    const [erro, setErro] =
        useState('')

    // Carrega os administradores cadastrados no sistema
    useEffect(() => {
        carregarAdministradores()
    }, [])

    async function carregarAdministradores() {
        setErro('')

        try {
            const resposta =
                await listarAdministradores()

            setDados(resposta)
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível carregar os administradores.'

            setErro(mensagem)
        } finally {
            setCarregando(false)
        }
    }

    // Gera um novo convite para administrador secundário
    async function gerarConvite() {
        setErro('')
        setProcessando(true)
        setConviteGerado(null)

        try {
            const convite =
                await gerarConviteAdministrador({
                    nome: nomeConvite,
                    email: emailConvite,
                })

            setConviteGerado(convite)
            setNomeConvite('')
            setEmailConvite('')
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível gerar o convite.'

            setErro(mensagem)
        } finally {
            setProcessando(false)
        }
    }

    // Desativa o acesso de um administrador secundário
    async function desativar(
        administrador: AdministradorResumo,
    ) {
        const confirmou = window.confirm(
            `Deseja remover o acesso de ${administrador.nome}?`,
        )

        if (!confirmou) {
            return
        }

        setErro('')
        setProcessando(true)

        try {
            await desativarAdministrador(
                administrador.id,
            )

            await carregarAdministradores()
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível desativar o administrador.'

            setErro(mensagem)
        } finally {
            setProcessando(false)
        }
    }

    // Reativa um administrador secundário desativado
    async function reativar(
        administrador: AdministradorResumo,
    ) {
        setErro('')
        setProcessando(true)

        try {
            await reativarAdministrador(
                administrador.id,
            )

            await carregarAdministradores()
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível reativar o administrador.'

            setErro(mensagem)
        } finally {
            setProcessando(false)
        }
    }

    // Copia o link do convite para a área de transferência
    async function copiarLinkConvite() {
        if (!conviteGerado) {
            return
        }

        const link =
            `${window.location.origin}/cadastro-administrador?token=${conviteGerado.token}`

        await navigator.clipboard.writeText(link)
    }

    const existeSegundoAtivo =
        dados?.secundarios.some(
            (administrador) =>
                administrador.ativo,
        ) ?? false

    if (carregando) {
        return (
            <main className="pagina-receitas">
                <section className="receitas-painel">
                    <p className="mensagem-centralizada">
                        Carregando administradores...
                    </p>
                </section>
            </main>
        )
    }

    return (
        <main className="pagina-receitas">
            <section className="receitas-painel">
                <Link
                    className="link-voltar"
                    to="/admin"
                >
                    ← Voltar para área administrativa
                </Link>

                <header className="receitas-cabecalho">
                    <h1>
                        Gerenciar administradores
                    </h1>

                    <p>
                        Gerencie o acesso administrativo
                        do sistema.
                    </p>
                </header>

                {erro && (
                    <p className="mensagem-erro">
                        {erro}
                    </p>
                )}

                {dados && (
                    <>
                        <section className="bloco-receita">
                            <h2>
                                Administrador principal
                            </h2>

                            <p>
                                <strong>Nome:</strong>{' '}
                                {dados.principal.nome}
                            </p>

                            <p>
                                <strong>E-mail:</strong>{' '}
                                {dados.principal.email}
                            </p>

                            <p>
                                <strong>Status:</strong>{' '}
                                Ativo
                            </p>
                        </section>

                        <section className="bloco-receita">
                            <h2>
                                Administradores secundários
                            </h2>

                            {dados.secundarios.length === 0 && (
                                <p>
                                    Nenhum administrador
                                    secundário cadastrado.
                                </p>
                            )}

                            {dados.secundarios.map(
                                (administrador) => (
                                    <div
                                        key={
                                            administrador.id
                                        }
                                    >
                                        <p>
                                            <strong>
                                                Nome:
                                            </strong>{' '}
                                            {
                                                administrador.nome
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                E-mail:
                                            </strong>{' '}
                                            {
                                                administrador.email
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>{' '}
                                            {administrador.ativo
                                                ? 'Ativo'
                                                : 'Desativado'}
                                        </p>

                                        {administrador.ativo ? (
                                            <button
                                                className="botao botao--pequeno"
                                                type="button"
                                                disabled={
                                                    processando
                                                }
                                                onClick={() =>
                                                    desativar(
                                                        administrador,
                                                    )
                                                }
                                            >
                                                Remover acesso
                                            </button>
                                        ) : (
                                            <button
                                                className="botao botao--pequeno"
                                                type="button"
                                                disabled={
                                                    processando ||
                                                    existeSegundoAtivo
                                                }
                                                onClick={() =>
                                                    reativar(
                                                        administrador,
                                                    )
                                                }
                                            >
                                                Reativar
                                            </button>
                                        )}
                                    </div>
                                ),
                            )}
                        </section>

                        {!existeSegundoAtivo && (
                            <section className="bloco-receita">
                                <h2>
                                    Convidar administrador
                                </h2>

                                <label className="login-adm-campo">
                                    <span>
                                        Nome
                                    </span>

                                    <input
                                        type="text"
                                        value={nomeConvite}
                                        onChange={(evento) =>
                                            setNomeConvite(
                                                evento.target.value,
                                            )
                                        }
                                        maxLength={120}
                                    />
                                </label>

                                <label className="login-adm-campo">
                                    <span>
                                        E-mail
                                    </span>

                                    <input
                                        type="email"
                                        value={emailConvite}
                                        onChange={(evento) =>
                                            setEmailConvite(
                                                evento.target.value,
                                            )
                                        }
                                        maxLength={180}
                                    />
                                </label>

                                <button
                                    className="botao"
                                    type="button"
                                    disabled={
                                        processando ||
                                        !nomeConvite.trim() ||
                                        !emailConvite.trim()
                                    }
                                    onClick={gerarConvite}
                                >
                                    {processando
                                        ? 'Gerando...'
                                        : 'Gerar convite'}
                                </button>

                                {conviteGerado && (
                                    <div className="mensagem-sucesso">
                                        <h3>
                                            Convite gerado com sucesso!
                                        </h3>

                                        <p>
                                            <strong>Nome:</strong>{' '}
                                            {conviteGerado.nome}
                                        </p>

                                        <p>
                                            <strong>E-mail:</strong>{' '}
                                            {conviteGerado.email}
                                        </p>

                                        <p>
                                            <strong>Validade:</strong>{' '}
                                            {new Date(
                                                conviteGerado.expiraEm,
                                            ).toLocaleString('pt-BR')}
                                        </p>

                                        <p>
                                            <strong>Link do convite:</strong>
                                        </p>

                                        <input
                                            type="text"
                                            readOnly
                                            value={
                                                `${window.location.origin}/cadastro-administrador?token=${conviteGerado.token}`
                                            }
                                        />

                                        <button
                                            className="botao botao--pequeno"
                                            type="button"
                                            onClick={copiarLinkConvite}
                                        >
                                            Copiar link do convite
                                        </button>
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </section>
        </main>
    )
}