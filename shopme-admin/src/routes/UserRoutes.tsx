// src/routes/UserRoutes.tsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import UserList from '../pages/users/UserList'
import CreateUser from '../pages/users/CreateUser'
import EditUser from '../pages/users/EditUser'
import Authorization from '../components/security/Authorization'

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      {/* List users - cần quyền read */}
      <Route
        path='/'
        element={
          <Authorization permissions={{ resource: 'users', action: 'read' }}>
            <UserList />
          </Authorization>
        }
      />

      {/* Create user - cần quyền create */}
      <Route
        path='/create'
        element={
          <Authorization permissions={{ resource: 'users', action: 'create' }}>
            <CreateUser />
          </Authorization>
        }
      />

      {/* Edit user - cần quyền update */}
      <Route
        path='/edit/:id'
        element={
          <Authorization permissions={{ resource: 'users', action: 'update' }}>
            <EditUser />
          </Authorization>
        }
      />
    </Routes>
  )
}

export default UserRoutes
