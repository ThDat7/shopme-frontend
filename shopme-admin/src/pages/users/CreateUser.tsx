import React from 'react'
import { Card } from 'antd'
import UserForm from '../../components/user/UserForm'
import { UserCreateRequest } from '../../types/userTypes'
import { userService } from '../../services/userService'
import { useRoutes } from '../../hooks/useRoutes'
import { ROUTES } from '../../config/appConfig'

const CreateUser: React.FC = () => {
  const { navigateTo } = useRoutes()

  const handleSubmit = async (values: UserCreateRequest) => {
    await userService.createUser(values)
    navigateTo(ROUTES.USERS)
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title='Create New User'>
        <UserForm onSubmit={handleSubmit} submitButtonText='Create User' />
      </Card>
    </div>
  )
}

export default CreateUser
