import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { buscarReceitaAdminPorId } from '../services/receitaService'
import type { ReceitaDetalhe } from '../types/Receita'

export function EditarReceitaPage() {
    const { id } = useParams()

    const receitaId = Number(id)

    const idValido =
        Number.isInteger(receitaId) && receitaId > 0

    const [receita, setReceita] =
        useState<ReceitaDetalhe | null>(null)

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] =
        useState('')

    useEffect(() => {
        if (!idValido) {
            return
        }

        buscarReceitaAdminPorId(receitaId)
            .then((receitaCarregada) => {
                setReceita(receitaCarregada)
            })
            .catch(() => {
                setErro(
                    'Não foi possível carregar a receita para edição.',
                )
            })
            .finally(() => {
                setCarregando(false)
            })
    }, [idValido, receitaId])

    if (!idValido) {
        return (
            <main className="pagina-receitas">
                <section className="receitas-painel">
                    <p className="mensagem-erro">
                        Receita inválida.
                    </p>

                    <Link
                        className="link-voltar"
                        to="/admin"
                    >
                        ← Voltar para área administrativa
                    </Link>
                </section>
            </main>
        )
    }

    if (carregando) {
        return (
            <main className="pagina-receitas">
                <section className="receitas-painel">
                    <p>Carregando receita...</p>
                </section>
            </main>
        )
    }

    if (erro || !receita) {
        return (
            <main className="pagina-receitas">
                <section className="receitas-painel">
                    <p className="mensagem-erro">
                        {erro || 'Receita não encontrada.'}
                    </p>

                    <Link
                        className="link-voltar"
                        to="/admin"
                    >
                        ← Voltar para área administrativa
                    </Link>
                </section>
            </main>
        )
    }

    return (
        <main className="pagina-receitas">
            <section className="receitas-painel">
                <Link
                    className="link-voltar"
                    to={`/admin/receitas/${receita.id}`}
                >
                    ← Voltar para receita
                </Link>

                <header className="receitas-cabecalho">
                    <h1>Editar receita</h1>

                    <p>
                        Editando: {receita.nome}
                    </p>
                </header>
            </section>
        </main>
    )
}