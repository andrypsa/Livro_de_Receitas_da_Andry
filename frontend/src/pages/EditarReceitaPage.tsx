import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
    atualizarReceita,
    buscarReceitaAdminPorId,
    enviarImagemReceita,
} from '../services/receitaService'

import type {
    Categoria,
    Dificuldade,
    OrigemReceita,
    PrivacidadeReceita,
    ReceitaDetalhe,
    StatusReceita,
} from '../types/Receita'

interface FormularioEdicaoProps {
    receita: ReceitaDetalhe
}

// Controla o formulário responsável pela edição dos dados de uma receita
function FormularioEdicao({
    receita,
}: FormularioEdicaoProps) {
    const navigate = useNavigate()

    // Estados dos dados principais da receita
    const [nome, setNome] =
        useState(receita.nome)

    const [categoria, setCategoria] =
        useState<Categoria>(receita.categoria)

    const [ingredientes, setIngredientes] =
        useState(receita.ingredientes)

    const [modoPreparo, setModoPreparo] =
        useState(receita.modoPreparo)

    // Estados da seção opcional de recheio
    const [temRecheio, setTemRecheio] =
        useState(
            Boolean(
                receita.ingredientesRecheio ||
                receita.modoPreparoRecheio,
            ),
        )

    const [
        ingredientesRecheio,
        setIngredientesRecheio,
    ] = useState(
        receita.ingredientesRecheio ?? '',
    )

    const [
        modoPreparoRecheio,
        setModoPreparoRecheio,
    ] = useState(
        receita.modoPreparoRecheio ?? '',
    )

    // Estados da seção opcional de cobertura
    const [temCobertura, setTemCobertura] =
        useState(
            Boolean(
                receita.ingredientesCobertura ||
                receita.modoPreparoCobertura,
            ),
        )

    const [
        ingredientesCobertura,
        setIngredientesCobertura,
    ] = useState(
        receita.ingredientesCobertura ?? '',
    )

    const [
        modoPreparoCobertura,
        setModoPreparoCobertura,
    ] = useState(
        receita.modoPreparoCobertura ?? '',
    )

    // Controla imagens existentes, novos arquivos e previews
    const [imagensExistentes, setImagensExistentes] =
        useState<string[]>(receita.imagens)

    const [arquivosImagem, setArquivosImagem] =
        useState<File[]>([])

    const [previewsImagem, setPreviewsImagem] =
        useState<string[]>([])

    const previewsImagemRef = useRef<string[]>([])

    // Mantém a referência das prévias atualizada para limpeza ao sair da página
    useEffect(() => {
        previewsImagemRef.current = previewsImagem
    }, [previewsImagem])

    // Libera as URLs temporárias das novas imagens ao desmontar o formulário
    useEffect(() => {
        return () => {
            previewsImagemRef.current.forEach((preview) => {
                URL.revokeObjectURL(preview)
            })
        }
    }, [])

    // Converte o tempo armazenado em minutos para horas e minutos no formulário
    const [tempoPreparoHoras, setTempoPreparoHoras] =
        useState(
            receita.tempoPreparoMinutos !== null
                ? Math.floor(
                    receita.tempoPreparoMinutos / 60,
                ).toString()
                : '',
        )

    const [
        tempoPreparoMinutos,
        setTempoPreparoMinutos,
    ] = useState(
        receita.tempoPreparoMinutos !== null
            ? (
                receita.tempoPreparoMinutos % 60
            ).toString()
            : '',
    )

    const [rendimento, setRendimento] =
        useState(receita.rendimento ?? '')

    const [dificuldade, setDificuldade] =
        useState<Dificuldade | ''>(
            receita.dificuldade ?? '',
        )

    const [origem, setOrigem] =
        useState<OrigemReceita | ''>(
            receita.origem ?? '',
        )

    const [status, setStatus] =
        useState<StatusReceita>(
            receita.status ?? 'NAO_TESTADA',
        )

    const [privacidade, setPrivacidade] =
        useState<PrivacidadeReceita>(
            receita.privacidade,
        )

    const [observacoes, setObservacoes] =
        useState(receita.observacoes ?? '')

    const [favorita, setFavorita] =
        useState(receita.favorita)

    const [
        comentariosAtivos,
        setComentariosAtivos,
    ] = useState(receita.comentariosAtivos)

    const [erroSalvar, setErroSalvar] =
        useState('')

    const [salvando, setSalvando] =
        useState(false)

    // Valida novas imagens selecionadas e cria suas prévias
    function selecionarImagens(
        evento: ChangeEvent<HTMLInputElement>,
    ) {
        const arquivos = Array.from(
            evento.target.files ?? [],
        )

        if (arquivos.length === 0) {
            return
        }

        const tipoInvalido = arquivos.find(
            (arquivo) =>
                ![
                    'image/jpeg',
                    'image/png',
                    'image/webp',
                ].includes(arquivo.type),
        )

        if (tipoInvalido) {
            setErroSalvar(
                'Selecione apenas imagens JPG, PNG ou WebP.',
            )

            evento.target.value = ''
            return
        }

        const arquivoMaiorQuePermitido =
            arquivos.find(
                (arquivo) =>
                    arquivo.size > 5 * 1024 * 1024,
            )

        if (arquivoMaiorQuePermitido) {
            setErroSalvar(
                'Cada imagem deve ter no máximo 5 MB.',
            )

            evento.target.value = ''
            return
        }

        setErroSalvar('')

        setArquivosImagem((arquivosAtuais) => [
            ...arquivosAtuais,
            ...arquivos,
        ])

        setPreviewsImagem((previewsAtuais) => [
            ...previewsAtuais,
            ...arquivos.map((arquivo) =>
                URL.createObjectURL(arquivo),
            ),
        ])

        evento.target.value = ''
    }

    // Remove uma nova imagem antes de salvar as alterações
    function removerNovaImagem(indice: number) {
        const previewRemovido =
            previewsImagem[indice]

        if (previewRemovido) {
            URL.revokeObjectURL(previewRemovido)
        }

        setArquivosImagem((arquivosAtuais) =>
            arquivosAtuais.filter(
                (_, indiceAtual) =>
                    indiceAtual !== indice,
            ),
        )

        setPreviewsImagem((previewsAtuais) =>
            previewsAtuais.filter(
                (_, indiceAtual) =>
                    indiceAtual !== indice,
            ),
        )
    }

    // Envia novas imagens, reúne os dados do formulário e atualiza a receita
    async function salvarAlteracoes(
        evento: React.FormEvent<HTMLFormElement>,
    ) {
        evento.preventDefault()

        setErroSalvar('')
        setSalvando(true)

        try {
            const novasImagensUrls: string[] = []

            for (const arquivo of arquivosImagem) {
                const imagemUrl =
                    await enviarImagemReceita(arquivo)

                novasImagensUrls.push(imagemUrl)
            }

            const imagensUrls = [
                ...imagensExistentes,
                ...novasImagensUrls,
            ]

            await atualizarReceita(receita.id, {
                nome,
                categoria,
                ingredientes,
                modoPreparo,

                ingredientesRecheio:
                    temRecheio &&
                        ingredientesRecheio.trim()
                        ? ingredientesRecheio.trim()
                        : null,

                modoPreparoRecheio:
                    temRecheio &&
                        modoPreparoRecheio.trim()
                        ? modoPreparoRecheio.trim()
                        : null,

                ingredientesCobertura:
                    temCobertura &&
                        ingredientesCobertura.trim()
                        ? ingredientesCobertura.trim()
                        : null,

                modoPreparoCobertura:
                    temCobertura &&
                        modoPreparoCobertura.trim()
                        ? modoPreparoCobertura.trim()
                        : null,

                imagensUrls,

                observacoes:
                    observacoes.trim() || null,

                tempoPreparoMinutos:
                    tempoPreparoHoras === '' &&
                        tempoPreparoMinutos === ''
                        ? null
                        : Number(tempoPreparoHoras || 0) * 60 +
                        Number(tempoPreparoMinutos || 0),

                rendimento:
                    rendimento.trim() || null,

                dificuldade:
                    dificuldade || null,

                origem:
                    origem || null,

                status,
                privacidade,
                favorita,
                comentariosAtivos,
            })

            navigate(
                `/admin/receitas/${receita.id}`,
                {
                    replace: true,
                },
            )
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível atualizar a receita.'

            setErroSalvar(mensagem)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <form
            className="login-adm-formulario"
            onSubmit={salvarAlteracoes}
        >
            <label className="login-adm-campo">
                <span>Nome da receita</span>

                <input
                    type="text"
                    value={nome}
                    onChange={(evento) =>
                        setNome(evento.target.value)
                    }
                    maxLength={150}
                    required
                />
            </label>

            <label className="login-adm-campo">
                <span>Categoria</span>

                <select
                    value={categoria}
                    onChange={(evento) =>
                        setCategoria(
                            evento.target.value as Categoria,
                        )
                    }
                >
                    <option value="SALGADO">
                        Salgada
                    </option>

                    <option value="DOCE">
                        Doce
                    </option>

                    <option value="MISTO">
                        Mista
                    </option>
                </select>
            </label>

            <label className="login-adm-campo">
                <span>
                    Ingredientes principais
                </span>

                <textarea
                    value={ingredientes}
                    onChange={(evento) =>
                        setIngredientes(
                            evento.target.value,
                        )
                    }
                    rows={8}
                    required
                />
            </label>

            <label className="login-adm-campo">
                <span>
                    Modo de preparo principal
                </span>

                <textarea
                    value={modoPreparo}
                    onChange={(evento) =>
                        setModoPreparo(
                            evento.target.value,
                        )
                    }
                    rows={8}
                    required
                />
            </label>

            {/* Campos opcionais de recheio */}
            <fieldset className="secao-opcional-receita">
                <legend>Recheio</legend>

                <label>
                    <input
                        type="checkbox"
                        checked={temRecheio}
                        onChange={(evento) =>
                            setTemRecheio(
                                evento.target.checked,
                            )
                        }
                    />

                    {' '}
                    Esta receita tem recheio
                </label>

                {temRecheio && (
                    <>
                        <label className="login-adm-campo">
                            <span>
                                Ingredientes do recheio
                            </span>

                            <textarea
                                value={ingredientesRecheio}
                                onChange={(evento) =>
                                    setIngredientesRecheio(
                                        evento.target.value,
                                    )
                                }
                                rows={6}
                                required
                            />
                        </label>

                        <label className="login-adm-campo">
                            <span>
                                Modo de preparo do recheio
                            </span>

                            <textarea
                                value={modoPreparoRecheio}
                                onChange={(evento) =>
                                    setModoPreparoRecheio(
                                        evento.target.value,
                                    )
                                }
                                rows={6}
                                required
                            />
                        </label>
                    </>
                )}
            </fieldset>

            {/* Campos opcionais de cobertura */}
            <fieldset className="secao-opcional-receita">
                <legend>Cobertura</legend>

                <label>
                    <input
                        type="checkbox"
                        checked={temCobertura}
                        onChange={(evento) =>
                            setTemCobertura(
                                evento.target.checked,
                            )
                        }
                    />

                    {' '}
                    Esta receita tem cobertura
                </label>

                {temCobertura && (
                    <>
                        <label className="login-adm-campo">
                            <span>
                                Ingredientes da cobertura
                            </span>

                            <textarea
                                value={ingredientesCobertura}
                                onChange={(evento) =>
                                    setIngredientesCobertura(
                                        evento.target.value,
                                    )
                                }
                                rows={6}
                                required
                            />
                        </label>

                        <label className="login-adm-campo">
                            <span>
                                Modo de preparo da cobertura
                            </span>

                            <textarea
                                value={modoPreparoCobertura}
                                onChange={(evento) =>
                                    setModoPreparoCobertura(
                                        evento.target.value,
                                    )
                                }
                                rows={6}
                                required
                            />
                        </label>
                    </>
                )}
            </fieldset>

            {/* Gerenciamento das imagens atuais e novas imagens */}
            <label className="login-adm-campo">
                <span>Fotos da receita</span>

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={selecionarImagens}
                />
            </label>

            {imagensExistentes.length > 0 && (
                <div className="galeria-preview-receita">
                    {imagensExistentes.map(
                        (imagem, indice) => (
                            <div
                                className="item-preview-receita"
                                key={imagem}
                            >
                                <img
                                    src={imagem}
                                    alt={`Foto atual ${indice + 1}`}
                                />

                                <button
                                    className="botao-remover-imagem"
                                    type="button"
                                    onClick={() =>
                                        setImagensExistentes(
                                            (imagensAtuais) =>
                                                imagensAtuais.filter(
                                                    (_, indiceAtual) =>
                                                        indiceAtual !==
                                                        indice,
                                                ),
                                        )
                                    }
                                    aria-label={`Remover foto atual ${indice + 1}`}
                                    title="Remover foto"
                                >
                                    ×
                                </button>

                                {indice === 0 && (
                                    <span className="imagem-principal-aviso">
                                        Foto principal
                                    </span>
                                )}
                            </div>
                        ),
                    )}
                </div>
            )}

            {previewsImagem.length > 0 && (
                <div className="galeria-preview-receita">
                    {previewsImagem.map(
                        (preview, indice) => (
                            <div
                                className="item-preview-receita"
                                key={preview}
                            >
                                <img
                                    src={preview}
                                    alt={`Nova foto ${indice + 1}`}
                                />

                                <button
                                    className="botao-remover-imagem"
                                    type="button"
                                    onClick={() =>
                                        removerNovaImagem(indice)
                                    }
                                    aria-label={`Remover nova foto ${indice + 1}`}
                                    title="Remover foto"
                                >
                                    ×
                                </button>

                                <span>
                                    Nova foto
                                </span>
                            </div>
                        ),
                    )}
                </div>
            )}

            {/* Tempo de preparo separado em horas e minutos */}
            <fieldset className="secao-opcional-receita">
                <legend>Tempo de preparo</legend>

                <label className="login-adm-campo">
                    <span>Horas</span>

                    <input
                        type="number"
                        min="0"
                        value={tempoPreparoHoras}
                        onChange={(evento) =>
                            setTempoPreparoHoras(
                                evento.target.value,
                            )
                        }
                    />
                </label>

                <label className="login-adm-campo">
                    <span>Minutos</span>

                    <input
                        type="number"
                        min="0"
                        max="59"
                        value={tempoPreparoMinutos}
                        onChange={(evento) =>
                            setTempoPreparoMinutos(
                                evento.target.value,
                            )
                        }
                    />
                </label>
            </fieldset>

            <label className="login-adm-campo">
                <span>Rendimento</span>

                <input
                    type="text"
                    value={rendimento}
                    onChange={(evento) =>
                        setRendimento(
                            evento.target.value,
                        )
                    }
                    maxLength={100}
                />
            </label>

            <label className="login-adm-campo">
                <span>Dificuldade</span>

                <select
                    value={dificuldade}
                    onChange={(evento) =>
                        setDificuldade(
                            evento.target.value as
                            | Dificuldade
                            | '',
                        )
                    }
                >
                    <option value="">
                        Não informada
                    </option>

                    <option value="FACIL">
                        Fácil
                    </option>

                    <option value="MEDIA">
                        Média
                    </option>

                    <option value="DIFICIL">
                        Difícil
                    </option>
                </select>
            </label>

            <label className="login-adm-campo">
                <span>Origem</span>

                <select
                    value={origem}
                    onChange={(evento) =>
                        setOrigem(
                            evento.target.value as
                            | OrigemReceita
                            | '',
                        )
                    }
                >
                    <option value="">
                        Não informada
                    </option>

                    <option value="AUTORAL">Autoral</option>
                    <option value="YOUTUBE">YouTube</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="SITE">Site</option>
                    <option value="LIVRO_DE_RECEITAS">
                        Livro de receitas
                    </option>
                    <option value="OUTROS">Outros</option>
                </select>
            </label>

            <label className="login-adm-campo">
                <span>Status</span>

                <select
                    value={status}
                    onChange={(evento) =>
                        setStatus(
                            evento.target.value as StatusReceita,
                        )
                    }
                >
                    <option value="NAO_TESTADA">
                        Não testada
                    </option>

                    <option value="TESTADA_E_APROVADA">
                        Testada e aprovada
                    </option>

                    <option value="TESTADA_E_REPROVADA">
                        Testada e reprovada
                    </option>

                    <option value="PRECISA_DE_AJUSTES">
                        Precisa de ajustes
                    </option>
                </select>
            </label>

            <label className="login-adm-campo">
                <span>Privacidade</span>

                <select
                    value={privacidade}
                    onChange={(evento) =>
                        setPrivacidade(
                            evento.target.value as PrivacidadeReceita,
                        )
                    }
                >
                    <option value="PRIVADA">
                        Privada
                    </option>

                    <option value="PUBLICA">
                        Pública
                    </option>
                </select>
            </label>

            <label className="login-adm-campo">
                <span>Observações</span>

                <textarea
                    value={observacoes}
                    onChange={(evento) =>
                        setObservacoes(
                            evento.target.value,
                        )
                    }
                    rows={5}
                />
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={favorita}
                    onChange={(evento) =>
                        setFavorita(
                            evento.target.checked,
                        )
                    }
                />

                {' '}
                Marcar como favorita
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={comentariosAtivos}
                    onChange={(evento) =>
                        setComentariosAtivos(
                            evento.target.checked,
                        )
                    }
                />

                {' '}
                Permitir comentários
            </label>

            {erroSalvar && (
                <p className="mensagem-login mensagem-login--erro">
                    {erroSalvar}
                </p>
            )}

            <button
                className="login-botao"
                type="submit"
                disabled={salvando}
            >
                {salvando
                    ? 'Salvando...'
                    : 'Salvar alterações'}
            </button>
        </form>
    )
}

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

    // Carrega os dados atuais da receita antes de exibir o formulário
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

    // Trata os estados de ID inválido, carregamento e erro
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
                    <p>
                        Carregando receita...
                    </p>
                </section>
            </main>
        )
    }

    if (erro || !receita) {
        return (
            <main className="pagina-receitas">
                <section className="receitas-painel">
                    <p className="mensagem-erro">
                        {erro ||
                            'Receita não encontrada.'}
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

                <FormularioEdicao
                    receita={receita}
                />
            </section>
        </main>
    )
}