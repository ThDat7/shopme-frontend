import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Typography } from 'antd'
import ProductForm from '../../components/product/ProductForm'
import { ProductCreateRequest } from '../../types/productTypes'
import { productService } from '../../services/productService'

const { Title } = Typography

const CreateProduct: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: ProductCreateRequest) => {
    setLoading(true)
    try {
      await productService.createProduct(values)
      navigate('/products')
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
        onSubmit={handleSubmit}
        submitButtonText='Create Product'
        loading={loading}
      />
    </Card>
  )
}

export default CreateProduct
