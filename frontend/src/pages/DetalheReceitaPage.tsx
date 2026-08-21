import { useEffect, useState } from 'react'
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom'

import {
    buscarReceitaAdminPorId,
    buscarReceitaPorId,
    excluirReceita,
} from '../services/receitaService'

import type { ReceitaDetalhe } from '../types/Receita'

interface DetalheReceitaPageProps {
    modoAdmin?: boolean
}

// Formata valores de enum para exibição na interface
function formatarEnum(valor: string): string {
    return valor
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letra) => letra.toUpperCase())
}

// Converte o tempo total em minutos para horas e minutos
function formatarTempoPreparo(
    totalMinutos: number,
): string {
    const horas = Math.floor(totalMinutos / 60)
    const minutos = totalMinutos % 60

    if (horas === 0) {
        return `${minutos} min`
    }

    if (minutos === 0) {
        return `${horas}h`
    }

    return `${horas}h ${minutos}min`
}

// Exibe os detalhes de uma receita na área pública ou administrativa
export function DetalheReceitaPage({
    modoAdmin = false,
}: DetalheReceitaPageProps) {
    const navigate = useNavigate()

    const { id } = useParams()

    const receitaId = Number(id)

    const idValido =
        Number.isInteger(receitaId) && receitaId > 0

    const [receita, setReceita] =
        useState<ReceitaDetalhe | null>(null)

    const [carregando, setCarregando] =
        useState(true)

    const [mensagemErro, setMensagemErro] =
        useState('')

    const [
        indiceImagemAtual,
        setIndiceImagemAtual,
    ] = useState(0)

    const [excluindo, setExcluindo] =
        useState(false)

    const [erroExclusao, setErroExclusao] =
        useState('')

    const rotaVoltar = modoAdmin
        ? '/admin'
        : '/receitas'

    const textoVoltar = modoAdmin
        ? 'Voltar para área administrativa'
        : 'Voltar para receitas'

    // Carrega a receita correta conforme o acesso público ou administrativo
    useEffect(() => {
        if (!idValido) {
            return
        }

        const buscarReceita = modoAdmin
            ? buscarReceitaAdminPorId
            : buscarReceitaPorId

        buscarReceita(receitaId)
            .then((receitaCarregada) => {
                setReceita(receitaCarregada)
                setIndiceImagemAtual(0)
            })
            .catch(() => {
                setMensagemErro(
                    'Não foi possível carregar a receita.',
                )
            })
            .finally(() => {
                setCarregando(false)
            })
    }, [idValido, receitaId, modoAdmin])

    if (!idValido) {
        return (
            <main className="container pagina-detalhe">
                <p className="mensagem-erro">
                    Receita inválida.
                </p>

                <Link
                    className="botao"
                    to={rotaVoltar}
                >
                    {textoVoltar}
                </Link>
            </main>
        )
    }

    if (carregando) {
        return (
            <main className="container pagina-detalhe">
                <p>Carregando receita...</p>
            </main>
        )
    }

    if (mensagemErro || !receita) {
        return (
            <main className="container pagina-detalhe">
                <p className="mensagem-erro">
                    {mensagemErro ||
                        'Receita não encontrada.'}
                </p>

                <Link
                    className="botao"
                    to={rotaVoltar}
                >
                    {textoVoltar}
                </Link>
            </main>
        )
    }

    // Confirma e executa a exclusão de uma receita na área administrativa
    async function confirmarExclusao() {
        if (!receita) {
            return
        }

        const confirmou = window.confirm(
            `Tem certeza que deseja excluir a receita "${receita.nome}"?`,
        )

        if (!confirmou) {
            return
        }

        setErroExclusao('')
        setExcluindo(true)

        try {
            await excluirReceita(receita.id)

            navigate('/admin', {
                replace: true,
            })
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível excluir a receita.'

            setErroExclusao(mensagem)
        } finally {
            setExcluindo(false)
        }
    }

    return (
        <>
            <header className="cabecalho">
                <div className="container">
                    <h1>{receita.nome}</h1>

                    <p>
                        {formatarEnum(
                            receita.categoria,
                        )}
                    </p>
                </div>
            </header>

            <main className="container pagina-detalhe">
                <Link
                    className="link-voltar"
                    to={rotaVoltar}
                >
                    ← {textoVoltar}
                </Link>

                {/* Exibe o carrossel quando a receita possui imagens */}
                {receita.imagens.length > 0 && (
                    <section className="carrossel-receita">
                        <div className="carrossel-receita__principal">
                            {receita.imagens.length > 1 && (
                                <button
                                    type="button"
                                    className="carrossel-receita__botao carrossel-receita__botao--anterior"
                                    onClick={() =>
                                        setIndiceImagemAtual(
                                            (indiceAtual) =>
                                                indiceAtual === 0
                                                    ? receita.imagens.length - 1
                                                    : indiceAtual - 1,
                                        )
                                    }
                                    aria-label="Imagem anterior"
                                >
                                    ‹
                                </button>
                            )}

                            <img
                                className="receita-detalhe__imagem-principal"
                                src={
                                    receita.imagens[
                                    indiceImagemAtual
                                    ]
                                }
                                alt={`Imagem ${indiceImagemAtual + 1
                                    } da receita ${receita.nome
                                    }`}
                            />

                            {receita.imagens.length > 1 && (
                                <button
                                    type="button"
                                    className="carrossel-receita__botao carrossel-receita__botao--proxima"
                                    onClick={() =>
                                        setIndiceImagemAtual(
                                            (indiceAtual) =>
                                                indiceAtual ===
                                                    receita.imagens.length - 1
                                                    ? 0
                                                    : indiceAtual + 1,
                                        )
                                    }
                                    aria-label="Próxima imagem"
                                >
                                    ›
                                </button>
                            )}
                        </div>

                        {receita.imagens.length > 1 && (
                            <div className="carrossel-receita__miniaturas">
                                {receita.imagens.map(
                                    (
                                        imagem,
                                        indice,
                                    ) => (
                                        <button
                                            type="button"
                                            key={imagem}
                                            className={`carrossel-receita__miniatura-botao ${indice ===
                                                    indiceImagemAtual
                                                    ? 'carrossel-receita__miniatura-botao--ativa'
                                                    : ''
                                                }`}
                                            onClick={() =>
                                                setIndiceImagemAtual(
                                                    indice,
                                                )
                                            }
                                        >
                                            <img
                                                className="carrossel-receita__miniatura"
                                                src={imagem}
                                                alt={`Selecionar imagem ${indice + 1
                                                    }`}
                                            />
                                        </button>
                                    ),
                                )}
                            </div>
                        )}

                        <p className="carrossel-receita__contador">
                            {indiceImagemAtual + 1} de{' '}
                            {receita.imagens.length}
                        </p>
                    </section>
                )}

                {/* Exibe as principais informações de preparo da receita */}
                <section className="informacoes-receita">
                    {receita.tempoPreparoMinutos !==
                        null && (
                            <p>
                                <strong>
                                    Tempo de preparo:
                                </strong>{' '}
                                {formatarTempoPreparo(
                                    receita.tempoPreparoMinutos,
                                )}
                            </p>
                        )}

                    {receita.rendimento && (
                        <p>
                            <strong>
                                Rendimento:
                            </strong>{' '}
                            {receita.rendimento}
                        </p>
                    )}

                    {receita.dificuldade && (
                        <p>
                            <strong>
                                Dificuldade:
                            </strong>{' '}
                            {formatarEnum(
                                receita.dificuldade,
                            )}
                        </p>
                    )}

                    {receita.status && (
                        <p>
                            <strong>
                                Status:
                            </strong>{' '}
                            {formatarEnum(
                                receita.status,
                            )}
                        </p>
                    )}
                </section>

                {/* Exibe os ingredientes principais, recheio e cobertura */}
                <section className="bloco-receita">
                    <h2>Ingredientes</h2>

                    <h3>Principal</h3>

                    <p className="texto-preservado">
                        {receita.ingredientes}
                    </p>

                    {receita.ingredientesRecheio && (
                        <>
                            <h3>Recheio</h3>

                            <p className="texto-preservado">
                                {
                                    receita.ingredientesRecheio
                                }
                            </p>
                        </>
                    )}

                    {receita.ingredientesCobertura && (
                        <>
                            <h3>Cobertura</h3>

                            <p className="texto-preservado">
                                {
                                    receita.ingredientesCobertura
                                }
                            </p>
                        </>
                    )}
                </section>

                {/* Exibe os modos de preparo disponíveis */}
                <section className="bloco-receita">
                    <h2>Modo de preparo</h2>

                    <h3>Principal</h3>

                    <p className="texto-preservado">
                        {receita.modoPreparo}
                    </p>

                    {receita.modoPreparoRecheio && (
                        <>
                            <h3>Recheio</h3>

                            <p className="texto-preservado">
                                {
                                    receita.modoPreparoRecheio
                                }
                            </p>
                        </>
                    )}

                    {receita.modoPreparoCobertura && (
                        <>
                            <h3>Cobertura</h3>

                            <p className="texto-preservado">
                                {
                                    receita.modoPreparoCobertura
                                }
                            </p>
                        </>
                    )}
                </section>

                {receita.observacoes && (
                    <section className="bloco-receita">
                        <h2>Observações</h2>

                        <p className="texto-preservado">
                            {receita.observacoes}
                        </p>
                    </section>
                )}

                {/* Exibe origem e informações administrativas secundárias */}
                <section className="informacoes-secundarias-receita">
                    {receita.origem && (
                        <p>
                            <strong>Origem:</strong>{' '}
                            {formatarEnum(receita.origem)}
                        </p>
                    )}

                    {modoAdmin && (
                        <>
                            <p>
                                <strong>Privacidade:</strong>{' '}
                                {receita.privacidade === 'PUBLICA'
                                    ? 'Pública'
                                    : 'Privada'}
                            </p>

                            <p>
                                <strong>Favorita:</strong>{' '}
                                {receita.favorita
                                    ? 'Sim'
                                    : 'Não'}
                            </p>

                            <p>
                                <strong>Comentários:</strong>{' '}
                                {receita.comentariosAtivos
                                    ? 'Ativos'
                                    : 'Desativados'}
                            </p>
                        </>
                    )}
                </section>

                {/* Disponibiliza as ações de edição e exclusão para administradores */}
                {modoAdmin && (
                    <>
                        {erroExclusao && (
                            <p className="mensagem-erro">
                                {erroExclusao}
                            </p>
                        )}

                        <div className="acoes-receita-admin">
                            <Link
                                className="botao botao--pequeno"
                                to={`/admin/receitas/${receita.id}/editar`}
                            >
                                Editar receita
                            </Link>

                            <button
                                className="botao botao--pequeno"
                                type="button"
                                onClick={confirmarExclusao}
                                disabled={excluindo}
                            >
                                {excluindo
                                    ? 'Excluindo...'
                                    : 'Excluir receita'}
                            </button>
                        </div>
                    </>
                )}
            </main>
        </>
    )
}