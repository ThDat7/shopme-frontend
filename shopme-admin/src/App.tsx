// src/App.tsx
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { ToastContainer } from 'react-toastify'
import './App.css'
import AppRoutes from './routes'
import { AuthProvider } from './contexts/AuthContext'
import { SecurityProvider } from './contexts/SecurityContext'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SecurityProvider>
        <Router>
          <Layout>
            <AppRoutes />
            <ToastContainer
              position='top-right'
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Layout>
        </Router>
      </SecurityProvider>
    </AuthProvider>
  )
}

export default App
