import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Typography, Spin } from 'antd'
import ProductForm from '../../components/product/ProductForm'
import {
  ProductCreateRequest,
  ProductDetailResponse,
} from '../../types/productTypes'
import { productService } from '../../services/productService'

const { Title } = Typography

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [product, setProduct] = useState<ProductDetailResponse | null>(null)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    if (!id) return

    setLoading(true)
    try {
      const data = await productService.getProduct(parseInt(id))
      setProduct(data)
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: ProductCreateRequest) => {
    if (!id) return

    setSubmitting(true)
    try {
      await productService.updateProduct(parseInt(id), values)
      navigate('/products')
    } catch (error) {
      console.error('Failed to update product:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size='large' />
        </div>
      </Card>
    )
  }

  if (!product && !loading) {
    return (
      <Card>
        <Title level={2}>Product not found</Title>
      </Card>
    )
  }

  return (
    <Card>
      <Title level={2}>Edit Product</Title>
      <ProductForm
        initialValues={product}
        onSubmit={handleSubmit}
        submitButtonText='Update Product'
        loading={submitting}
      />
    </Card>
  )
}

export default EditProduct
