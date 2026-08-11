import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { buscarReceitaPorId } from '../services/receitaService'
import type { ReceitaDetalhe } from '../types/Receita'

function formatarEnum(valor: string): string {
    return valor
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letra) => letra.toUpperCase())
}

export function DetalheReceitaPage() {
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
    const [indiceImagemAtual, setIndiceImagemAtual] =
        useState(0)
    useEffect(() => {
        if (!idValido) {
            return
        }

        buscarReceitaPorId(receitaId)
            .then(setReceita)
            .catch(() => {
                setMensagemErro(
                    'Não foi possível carregar a receita.',
                )
            })
            .finally(() => {
                setCarregando(false)
            })
    }, [idValido, receitaId])

    if (!idValido) {
        return (
            <main className="container pagina-detalhe">
                <p className="mensagem-erro">
                    Receita inválida.
                </p>

                <Link className="botao" to="/receitas">
                    Voltar para receitas
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

                <Link className="botao" to="/receitas">
                    Voltar para receitas
                </Link>
            </main>
        )
    }

    return (
        <>
            <header className="cabecalho">
                <div className="container">
                    <h1>{receita.nome}</h1>
                    <p>{formatarEnum(receita.categoria)}</p>
                </div>
            </header>

            <main className="container pagina-detalhe">
                <Link
                    className="link-voltar"
                    to="/receitas"
                >
                    ← Voltar para receitas
                </Link>

                {receita.imagens.length > 0 && (
                    <section className="carrossel-receita">
                        <div className="carrossel-receita__principal">
                            {receita.imagens.length > 1 && (
                                <button
                                    type="button"
                                    className="carrossel-receita__botao carrossel-receita__botao--anterior"
                                    onClick={() =>
                                        setIndiceImagemAtual((indiceAtual) =>
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
                                src={receita.imagens[indiceImagemAtual]}
                                alt={`Imagem ${indiceImagemAtual + 1} da receita ${receita.nome}`}
                            />

                            {receita.imagens.length > 1 && (
                                <button
                                    type="button"
                                    className="carrossel-receita__botao carrossel-receita__botao--proxima"
                                    onClick={() =>
                                        setIndiceImagemAtual((indiceAtual) =>
                                            indiceAtual === receita.imagens.length - 1
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
                                {receita.imagens.map((imagem, indice) => (
                                    <button
                                        type="button"
                                        key={imagem}
                                        className={`carrossel-receita__miniatura-botao ${indice === indiceImagemAtual
                                                ? 'carrossel-receita__miniatura-botao--ativa'
                                                : ''
                                            }`}
                                        onClick={() =>
                                            setIndiceImagemAtual(indice)
                                        }
                                    >
                                        <img
                                            className="carrossel-receita__miniatura"
                                            src={imagem}
                                            alt={`Selecionar imagem ${indice + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <p className="carrossel-receita__contador">
                            {indiceImagemAtual + 1} de {receita.imagens.length}
                        </p>
                    </section>
                )}

                <section className="informacoes-receita">
                    {receita.tempoPreparoMinutos !== null && (
                        <p>
                            <strong>Tempo de preparo:</strong>{' '}
                            {receita.tempoPreparoMinutos} minutos
                        </p>
                    )}

                    {receita.rendimento && (
                        <p>
                            <strong>Rendimento:</strong>{' '}
                            {receita.rendimento}
                        </p>
                    )}

                    {receita.dificuldade && (
                        <p>
                            <strong>Dificuldade:</strong>{' '}
                            {formatarEnum(
                                receita.dificuldade,
                            )}
                        </p>
                    )}

                    {receita.origem && (
                        <p>
                            <strong>Origem:</strong>{' '}
                            {formatarEnum(receita.origem)}
                        </p>
                    )}

                    {receita.status && (
                        <p>
                            <strong>Status:</strong>{' '}
                            {formatarEnum(receita.status)}
                        </p>
                    )}
                </section>

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
                                {receita.ingredientesRecheio}
                            </p>
                        </>
                    )}

                    {receita.ingredientesCobertura && (
                        <>
                            <h3>Cobertura</h3>

                            <p className="texto-preservado">
                                {receita.ingredientesCobertura}
                            </p>
                        </>
                    )}
                </section>

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
                                {receita.modoPreparoRecheio}
                            </p>
                        </>
                    )}

                    {receita.modoPreparoCobertura && (
                        <>
                            <h3>Cobertura</h3>

                            <p className="texto-preservado">
                                {receita.modoPreparoCobertura}
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
            </main>
        </>
    )
}