import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import { RotaAdminProtegida } from './components/RotaAdminProtegida'
import { AdminInicioPage } from './pages/AdminInicioPage'
import { DetalheReceitaPage } from './pages/DetalheReceitaPage'
import { HomePage } from './pages/HomePage'
import { ListaReceitasPage } from './pages/ListaReceitasPage'
import { LoginAdmPage } from './pages/LoginAdmPage'
import { LoginPage } from './pages/LoginPage'
import { NovaReceitaPage } from './pages/NovaReceitaPage'
import { PrimeiroAcessoAdmPage } from './pages/PrimeiroAcessoAdmPage'
import { SobrePage } from './pages/SobrePage'
import { EditarReceitaPage } from './pages/EditarReceitaPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login-adm"
          element={<LoginAdmPage />}
        />

        <Route
          path="/primeiro-acesso-adm"
          element={<PrimeiroAcessoAdmPage />}
        />

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