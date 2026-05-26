import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { MonthlySummaryPage } from './pages/MonthlySummaryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/summary/:month" element={<MonthlySummaryPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
