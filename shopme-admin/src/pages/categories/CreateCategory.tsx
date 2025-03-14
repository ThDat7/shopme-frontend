import React from 'react'
import { Card, Button, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import CategoryForm from '../../components/categories/CategoryForm'

const { Title } = Typography

const CreateCategory: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Card
      title='Create New Category'
      extra={
        <Button type='link' onClick={() => navigate('/categories')}>
          <ArrowLeftOutlined /> Back to Categories
        </Button>
      }
    >
      <CategoryForm />
    </Card>
  )
}

export default CreateCategory
