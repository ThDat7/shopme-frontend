import React from 'react'
import '@ant-design/v5-patch-for-react-19'
import {
  Layout,
  Menu,
  Space,
  Avatar,
  Dropdown,
  Typography,
  MenuProps,
} from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  UserOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'

const { Header: AntHeader } = Layout
const { Text } = Typography

const Header: React.FC = () => {
  const location = useLocation()
  const currentPath = location.pathname

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

  const mainMenuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to='/'>Dashboard</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link to='/users'>Users</Link>,
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: <Link to='/categories'>Categories</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link to='/products'>Products</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to='/settings'>Settings</Link>,
    },
  ]

  const getSelectedKey = () => {
    if (currentPath.includes('/users')) return 'users'
    if (currentPath.includes('/categories')) return 'categories'
    if (currentPath.includes('/products')) return 'products'
    if (currentPath.includes('/settings')) return 'settings'
    return 'dashboard'
  }

  return (
    <AntHeader className='header' style={{ padding: 0 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Menu
          theme='dark'
          mode='horizontal'
          selectedKeys={[getSelectedKey()]}
          items={mainMenuItems}
          style={{
            lineHeight: '64px',
            flex: 1,
          }}
        />
        <div style={{ paddingRight: '24px' }}>
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
        </div>
      </div>
    </AntHeader>
  )
}

export default Header
