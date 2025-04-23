import React from 'react'
import { Route, Routes } from 'react-router-dom'
import BrandList from '../pages/brands/BrandList'
import CreateBrand from '../pages/brands/CreateBrand'
import EditBrand from '../pages/brands/EditBrand'
import Authorization from '../components/security/Authorization'

const BrandRoutes: React.FC = () => {
  return (
    <Routes>
      {/* List brands - cần quyền read */}
      <Route
        path='/'
        element={
          <Authorization permissions={{ resource: 'brands', action: 'read' }}>
            <BrandList />
          </Authorization>
        }
      />

      {/* Create brand - cần quyền create */}
      <Route
        path='/create'
        element={
          <Authorization permissions={{ resource: 'brands', action: 'create' }}>
            <CreateBrand />
          </Authorization>
        }
      />

      {/* Edit brand - cần quyền update */}
      <Route
        path='/edit/:id'
        element={
          <Authorization permissions={{ resource: 'brands', action: 'update' }}>
            <EditBrand />
          </Authorization>
        }
      />
    </Routes>
  )
}

export default BrandRoutes
