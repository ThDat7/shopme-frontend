import React from 'react'
import { Link } from 'react-router-dom'
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from '@ant-design/icons'

const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-800 text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* About */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Về ShopMe</h3>
            <p className='text-gray-400'>
              ShopMe là nền tảng thương mại điện tử hàng đầu, cung cấp trải
              nghiệm mua sắm trực tuyến tuyệt vời với đa dạng sản phẩm chất
              lượng.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Liên kết nhanh</h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/about' className='text-gray-400 hover:text-white'>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to='/contact' className='text-gray-400 hover:text-white'>
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to='/terms' className='text-gray-400 hover:text-white'>
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link to='/privacy' className='text-gray-400 hover:text-white'>
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Danh mục</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/categories/electronics'
                  className='text-gray-400 hover:text-white'
                >
                  Điện tử
                </Link>
              </li>
              <li>
                <Link
                  to='/categories/fashion'
                  className='text-gray-400 hover:text-white'
                >
                  Thời trang
                </Link>
              </li>
              <li>
                <Link
                  to='/categories/home'
                  className='text-gray-400 hover:text-white'
                >
                  Nhà cửa
                </Link>
              </li>
              <li>
                <Link
                  to='/categories/beauty'
                  className='text-gray-400 hover:text-white'
                >
                  Làm đẹp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Liên hệ</h3>
            <div className='space-y-2 text-gray-400'>
              <p>Email: contact@shopme.com</p>
              <p>Phone: (84) 123 456 789</p>
              <p>Address: 123 Đường ABC, Quận XYZ, TP.HCM</p>
              <div className='flex space-x-4 mt-4'>
                <a href='#' className='text-gray-400 hover:text-white text-xl'>
                  <FacebookOutlined />
                </a>
                <a href='#' className='text-gray-400 hover:text-white text-xl'>
                  <InstagramOutlined />
                </a>
                <a href='#' className='text-gray-400 hover:text-white text-xl'>
                  <TwitterOutlined />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='border-t border-gray-700 mt-8 pt-8 text-center text-gray-400'>
          <p>&copy; {new Date().getFullYear()} ShopMe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
