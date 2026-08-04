import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { consultarSessaoAdministrador } from '../services/adminAuthService'

export function RotaAdminProtegida() {
    const [verificando, setVerificando] = useState(true)
    const [autenticado, setAutenticado] = useState(false)

    useEffect(() => {
        async function verificarSessao() {
            try {
                const sessao = await consultarSessaoAdministrador()
                setAutenticado(sessao.autenticado)
            } catch {
                setAutenticado(false)
            } finally {
                setVerificando(false)
            }
        }

        verificarSessao()
    }, [])

    if (verificando) {
        return (
            <main className="pagina-login-adm">
                <section className="login-adm-painel">
                    <p>Verificando acesso administrativo...</p>
                </section>
            </main>
        )
    }

    if (!autenticado) {
        return <Navigate to="/login-adm" replace />
    }

    return <Outlet />
}