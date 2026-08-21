import { Link } from 'react-router-dom'

import type { Receita } from '../types/Receita'

interface ReceitaCardProps {
    receita: Receita
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
function formatarTempoPreparo(totalMinutos: number): string {
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

// Exibe o resumo da receita nas listagens pública e administrativa
export function ReceitaCard({
    receita,
    modoAdmin = false,
}: ReceitaCardProps) {
    return (
        <article className="receita-card">
            {receita.imagemUrl && (
                <img
                    className="receita-card__imagem"
                    src={receita.imagemUrl}
                    alt={`Imagem da receita ${receita.nome}`}
                />
            )}

            <div className="receita-card__conteudo">
                <h2>{receita.nome}</h2>

                <p>
                    <strong>Categoria:</strong>{' '}
                    {formatarEnum(receita.categoria)}
                </p>

                {receita.tempoPreparoMinutos !== null && (
                    <p>
                        <strong>Tempo:</strong>{' '}
                        {formatarTempoPreparo(
                            receita.tempoPreparoMinutos,
                        )}
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
                        {formatarEnum(receita.dificuldade)}
                    </p>
                )}

                <Link
                    className="botao"
                    to={
                        modoAdmin
                            ? `/admin/receitas/${receita.id}`
                            : `/receitas/${receita.id}`
                    }
                >
                    Ver receita
                </Link>
            </div>
        </article>
    )
}