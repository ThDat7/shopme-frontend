// src/routes/UserRoutes.tsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserList from '../components/user/UserList'
import CreateUser from '../components/user/CreateUser'
import EditUser from '../components/user/EditUser'

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<UserList />} />
      <Route path='/create' element={<CreateUser />} />
      <Route path='/edit/:id' element={<EditUser />} />
    </Routes>
  )
}

export default UserRoutes
