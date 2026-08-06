import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { logoutAdministrador } from '../services/adminAuthService'

export function AdminInicioPage() {
    const navigate = useNavigate()

    const [erro, setErro] = useState('')
    const [saindo, setSaindo] = useState(false)

    async function sair() {
        setErro('')
        setSaindo(true)

        try {
            await logoutAdministrador()
            navigate('/login-adm', { replace: true })
        } catch (erroRecebido) {
            const mensagem =
                erroRecebido instanceof Error
                    ? erroRecebido.message
                    : 'Não foi possível encerrar a sessão.'

            setErro(mensagem)
        } finally {
            setSaindo(false)
        }
    }

    return (
        <main className="pagina-login-adm">
            <section className="login-adm-painel">
                <h1>Área administrativa</h1>

                <p>
                    Login realizado com sucesso. Esta será a página inicial
                    para o gerenciamento das receitas.
                </p>

                {erro && (
                    <p className="mensagem-login mensagem-login--erro">
                        {erro}
                    </p>
                )}

                <button
                    className="login-botao"
                    type="button"
                    onClick={sair}
                    disabled={saindo}
                >
                    {saindo ? 'Saindo...' : 'Sair'}
                </button>
            </section>
        </main>
    )
}