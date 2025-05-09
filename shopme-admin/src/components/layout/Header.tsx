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
import { Link, useLocation } from 'react-router-dom'
import {
  UserOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  SettingOutlined,
  LogoutOutlined,
  GlobalOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { ROUTES } from '../../config/appConfig'
import { useRoutes } from '../../hooks/useRoutes'

const { Header: AntHeader } = Layout
const { Text } = Typography

const Header: React.FC = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const { navigateTo } = useRoutes()

  const { logout, userInfo } = useAuth()

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigateTo(ROUTES.PROFILE),
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
      label: <Link to={ROUTES.HOME}>Dashboard</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link to={ROUTES.USERS}>Users</Link>,
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: <Link to={ROUTES.CATEGORIES}>Categories</Link>,
    },
    {
      key: 'brands',
      icon: <AppstoreOutlined />,
      label: <Link to={ROUTES.BRANDS}>Brands</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link to={ROUTES.PRODUCTS}>Products</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to={ROUTES.SETTINGS}>Settings</Link>,
    },
    {
      key: 'locations',
      icon: <GlobalOutlined />,
      label: <Link to={ROUTES.LOCATIONS}>Locations</Link>,
    },
    {
      key: 'shippings',
      icon: <RocketOutlined />,
      label: <Link to={ROUTES.SHIPPING_RATES}>Shipping Rates</Link>,
    },
  ]

  const getSelectedKey = () => {
    if (currentPath.includes(ROUTES.USERS)) return 'users'
    if (currentPath.includes(ROUTES.CATEGORIES)) return 'categories'
    if (currentPath.includes(ROUTES.BRANDS)) return 'brands'
    if (currentPath.includes(ROUTES.PRODUCTS)) return 'products'
    if (currentPath.includes(ROUTES.SETTINGS)) return 'settings'
    if (currentPath.includes(ROUTES.LOCATIONS)) return 'locations'
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
