import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

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