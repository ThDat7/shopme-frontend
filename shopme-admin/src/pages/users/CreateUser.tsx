import React from 'react'
import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import UserForm from '../../components/user/UserForm'
import { UserCreateRequest } from '../../types/userTypes'
import { userService } from '../../services/userService'

const CreateUser: React.FC = () => {
  const navigate = useNavigate()

  const handleSubmit = async (values: UserCreateRequest) => {
    await userService.createUser(values)
    navigate('/users')
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
