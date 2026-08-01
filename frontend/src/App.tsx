import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import { DetalheReceitaPage } from './pages/DetalheReceitaPage'
import { ListaReceitasPage } from './pages/ListaReceitasPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListaReceitasPage />} />
        <Route
          path="/receitas/:id"
          element={<DetalheReceitaPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App