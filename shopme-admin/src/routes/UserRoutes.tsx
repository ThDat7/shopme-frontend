// src/routes/UserRoutes.tsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserList from '../pages/users/UserList'
import CreateUser from '../pages/users/CreateUser'
import EditUser from '../pages/users/EditUser'
import { ProtectedRoute } from './ProtectedRoute'

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path='/create'
        element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path='/edit/:id'
        element={
          <ProtectedRoute>
            <EditUser />
          </ProtectedRoute>
        }
      />
      {/* Add more user-related routes here as needed */}
    </Routes>
  )
}

export default UserRoutes
