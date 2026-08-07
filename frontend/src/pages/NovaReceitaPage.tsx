import { useEffect, useState } from 'react'
import type {
    ChangeEvent,
    FormEvent,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
    criarReceita,
    enviarImagemReceita,
} from '../services/receitaService'

import type {
    Categoria,
    Dificuldade,
    OrigemReceita,
    PrivacidadeReceita,
    StatusReceita,
} from '../types/Receita'

export function NovaReceitaPage() {
    const navigate = useNavigate()

    const [nome, setNome] = useState('')
    const [categoria, setCategoria] =
        useState<Categoria>('SALGADO')

    const [ingredientes, setIngredientes] = useState('')
    const [modoPreparo, setModoPreparo] = useState('')

    const [arquivosImagem, setArquivosImagem] =
        useState<File[]>([])

    const [previewsImagem, setPreviewsImagem] =
        useState<string[]>([])

    const [observacoes, setObservacoes] = useState('')
    const [tempoPreparoMinutos, setTempoPreparoMinutos] =
        useState('')
    const [rendimento, setRendimento] = useState('')

    const [dificuldade, setDificuldade] =
        useState<Dificuldade | ''>('')

    const [origem, setOrigem] =
        useState<OrigemReceita | ''>('')

    const [status, setStatus] =
        useState<StatusReceita>('NAO_TESTADA')

    const [privacidade, setPrivacidade] =
        useState<PrivacidadeReceita>('PRIVADA')

    const [favorita, setFavorita] = useState(false)

    const [comentariosAtivos, setComentariosAtivos] =
        useState(true)

    const [erro, setErro] = useState('')
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        return () => {
            previewsImagem.forEach((preview) => {
                URL.revokeObjectURL(preview)
            })
        }
    }, [previewsImagem])

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
            setErro(
                'Selecione apenas imagens JPG, PNG ou WebP.',
            )
            evento.target.value = ''
            return
        }

        const arquivoMaiorQuePermitido = arquivos.find(
            (arquivo) =>
                arquivo.size > 5 * 1024 * 1024,
        )

        if (arquivoMaiorQuePermitido) {
            setErro(
                'Cada imagem deve ter no máximo 5 MB.',
            )
            evento.target.value = ''
            return
        }

        setErro('')

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

    function removerImagem(indice: number) {
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

    async function enviarFormulario(
        evento: FormEvent<HTMLFormElement>,
    ) {
        evento.preventDefault()

        setErro('')
        setSalvando(true)

        try {
            const imagensUrls: string[] = []

            for (const arquivo of arquivosImagem) {
                const imagemUrl =
                    await enviarImagemReceita(arquivo)

                imagensUrls.push(imagemUrl)
            }

            await criarReceita({
                nome,
                categoria,
                ingredientes,
                modoPreparo,
                imagensUrls,
                observacoes:
                    observacoes.trim() || null,
                tempoPreparoMinutos:
                    tempoPreparoMinutos === ''
                        ? null
                        : Number(tempoPreparoMinutos),
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

            navigate('/admin', {
                replace: true,
            })
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível cadastrar a receita.'

            setErro(mensagem)
        } finally {
            setSalvando(false)
        }
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
                    <h1>Nova receita</h1>

                    <p>
                        Preencha os dados abaixo para
                        cadastrar uma nova receita.
                    </p>
                </header>

                <form
                    className="login-adm-formulario"
                    onSubmit={enviarFormulario}
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
                                    evento.target
                                        .value as Categoria,
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
                        <span>Ingredientes</span>

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
                        <span>Modo de preparo</span>

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

                    <label className="login-adm-campo">
                        <span>Fotos da receita</span>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={selecionarImagens}
                        />
                    </label>

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
                                            alt={`Prévia da foto ${indice + 1
                                                }`}
                                        />

                                        <button
                                            className="botao-remover-imagem"
                                            type="button"
                                            onClick={() =>
                                                removerImagem(indice)
                                            }
                                            aria-label={`Remover foto ${indice + 1
                                                }`}
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

                    <label className="login-adm-campo">
                        <span>
                            Tempo de preparo em minutos
                        </span>

                        <input
                            type="number"
                            min="0"
                            value={tempoPreparoMinutos}
                            onChange={(evento) =>
                                setTempoPreparoMinutos(
                                    evento.target.value,
                                )
                            }
                        />
                    </label>

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

                            <option value="AUTORAL">
                                Autoral
                            </option>

                            <option value="YOUTUBE">
                                YouTube
                            </option>

                            <option value="TIKTOK">
                                TikTok
                            </option>

                            <option value="INSTAGRAM">
                                Instagram
                            </option>

                            <option value="FACEBOOK">
                                Facebook
                            </option>

                            <option value="SITE">
                                Site
                            </option>

                            <option value="LIVRO_DE_RECEITAS">
                                Livro de receitas
                            </option>

                            <option value="OUTROS">
                                Outros
                            </option>
                        </select>
                    </label>

                    <label className="login-adm-campo">
                        <span>Status</span>

                        <select
                            value={status}
                            onChange={(evento) =>
                                setStatus(
                                    evento.target
                                        .value as StatusReceita,
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
                                    evento.target
                                        .value as PrivacidadeReceita,
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

                    {erro && (
                        <p className="mensagem-login mensagem-login--erro">
                            {erro}
                        </p>
                    )}

                    <button
                        className="login-botao"
                        type="submit"
                        disabled={salvando}
                    >
                        {salvando
                            ? 'Salvando...'
                            : 'Salvar receita'}
                    </button>
                </form>
            </section>
        </main>
    )
}