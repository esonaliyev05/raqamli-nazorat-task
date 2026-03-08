import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import StatementFormPage from './pages/StatementFormPage'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/create" element={<StatementFormPage />} />
          <Route path="/edit/:id" element={<StatementFormPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
