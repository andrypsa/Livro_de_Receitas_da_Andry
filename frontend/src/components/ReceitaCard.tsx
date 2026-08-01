import type { Receita } from '../types/Receita'

interface ReceitaCardProps {
    receita: Receita
}

function formatarEnum(valor: string): string {
    return valor
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letra) => letra.toUpperCase())
}

export function ReceitaCard({ receita }: ReceitaCardProps) {
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
                    <strong>Categoria:</strong> {formatarEnum(receita.categoria)}
                </p>

                {receita.tempoPreparoMinutos !== null && (
                    <p>
                        <strong>Tempo:</strong> {receita.tempoPreparoMinutos} minutos
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

                <button type="button">Ver receita</button>
            </div>
        </article>
    )
}