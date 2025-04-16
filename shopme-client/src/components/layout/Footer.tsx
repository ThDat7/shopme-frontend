import React from 'react'
import { Link } from 'react-router-dom'
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from '@ant-design/icons'
import { ROUTES } from '../../config/appConfig'

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
                <Link to={ROUTES.ABOUT} className='text-gray-400 hover:text-white'>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SUPPORT_CONTACT} className='text-gray-400 hover:text-white'>
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SUPPORT_GUIDE} className='text-gray-400 hover:text-white'>
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SUPPORT_WARRANTY} className='text-gray-400 hover:text-white'>
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SUPPORT_FAQ} className='text-gray-400 hover:text-white'>
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Danh mục</h3>
            <ul className='space-y-2'>
              <li>
                <Link to={ROUTES.PRODUCTS} className='text-gray-400 hover:text-white'>
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PROMOTIONS} className='text-gray-400 hover:text-white'>
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link to={ROUTES.NEWS} className='text-gray-400 hover:text-white'>
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Liên hệ</h3>
            <p className='text-gray-400 mb-2'>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
            <p className='text-gray-400 mb-2'>Email: support@shopme.com</p>
            <p className='text-gray-400 mb-4'>Hotline: 1900 1234</p>
            <div className='flex space-x-4'>
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

        <div className='border-t border-gray-700 mt-8 pt-8 text-center text-gray-400'>
          <p> {new Date().getFullYear()} ShopMe. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
