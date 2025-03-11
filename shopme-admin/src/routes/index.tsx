import React from 'react'
import { Routes, Route } from 'react-router-dom'
import UserRoutes from './UserRoutes'

interface RoutesProps {
  isAuthenticated: boolean
  userFullName?: string
  userRoles?: string[]
  onLogout: () => void
}

const AppRoutes: React.FC<RoutesProps> = () => {
  React.useEffect(() => {}, [])

  return (
    <Routes>
      <Route path='/users/*' element={<UserRoutes />} />
    </Routes>
  )
}

export default AppRoutes
