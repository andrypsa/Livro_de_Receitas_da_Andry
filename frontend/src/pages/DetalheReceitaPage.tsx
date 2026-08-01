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
    const idValido = Number.isInteger(receitaId) && receitaId > 0

    const [receita, setReceita] = useState<ReceitaDetalhe | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [mensagemErro, setMensagemErro] = useState('')

    useEffect(() => {
        if (!idValido) {
            return
        }

        buscarReceitaPorId(receitaId)
            .then(setReceita)
            .catch(() => {
                setMensagemErro('Não foi possível carregar a receita.')
            })
            .finally(() => {
                setCarregando(false)
            })
    }, [idValido, receitaId])

    if (!idValido) {
        return (
            <main className="container pagina-detalhe">
                <p className="mensagem-erro">Receita inválida.</p>

                <Link className="botao" to="/">
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
                    {mensagemErro || 'Receita não encontrada.'}
                </p>

                <Link className="botao" to="/">
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
                <Link className="link-voltar" to="/">
                    ← Voltar para receitas
                </Link>

                {receita.imagemUrl && (
                    <img
                        className="receita-detalhe__imagem"
                        src={receita.imagemUrl}
                        alt={`Imagem da receita ${receita.nome}`}
                    />
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
                            <strong>Rendimento:</strong> {receita.rendimento}
                        </p>
                    )}

                    {receita.dificuldade && (
                        <p>
                            <strong>Dificuldade:</strong>{' '}
                            {formatarEnum(receita.dificuldade)}
                        </p>
                    )}

                    {receita.origem && (
                        <p>
                            <strong>Origem:</strong> {formatarEnum(receita.origem)}
                        </p>
                    )}

                    {receita.status && (
                        <p>
                            <strong>Status:</strong> {formatarEnum(receita.status)}
                        </p>
                    )}
                </section>

                <section className="bloco-receita">
                    <h2>Ingredientes</h2>
                    <p className="texto-preservado">{receita.ingredientes}</p>
                </section>

                <section className="bloco-receita">
                    <h2>Modo de preparo</h2>
                    <p className="texto-preservado">{receita.modoPreparo}</p>
                </section>

                {receita.observacoes && (
                    <section className="bloco-receita">
                        <h2>Observações</h2>
                        <p className="texto-preservado">{receita.observacoes}</p>
                    </section>
                )}
            </main>
        </>
    )
}