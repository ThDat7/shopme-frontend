import React, { useState } from 'react'
import { Card, Typography } from 'antd'
import ProductForm from '../../components/product/ProductForm'
import { ProductCreateRequest } from '../../types/productTypes'
import { productService } from '../../services/productService'
import { useRoutes } from '../../hooks/useRoutes'
import { ROUTES } from '../../config/appConfig'

const { Title } = Typography

const CreateProduct: React.FC = () => {
  const { navigateTo } = useRoutes()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: ProductCreateRequest) => {
    setLoading(true)
    try {
      await productService.createProduct(values)
      navigateTo(ROUTES.PRODUCTS)
    } catch (error) {
      console.error('Failed to create product:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <Title level={2}>Create New Product</Title>
      <ProductForm
        initialValues={null}
        onSubmit={handleSubmit}
        submitButtonText='Create Product'
        loading={loading}
      />
    </Card>
  )
}

export default CreateProduct
