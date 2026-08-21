import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import { RotaAdminProtegida } from './components/RotaAdminProtegida'
import { AdminInicioPage } from './pages/AdminInicioPage'
import { DetalheReceitaPage } from './pages/DetalheReceitaPage'
import { EditarReceitaPage } from './pages/EditarReceitaPage'
import { HomePage } from './pages/HomePage'
import { ListaReceitasPage } from './pages/ListaReceitasPage'
import { LoginAdmPage } from './pages/LoginAdmPage'
import { LoginPage } from './pages/LoginPage'
import { NovaReceitaPage } from './pages/NovaReceitaPage'
import { PrimeiroAcessoAdmPage } from './pages/PrimeiroAcessoAdmPage'
import { SobrePage } from './pages/SobrePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas principais */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login-adm"
          element={<LoginAdmPage />}
        />

        <Route
          path="/primeiro-acesso-adm"
          element={<PrimeiroAcessoAdmPage />}
        />

        {/* Rotas protegidas da área administrativa */}
        <Route element={<RotaAdminProtegida />}>
          <Route
            path="/admin"
            element={<AdminInicioPage />}
          />

          <Route
            path="/admin/receitas/nova"
            element={<NovaReceitaPage />}
          />

          <Route
            path="/admin/receitas/:id/editar"
            element={<EditarReceitaPage />}
          />

          <Route
            path="/admin/receitas/:id"
            element={<DetalheReceitaPage modoAdmin />}
          />
        </Route>

        {/* Rotas públicas para visitantes */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/sobre"
          element={<SobrePage />}
        />

        <Route
          path="/receitas"
          element={<ListaReceitasPage />}
        />

        <Route
          path="/receitas/:id"
          element={<DetalheReceitaPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App