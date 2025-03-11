import React from 'react'
import { Layout as AntLayout, Space, Avatar, Typography, Dropdown } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Header, Content } = AntLayout
const { Text } = Typography

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
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
          <Text style={{ color: 'white' }}>User</Text>
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
