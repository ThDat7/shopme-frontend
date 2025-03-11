// src/routes/UserRoutes.tsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserList from '../components/user/UserList'
import CreateUser from '../components/user/CreateUser'
import EditUser from '../components/user/EditUser'
import { ProtectedRoute } from './ProtectedRoute'

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute isAuthenticated={true}>
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path='/create'
        element={
          <ProtectedRoute isAuthenticated={true}>
            <CreateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path='/edit/:id'
        element={
          <ProtectedRoute isAuthenticated={true}>
            <EditUser />
          </ProtectedRoute>
        }
      />
      {/* Add more user-related routes here as needed */}
    </Routes>
  )
}

export default UserRoutes
