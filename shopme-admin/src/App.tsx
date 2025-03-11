// src/App.tsx
import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'
import Layout from './components/layout/Layout'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path='/users/*'
          element={
            <Layout>
              <UserRoutes />
            </Layout>
          }
        />
        <Route path='/users/*' element={<UserRoutes />} />
        <Route path='/' element={<Navigate to='/users' replace />} />
      </Routes>
    </Router>
  )
}

export default App
