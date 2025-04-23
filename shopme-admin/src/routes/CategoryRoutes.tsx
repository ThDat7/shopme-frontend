import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CategoryList from '../pages/categories/CategoryList'
import CategorySearch from '../pages/categories/CategorySearch'
import CreateCategory from '../pages/categories/CreateCategory'
import EditCategory from '../pages/categories/EditCategory'
import Authorization from '../components/security/Authorization'

const CategoryRoutes: React.FC = () => {
  return (
    <Routes>
      {/* List categories - cần quyền read */}
      <Route
        path='/'
        element={
          <Authorization
            permissions={{ resource: 'categories', action: 'read' }}
          >
            <CategoryList />
          </Authorization>
        }
      />

      {/* Search categories - cần quyền read */}
      <Route
        path='/search'
        element={
          <Authorization
            permissions={{ resource: 'categories', action: 'read' }}
          >
            <CategorySearch />
          </Authorization>
        }
      />

      {/* Create category - cần quyền create */}
      <Route
        path='/new'
        element={
          <Authorization
            permissions={{ resource: 'categories', action: 'create' }}
          >
            <CreateCategory />
          </Authorization>
        }
      />

      {/* Edit category - cần quyền update */}
      <Route
        path='/edit/:id'
        element={
          <Authorization
            permissions={{ resource: 'categories', action: 'update' }}
          >
            <EditCategory />
          </Authorization>
        }
      />
    </Routes>
  )
}

export default CategoryRoutes
