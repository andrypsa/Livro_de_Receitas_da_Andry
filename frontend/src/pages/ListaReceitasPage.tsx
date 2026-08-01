import { useEffect, useState } from 'react'

import { ReceitaCard } from '../components/ReceitaCard'
import { listarReceitasPublicas } from '../services/receitaService'
import type { Receita } from '../types/Receita'

export function ListaReceitasPage() {
    const [receitas, setReceitas] = useState<Receita[]>([])
    const [carregando, setCarregando] = useState(true)
    const [mensagemErro, setMensagemErro] = useState('')

    useEffect(() => {
        listarReceitasPublicas()
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
                    <h2>Receitas públicas</h2>

                    {carregando && <p>Carregando receitas...</p>}

                    {mensagemErro && (
                        <p className="mensagem-erro">{mensagemErro}</p>
                    )}

                    {!carregando &&
                        !mensagemErro &&
                        receitas.length === 0 && (
                            <p>Nenhuma receita pública foi cadastrada.</p>
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