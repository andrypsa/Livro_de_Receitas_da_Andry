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
import { SobrePage } from './pages/SobrePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login-adm" element={<LoginAdmPage />} />

        <Route element={<RotaAdminProtegida />}>
          <Route
            path="/admin"
            element={<AdminInicioPage />}
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route path="/sobre" element={<SobrePage />} />

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