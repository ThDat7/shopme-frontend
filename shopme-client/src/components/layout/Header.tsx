import React, { useState, useEffect } from 'react'
import '@ant-design/v5-patch-for-react-19'
import { Avatar, Dropdown, MenuProps, Input, Badge, Drawer, Button, Popover, Typography } from 'antd'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import CartPreviewItem from '../cart/CartPreviewItem'
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  OrderedListOutlined,
  LoginOutlined,
  UserAddOutlined,

  PhoneOutlined,
  DownOutlined,
  LaptopOutlined,
  MobileOutlined,
  TabletOutlined,
  AudioOutlined,
  TagOutlined,
  HeartOutlined,
  DesktopOutlined,
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { ROUTES } from '../../config/appConfig'
import PromotionBanner from '../header/PromotionBanner'
import featureCategoryService from '../../services/featureCategoryService'
import { FeatureCategoryItem, FeatureSubcategoryItem } from '../../types/featureCategoryTypes'
import { useRoutes } from '../../hooks/useRoutes'

const { Search } = Input;
const { Title } = Typography;

const Header: React.FC = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const navigate = useNavigate()
  const { navigateTo } = useRoutes()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [featureCategories, setFeatureCategories] = useState<FeatureCategoryItem[]>([])
  const [loading, setLoading] = useState(false)

  // Use the AuthContext and CartContext
  const { logout, customer, isAuthenticated } = useAuth()
  const { cartItems, getTotalItems } = useCart()

  // User menu items when authenticated
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Tài khoản của tôi',
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      key: 'orders',
      icon: <OrderedListOutlined />,
      label: 'Đơn hàng của tôi',
      onClick: () => navigate(ROUTES.ORDERS),
    },
    {
      key: 'addresses',
      icon: <EnvironmentOutlined />,
      label: 'Địa chỉ của tôi',
      onClick: () => navigate(ROUTES.ADDRESSES),
    },
    {
      key: 'wishlist',
      icon: <HeartOutlined />,
      label: 'Sản phẩm yêu thích',
      onClick: () => navigate(ROUTES.WISHLIST),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        logout()
        navigate(ROUTES.HOME)
      },
    },
  ]

  // Hàm này sẽ được sử dụng khi làm tính năng hiển thị khuyến mãi
  /*const getPromotionIconByName = (iconName: string) => {
    switch (iconName) {
      case 'ThunderboltOutlined':
        return <ThunderboltOutlined />
      case 'TagOutlined':
        return <TagOutlined />
      case 'FireOutlined':
        return <FireOutlined />
      default:
        return <TagOutlined />
    }
  }*/

  // Fetch feature categories for header menu
  useEffect(() => {
    const fetchFeatureCategories = async () => {
      setLoading(true)
      try {
        const categories = await featureCategoryService.getFeatureCategories()
        const organizedCategories = featureCategoryService.organizeFeatureCategories(categories)
        setFeatureCategories(organizedCategories)
      } catch (error) {
        console.error('Lỗi khi tải danh mục feature:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatureCategories()
  }, [])

  // Hàm xử lý tìm kiếm
  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigateTo(ROUTES.PRODUCTS, {}, { keyword: value.trim() });
    }
  }

  // Helper function để lấy icon dựa trên tên danh mục
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Điện thoại': <MobileOutlined />,
      'Laptop': <LaptopOutlined />,
      'Máy tính bảng': <TabletOutlined />,
      'Âm thanh': <AudioOutlined />,
      'Màn hình': <DesktopOutlined />,
      'Phụ kiện': <TagOutlined />
    };
    
    return iconMap[categoryName] || <TagOutlined />;
  };

  // Xu1eed lu00fd khi bu1ea5m vu00e0o danh mu1ee5c
  const handleFeatureCategoryClick = (featureItem: FeatureCategoryItem | FeatureSubcategoryItem, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    // Su1eed du1ee5ng navigateTo vu1edbi query params thay vu00ec nu1ed1i chu1ed7i URL
    if (featureItem.categoryId) {
      const queryParams: Record<string, number> = {
        categoryIds: featureItem.categoryId
      };
      
      if (featureItem.brandId) {
        queryParams.brandIds = featureItem.brandId;
      }
      
      // Su1eed du1ee5ng navigateTo vu1edbi query params
      navigateTo(ROUTES.PRODUCTS, {}, queryParams);
    }
  };

  // Mega menu cho danh mục sản phẩm
  const productCategoriesContent = (
    <div className="mega-menu-container" style={{ maxWidth: '600px', width: '100%', padding: '10px' }}>
      {loading ? (
        <div className="text-center py-4">Đang tải danh mục...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {featureCategories.map((category) => (
            <div key={category.id} style={{ width: '33%', padding: '10px' }}>
              <Title level={5} style={{ marginBottom: '10px', borderBottom: '1px solid #f0f0f0', paddingBottom: '5px' }}>
                <Link to={ROUTES.PRODUCTS} onClick={(e) => handleFeatureCategoryClick(category, e)} style={{ display: 'flex', alignItems: 'center' }}>
                  {category.icon ? (
                    <img 
                      src={category.icon} 
                      alt={category.name} 
                      style={{ width: '16px', height: '16px', marginRight: '8px' }} 
                    />
                  ) : (
                    getCategoryIcon(category.name)
                  )}
                  {` ${category.name}`}
                </Link>
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {category.children.map((subCategory) => (
                  <Link 
                    key={subCategory.id}
                    to={ROUTES.PRODUCTS} 
                    onClick={(e) => handleFeatureCategoryClick(subCategory, e)}
                    className="text-gray-600 hover:text-primary"
                  >
                    {subCategory.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Button type="link" onClick={() => navigate(ROUTES.CATEGORIES)}>
          Xem tất cả danh mục
        </Button>
      </div>
    </div>
  )

  const miniSupportMenu = (
    <div style={{ width: '200px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link to={ROUTES.SUPPORT_GUIDE} className="text-gray-600 hover:text-primary" style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
          <span className="mr-2">📦</span>
          Hướng dẫn mua hàng
        </Link>
        <Link to={ROUTES.SUPPORT_RETURN_POLICY} className="text-gray-600 hover:text-primary" style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
          <span className="mr-2">🔄</span>
          Chính sách đổi trả
        </Link>
        <Link to={ROUTES.SUPPORT_WARRANTY} className="text-gray-600 hover:text-primary" style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
          <span className="mr-2">🔧</span>
          Chính sách bảo hành
        </Link>
        <Link to={ROUTES.SUPPORT_CONTACT} className="text-gray-600 hover:text-primary" style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
          <span className="mr-2">📞</span>
          Liên hệ
        </Link>
    </div>
  )

  // Content inside the mobile menu drawer
  const mobileMenuContent = (
    <div className='flex flex-col space-y-4'>
      <Search
        placeholder='Tìm kiếm...'
        allowClear
        enterButton={<SearchOutlined />}
        onSearch={handleSearch}
        className='mb-4'
      />
      <Link 
        to={ROUTES.HOME} 
        className='text-gray-600 hover:text-primary'
        onClick={() => setMobileMenuOpen(false)}
      >
        Trang chủ
      </Link>
      <div>
        <div className='font-medium mb-2'>Sản phẩm</div>
        <div className='pl-4 flex flex-col space-y-2'>
          {featureCategories.map(category => (
            <Link 
              key={category.id}
              to={ROUTES.PRODUCTS} 
              onClick={(e) => {
                handleFeatureCategoryClick(category, e);
                setMobileMenuOpen(false);
              }}
              className='text-gray-600 hover:text-primary'
            >
              {category.name}
            </Link>
          ))}
          <Link 
            to={ROUTES.PRODUCTS} 
            className='text-gray-600 hover:text-primary font-medium'
            onClick={() => setMobileMenuOpen(false)}
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
      <div>
        <div className='font-medium mb-2'>Khuyến mãi</div>
        <div className='pl-4 flex flex-col space-y-2'>
          <Link 
            to={ROUTES.PROMOTIONS} 
            className='text-gray-600 hover:text-primary'
            onClick={() => setMobileMenuOpen(false)}
          >
            Khuyến mãi
          </Link>
        </div>
      </div>
      <Link 
        to={ROUTES.NEWS} 
        className='text-gray-600 hover:text-primary'
        onClick={() => setMobileMenuOpen(false)}
      >
        Tin tức
      </Link>
      <div>
        <div className='font-medium mb-2'>Hỗ trợ</div>
        <div className='pl-4 flex flex-col space-y-2'>
          <Link 
            to={ROUTES.SUPPORT_GUIDE} 
            className='text-gray-600 hover:text-primary'
            onClick={() => setMobileMenuOpen(false)}
          >
            Hướng dẫn mua hàng
          </Link>
          <Link 
            to={ROUTES.SUPPORT_RETURN_POLICY} 
            className='text-gray-600 hover:text-primary'
            onClick={() => setMobileMenuOpen(false)}
          >
            Chính sách đổi trả
          </Link>
          <Link 
            to={ROUTES.SUPPORT_WARRANTY} 
            className='text-gray-600 hover:text-primary'
            onClick={() => setMobileMenuOpen(false)}
          >
            Chính sách bảo hành
          </Link>
          <Link 
            to={ROUTES.SUPPORT_CONTACT} 
            className='text-gray-600 hover:text-primary'
            onClick={() => setMobileMenuOpen(false)}
          >
            Liên hệ
          </Link>
        </div>
      </div>
      <Link 
        to={ROUTES.ABOUT} 
        className='text-gray-600 hover:text-primary'
        onClick={() => setMobileMenuOpen(false)}
      >
        Giới thiệu
      </Link>
      <Link 
        to={ROUTES.ORDER_TRACKING} 
        className='text-gray-600 hover:text-primary'
        onClick={() => setMobileMenuOpen(false)}
      >
        Tra cứu đơn hàng
      </Link>

      {/* Authentication-dependent links for mobile */}
      {isAuthenticated ? (
        <>
          <div className='border-t border-gray-200 my-2 pt-2'>
            <Link
              to={ROUTES.PROFILE}
              className='text-gray-600 hover:text-primary'
              onClick={() => setMobileMenuOpen(false)}
            >
              Tài khoản của tôi
            </Link>
          </div>
          <Link
            to={ROUTES.ORDERS}
            className='text-gray-600 hover:text-primary'
            onClick={() => setMobileMenuOpen(false)}
          >
            Đơn hàng của tôi
          </Link>
          <Link
            to={ROUTES.ADDRESSES}
            className='text-gray-600 hover:text-primary'
            onClick={() => setMobileMenuOpen(false)}
          >
            Địa chỉ của tôi
          </Link>
          <Link
            to={ROUTES.CART}
            className='text-gray-600 hover:text-primary'
            onClick={() => setMobileMenuOpen(false)}
          >
            Giỏ hàng
          </Link>
          <Link
            to={ROUTES.WISHLIST}
            className='text-gray-600 hover:text-primary'
            onClick={() => setMobileMenuOpen(false)}
          >
            Sản phẩm yêu thích
          </Link>
          <Button
            type='text'
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              logout()
              setMobileMenuOpen(false)
              navigate(ROUTES.HOME)
            }}
          >
            Đăng xuất
          </Button>
        </>
      ) : (
        <div className='border-t border-gray-200 my-2 pt-2 flex flex-col space-y-2'>
          <Button
            type='default'
            icon={<LoginOutlined />}
            onClick={() => {
              setMobileMenuOpen(false)
              navigate(ROUTES.LOGIN)
            }}
          >
            Đăng nhập
          </Button>
          <Button
            type='primary'
            icon={<UserAddOutlined />}
            onClick={() => {
              setMobileMenuOpen(false)
              navigate(ROUTES.REGISTER)
            }}
          >
            Đăng ký
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Banner khuyến mãi */}
      <PromotionBanner />
      
      {/* Top header */}
      <div className='bg-gray-100 py-2 text-sm hidden md:block'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center text-sm'>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-600'>
                <PhoneOutlined style={{ marginRight: '4px' }} /> Hotline: 1900 1234
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <Link to={ROUTES.SUPPORT_CONTACT} className='text-gray-600 hover:text-primary'>
                Liên hệ
              </Link>
              <Link to={ROUTES.SUPPORT_GUIDE} className='text-gray-600 hover:text-primary'>
                Hướng dẫn mua hàng
              </Link>
              <Link to={ROUTES.ABOUT} className='text-gray-600 hover:text-primary'>
                Giới thiệu
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to={ROUTES.HOME} className='flex items-center'>
            <span className='text-2xl font-bold text-primary'>ShopMe</span>
          </Link>

          {/* Search */}
          <div className='hidden md:block relative w-96'>
            <Search
              placeholder='Tìm kiếm sản phẩm...'
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
            />
          </div>

          {/* Cart and User */}
          <div className='flex items-center space-x-4'>
            {/* Shopping cart for all users (with correct count from context) */}
            <Link to={ROUTES.CART} className='text-gray-600 hover:text-primary relative group'>
              <Badge count={getTotalItems()} showZero>
                <ShoppingCartOutlined
                  style={{ fontSize: '24px', color: '#666' }}
                  className="transition-colors duration-300 group-hover:text-primary-500"
                />
              </Badge>
              {/* Cart preview tooltip on hover */}
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-medium">Giỏ hàng ({getTotalItems()} sản phẩm)</p>
                </div>
                <div className="p-3">
                  {cartItems.length > 0 ? (
                    <div>
                      <div className="max-h-48 overflow-y-auto">
                        {cartItems.slice(0, 3).map(item => (
                          <CartPreviewItem key={item.productId} item={item} />
                        ))}
                        {cartItems.length > 3 && (
                          <p className="text-xs text-gray-500 text-center">+{cartItems.length - 3} sản phẩm khác</p>
                        )}
                      </div>
                      <Button 
                        type="primary" 
                        block 
                        className="mt-3"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(ROUTES.CART);
                        }}
                      >
                        Xem giỏ hàng
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-sm text-gray-500">Giỏ hàng của bạn đang trống</p>
                      <Button 
                        type="primary" 
                        className="mt-2"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(ROUTES.PRODUCTS);
                        }}
                      >
                        Mua sắm ngay
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Link>

            {/* User menu dropdown or auth buttons */}
            {isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement='bottomRight'>
                <div className='flex items-center cursor-pointer'>
                  <Avatar
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<UserOutlined />}
                  />
                  <span className='hidden md:inline ml-2 text-gray-700'>
                    {customer?.firstName} {customer?.lastName}
                  </span>
                </div>
              </Dropdown>
            ) : (
              <div className='hidden md:flex items-center space-x-2'>
                <Button
                  type='text'
                  icon={<LoginOutlined />}
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Đăng nhập
                </Button>
                <Button
                  type='primary'
                  icon={<UserAddOutlined />}
                  onClick={() => navigate(ROUTES.REGISTER)}
                >
                  Đăng ký
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className='md:hidden text-gray-500 hover:text-primary'
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuOutlined style={{ fontSize: '20px' }} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className='hidden md:block border-t border-gray-200'>
          <div className='flex items-center justify-between h-12'>
            <nav className='flex space-x-8'>
              <Link 
                to={ROUTES.HOME} 
                className={`text-gray-600 hover:text-primary ${currentPath === ROUTES.HOME ? 'text-primary font-medium' : ''}`}
              >
                Trang chủ
              </Link>
              <Popover 
                content={productCategoriesContent} 
                trigger="hover" 
                placement="bottom" 
                overlayClassName="mega-menu"
                overlayStyle={{ maxWidth: '95vw' }}
              >
                <Link 
                  to={ROUTES.PRODUCTS} 
                  className={`text-gray-600 hover:text-primary flex items-center ${currentPath.startsWith(ROUTES.PRODUCTS) || currentPath.startsWith(ROUTES.CATEGORY_DETAIL) ? 'text-primary font-medium' : ''}`}
                >
                  Sản phẩm <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
                </Link>
              </Popover>
              <Link 
                to={ROUTES.PROMOTIONS} 
                className={`text-gray-600 hover:text-primary ${currentPath === ROUTES.PROMOTIONS ? 'text-primary font-medium' : ''}`}
              >
                Khuyến mãi
              </Link>
              <Link 
                to={ROUTES.NEWS} 
                className={`text-gray-600 hover:text-primary ${currentPath === ROUTES.NEWS ? 'text-primary font-medium' : ''}`}
              >
                Tin tức
              </Link>
              <Popover 
                content={miniSupportMenu} 
                trigger="hover" 
                placement="bottom"
              >
                <Link 
                  to={ROUTES.SUPPORT} 
                  className={`text-gray-600 hover:text-primary flex items-center ${currentPath.startsWith(ROUTES.SUPPORT) ? 'text-primary font-medium' : ''}`}
                >
                  Hỗ trợ <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
                </Link>
              </Popover>
              <Link 
                to={ROUTES.ABOUT} 
                className={`text-gray-600 hover:text-primary ${currentPath === ROUTES.ABOUT ? 'text-primary font-medium' : ''}`}
              >
                Giới thiệu
              </Link>
            </nav>
            <div>
              <Link to={ROUTES.ORDER_TRACKING} className='text-gray-600 hover:text-primary'>
                <OrderedListOutlined style={{ marginRight: '4px' }} /> Tra cứu đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title='Menu'
        placement='right'
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
      >
        {mobileMenuContent}
      </Drawer>
    </header>
  )
}

export default Header
