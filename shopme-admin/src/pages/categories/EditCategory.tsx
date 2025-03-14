import React, { useEffect, useState } from 'react'
import { Card, Button, Typography, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import CategoryForm from '../../components/categories/CategoryForm'
import { categoryService } from '../../services/categoryService'
import { CategoryDetailResponse } from '../../types/categoryTypes'

const { Title } = Typography

const EditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [category, setCategory] = useState<CategoryDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (id) {
          const response = await categoryService.getCategoryById(parseInt(id))
          setCategory(response)
        }
      } catch (error) {
        message.error('Failed to load category details')
        navigate('/categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  if (loading) {
    return null
  }

  if (!category) {
    return null
  }

  return (
    <Card
      title='Edit Category'
      extra={
        <Button type='link' onClick={() => navigate('/categories')}>
          <ArrowLeftOutlined /> Back to Categories
        </Button>
      }
    >
      <CategoryForm initialData={category} isEditMode />
    </Card>
  )
}

export default EditCategory
