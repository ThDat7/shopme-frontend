import React from 'react'
import {
  Layout as AntLayout,
  Menu,
  Button,
  Space,
  Avatar,
  Typography,
  Dropdown,
} from 'antd'
import {
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'

const { Header, Content } = AntLayout
const { Text } = Typography

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, userInfo } = useAuth()
  const navigate = useNavigate()

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ]

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <div style={{ color: 'white', fontSize: '20px' }}>Admin Dashboard</div>
        <Space>
          <Text style={{ color: 'white' }}>
            {userInfo?.firstName} {userInfo?.lastName}
          </Text>
          <Dropdown menu={{ items: userMenuItems }} placement='bottomRight'>
            <Avatar
              style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Space>
      </Header>
      <Content style={{ padding: '24px' }}>{children}</Content>
    </AntLayout>
  )
}

export default Layout
