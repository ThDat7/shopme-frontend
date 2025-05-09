import React, { useEffect, useState } from 'react'
import { Card, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import CategoryForm from '../../components/categories/CategoryForm'
import { categoryService } from '../../services/categoryService'
import { CategoryDetailResponse } from '../../types/categoryTypes'
import { useRoutes } from '../../hooks/useRoutes'
import { ROUTES } from '../../config/appConfig'

const EditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { navigateTo } = useRoutes()
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
        navigateTo(ROUTES.CATEGORIES)
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
        <Button type='link' onClick={() => navigateTo(ROUTES.CATEGORIES)}>
          <ArrowLeftOutlined /> Back to Categories
        </Button>
      }
    >
      <CategoryForm initialData={category} isEditMode />
    </Card>
  )
}

export default EditCategory
