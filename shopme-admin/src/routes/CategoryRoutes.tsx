import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CategoryList from '../pages/categories/CategoryList'
import CategorySearch from '../pages/categories/CategorySearch'
import CreateCategory from '../pages/categories/CreateCategory'
import EditCategory from '../pages/categories/EditCategory'

const CategoryRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<CategoryList />} />
      <Route path='/search' element={<CategorySearch />} />
      <Route path='/new' element={<CreateCategory />} />
      <Route path='/edit/:id' element={<EditCategory />} />
    </Routes>
  )
}

export default CategoryRoutes
