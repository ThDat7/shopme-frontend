// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import Layout from './components/layout/Layout'
import HomePage from './pages/home/HomePage'
import { ToastContainer } from 'react-toastify'
import theme from './theme/themeConfig'
import './App.css'

// import { AuthProvider } from './contexts/AuthContext'

const App: React.FC = () => {
  return (
    // <AuthProvider>
    <ConfigProvider theme={theme}>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            {/* Other routes will be added here */}
          </Route>
        </Routes>
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
      </Router>
    </ConfigProvider>
    /* </AuthProvider> */
  )
}

export default App
