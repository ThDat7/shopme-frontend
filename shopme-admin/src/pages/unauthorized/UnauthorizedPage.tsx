import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { HomeOutlined, LockOutlined } from '@ant-design/icons'

/**
 * Page displayed when a user tries to access a resource they don't have permission for
 */
const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()

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
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>,
        ]}
      />
    </div>
  )
}

export default UnauthorizedPage
