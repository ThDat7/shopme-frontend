import React from 'react'
import { Card, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import CategoryForm from '../../components/categories/CategoryForm'
import { useRoutes } from '../../hooks/useRoutes'
import { ROUTES } from '../../config/appConfig'

const CreateCategory: React.FC = () => {
  const { navigateTo } = useRoutes()

  return (
    <Card
      title='Create New Category'
      extra={
        <Button type='link' onClick={() => navigateTo(ROUTES.CATEGORIES)}>
          <ArrowLeftOutlined /> Back to Categories
        </Button>
      }
    >
      <CategoryForm />
    </Card>
  )
}

export default CreateCategory
