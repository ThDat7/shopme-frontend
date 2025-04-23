import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProductList from '../pages/products/ProductList'
import CreateProduct from '../pages/products/CreateProduct'
import EditProduct from '../pages/products/EditProduct'
import Authorization from '../components/security/Authorization'

const ProductRoutes: React.FC = () => {
  return (
    <Routes>
      {/* List products - cần quyền read */}
      <Route
        path='/'
        element={
          <Authorization permissions={{ resource: 'products', action: 'read' }}>
            <ProductList />
          </Authorization>
        }
      />

      {/* Create product - cần quyền create */}
      <Route
        path='/create'
        element={
          <Authorization
            permissions={{ resource: 'products', action: 'create' }}
          >
            <CreateProduct />
          </Authorization>
        }
      />

      {/* Edit product - cần quyền update */}
      <Route
        path='/edit/:id'
        element={
          <Authorization
            permissions={{ resource: 'products', action: 'update' }}
          >
            <EditProduct />
          </Authorization>
        }
      />
    </Routes>
  )
}

export default ProductRoutes
