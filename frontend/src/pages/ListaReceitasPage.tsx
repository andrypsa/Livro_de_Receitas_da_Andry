import { useEffect, useState } from 'react'

import { ReceitaCard } from '../components/ReceitaCard'
import { listarReceitas } from '../services/receitaService'
import type { Receita } from '../types/Receita'

export function ListaReceitasPage() {
    const [receitas, setReceitas] = useState<Receita[]>([])
    const [carregando, setCarregando] = useState(true)
    const [mensagemErro, setMensagemErro] = useState('')

    useEffect(() => {
        listarReceitas()
            .then((resultado) => {
                setReceitas(resultado)
            })
            .catch(() => {
                setMensagemErro(
                    'Não foi possível carregar as receitas. Tente novamente.',
                )
            })
            .finally(() => {
                setCarregando(false)
            })
    }, [])

    return (
        <>
            <header className="cabecalho">
                <div className="container">
                    <h1>Livro Digital de Receitas da Andry</h1>
                    <p>Receitas para guardar, preparar e compartilhar.</p>
                </div>
            </header>

            <main className="container">
                <section>
                    <h2>Receitas</h2>

                    {carregando && <p>Carregando receitas...</p>}

                    {mensagemErro && (
                        <p className="mensagem-erro">{mensagemErro}</p>
                    )}

                    {!carregando &&
                        !mensagemErro &&
                        receitas.length === 0 && (
                            <p>Nenhuma receita foi cadastrada.</p>
                        )}

                    <div className="grade-receitas">
                        {receitas.map((receita) => (
                            <ReceitaCard
                                key={receita.id}
                                receita={receita}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </>
    )
}