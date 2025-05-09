import React, { useEffect, useState } from 'react'
import { Card, Spin, message } from 'antd'
import { useParams } from 'react-router-dom'
import UserForm from '../../components/user/UserForm'
import { UserCreateRequest, UserDetailResponse } from '../../types/userTypes'
import { userService } from '../../services/userService'
import { useRoutes } from '../../hooks/useRoutes'
import { ROUTES } from '../../config/appConfig'

const EditUser: React.FC = () => {
  const { navigateTo } = useRoutes()
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<UserDetailResponse>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      if (!id) return
      const response = await userService.getUser(parseInt(id))
      setUser(response)
    } catch (error) {
      console.error('Error fetching user:', error)
      message.error('Failed to fetch user')
      navigateTo(ROUTES.USERS)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: UserCreateRequest) => {
    if (!id) return
    await userService.updateUser(parseInt(id), {
      ...values,
      id: parseInt(id),
    })
    navigateTo(ROUTES.USERS)
  }

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}
      >
        <Spin size='large' />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title='Edit User'>
        <UserForm
          initialValues={user}
          onSubmit={handleSubmit}
          submitButtonText='Update User'
        />
      </Card>
    </div>
  )
}

export default EditUser
