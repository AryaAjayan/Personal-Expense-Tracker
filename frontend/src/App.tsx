import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/ui/ThemeProvider'
import { Dashboard } from './pages/Dashboard'
import { MonthlySummaryPage } from './pages/MonthlySummaryPage'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="expense-tracker-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/summary/:month" element={<MonthlySummaryPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
