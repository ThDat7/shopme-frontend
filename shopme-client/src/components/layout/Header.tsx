import React, { useState } from 'react'
import '@ant-design/v5-patch-for-react-19'
import {
  Layout,
  Menu,
  Space,
  Avatar,
  Dropdown,
  Typography,
  MenuProps,
  Input,
  Badge,
  Drawer,
  Button,
} from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  UserOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  SearchOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
// import { useAuth } from '../../contexts/AuthContext'

const { Header: AntHeader } = Layout
const { Text } = Typography

const Header: React.FC = () => {
  const location = useLocation()
  const currentPath = location.pathname

  // const { logout, userInfo } = useAuth()
  const { logout, userInfo } = {
    logout: () => {},
    userInfo: { lastName: null, firstName: null },
  }
  const navigate = useNavigate()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'addresses',
      icon: <EnvironmentOutlined />,
      label: 'My Addresses',
      onClick: () => navigate('/addresses'),
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
      key: 'brands',
      icon: <AppstoreOutlined />,
      label: <Link to='/brands'>Brands</Link>,
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
    if (currentPath.includes('/brands')) return 'brands'
    if (currentPath.includes('/products')) return 'products'
    if (currentPath.includes('/settings')) return 'settings'
    return 'dashboard'
  }

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center'>
            <span className='text-2xl font-bold text-primary'>ShopMe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            <Link to='/' className='text-gray-600 hover:text-primary'>
              Trang chủ
            </Link>
            <Link to='/categories' className='text-gray-600 hover:text-primary'>
              Danh mục
            </Link>
            <Link to='/products' className='text-gray-600 hover:text-primary'>
              Sản phẩm
            </Link>
            <Link to='/about' className='text-gray-600 hover:text-primary'>
              Giới thiệu
            </Link>
          </nav>

          {/* Search, Cart, User */}
          <div className='flex items-center space-x-4'>
            <div className='hidden md:block'>
              <Input
                placeholder='Tìm kiếm...'
                prefix={<SearchOutlined className='text-gray-400' />}
                className='w-64'
              />
            </div>
            <Link to='/cart' className='text-gray-600 hover:text-primary'>
              <Badge count={0}>
                <ShoppingCartOutlined className='text-2xl' />
              </Badge>
            </Link>
            <Dropdown menu={{ items: userMenuItems }} placement='bottomRight'>
              <a className='text-gray-600 hover:text-primary'>
                <UserOutlined className='text-2xl' />
              </a>
            </Dropdown>
            {/* <Link to='/account' className='text-gray-600 hover:text-primary'>
              <UserOutlined className='text-2xl' />
            </Link> */}
            <button
              className='md:hidden text-gray-600'
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuOutlined className='text-2xl' />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Drawer
        title='Menu'
        placement='right'
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
      >
        <div className='flex flex-col space-y-4'>
          <Input
            placeholder='Tìm kiếm...'
            prefix={<SearchOutlined className='text-gray-400' />}
            className='mb-4'
          />
          <Link to='/' className='text-gray-600 hover:text-primary'>
            Trang chủ
          </Link>
          <Link to='/categories' className='text-gray-600 hover:text-primary'>
            Danh mục
          </Link>
          <Link to='/products' className='text-gray-600 hover:text-primary'>
            Sản phẩm
          </Link>
          <Link to='/about' className='text-gray-600 hover:text-primary'>
            Giới thiệu
          </Link>
          <Link to='/addresses' className='text-gray-600 hover:text-primary'>
            Địa chỉ của tôi
          </Link>
          <div className='border-t border-gray-200 my-2 pt-2'>
            <Link to='/cart' className='text-gray-600 hover:text-primary'>
              Giỏ hàng
            </Link>
          </div>
        </div>
      </Drawer>
    </header>
  )
}

export default Header
