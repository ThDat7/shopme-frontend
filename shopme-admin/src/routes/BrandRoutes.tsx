import React from 'react'
import { Routes, Route } from 'react-router-dom'
import BrandList from '../pages/brands/BrandList'
import CreateBrand from '../pages/brands/CreateBrand'
import EditBrand from '../pages/brands/EditBrand'

const BrandRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<BrandList />} />
      <Route path='/new' element={<CreateBrand />} />
      <Route path='/edit/:id' element={<EditBrand />} />
    </Routes>
  )
}

export default BrandRoutes
