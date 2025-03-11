// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import AppRoutes from './routes'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/*' element={<AppRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
