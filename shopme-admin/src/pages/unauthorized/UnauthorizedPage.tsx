import React from 'react'
import { Result, Button } from 'antd'
import { HomeOutlined, LockOutlined } from '@ant-design/icons'
import { useRoutes } from '../../hooks/useRoutes'
import { ROUTES } from '../../config/appConfig'

/**
 * Page displayed when a user tries to access a resource they don't have permission for
 */
const UnauthorizedPage: React.FC = () => {
  const { navigateTo, navigate } = useRoutes()

  return (
    <div className='h-screen flex items-center justify-center p-4'>
      <Result
        status='403'
        title='Không có quyền truy cập'
        subTitle='Xin lỗi, bạn không có quyền truy cập trang này hoặc thực hiện hành động này.'
        icon={<LockOutlined />}
        extra={[
          <Button key='back' onClick={() => navigate(-1)}>
            Quay lại
          </Button>,
          <Button
            type='primary'
            key='home'
            icon={<HomeOutlined />}
            onClick={() => navigateTo(ROUTES.HOME)}
          >
            Về trang chủ
          </Button>,
        ]}
      />
    </div>
  )
}

export default UnauthorizedPage
