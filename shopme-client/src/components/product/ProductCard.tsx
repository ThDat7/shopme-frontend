import React from 'react'
import { Card, Rate, Tag, Typography, Button } from 'antd'
import {
  ShoppingCartOutlined,
  FireOutlined,
  TrophyOutlined,
  StarOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import {
  ProductListResponse,
  ProductFilterType,
} from '../../types/productTypes'
import { ROUTES } from '../../config/appConfig'
import { createRoute } from '../../hooks/useRoutes'

const { Text, Paragraph } = Typography

export const PRODUCT_TYPE_LABELS: Record<ProductFilterType, string> = {
  [ProductFilterType.ALL]: 'Tất cả sản phẩm',
  [ProductFilterType.BEST_SELLER]: 'Sản phẩm bán chạy',
  [ProductFilterType.TRENDING]: 'Đang thịnh hành',
  [ProductFilterType.HIGH_RATED]: 'Đánh giá cao',
  [ProductFilterType.DISCOUNTED]: 'Giảm giá sốc',
}

interface ProductCardProps {
  product: ProductListResponse
  type?: ProductFilterType
  variant?: 'large' | 'compact'
}

const badgeConfig: Record<
  ProductFilterType,
  { color: string; icon: React.ReactNode; text: string }
> = {
  [ProductFilterType.ALL]: { color: '', icon: null, text: '' },
  [ProductFilterType.BEST_SELLER]: {
    color: 'red',
    icon: <TrophyOutlined />,
    text: 'Best Seller',
  },
  [ProductFilterType.TRENDING]: {
    color: 'volcano',
    icon: <FireOutlined />,
    text: 'Trending',
  },
  [ProductFilterType.HIGH_RATED]: {
    color: 'gold',
    icon: <StarOutlined />,
    text: 'Top Rated',
  },
  [ProductFilterType.DISCOUNTED]: {
    color: 'green',
    icon: <DollarOutlined />,
    text: 'Hot Deal',
  },
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  type = ProductFilterType.ALL,
  variant = 'compact',
}) => {
  const navigate = useNavigate()
  const isLarge = variant === 'large'

  const getBadgeContent = () => {
    if (type === ProductFilterType.ALL) return null
    const config = badgeConfig[type]
    return (
      <Tag
        color={config.color}
        style={{ position: 'absolute', top: 10, right: 10 }}
      >
        {config.icon} {config.text}
      </Tag>
    )
  }

  return (
    <Card
      hoverable
      cover={
        <div
          style={{ position: 'relative', paddingTop: isLarge ? '75%' : '100%' }}
        >
          <img
            alt={product.name}
            src={product.mainImage}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {getBadgeContent()}
          {product.discountPercent > 0 && (
            <Tag
              color='red'
              style={{ position: 'absolute', top: 10, left: 10 }}
              className="px-2 py-1 text-xs font-bold"
            >
              -{product.discountPercent}%
            </Tag>
          )}
        </div>
      }
      bodyStyle={{ padding: isLarge ? '16px' : '12px' }}
      onClick={() => navigate(createRoute(ROUTES.PRODUCT_DETAIL, { id: product.id }))}
    >
      <Paragraph
        ellipsis={{ rows: 2 }}
        style={{
          marginBottom: 8,
          height: isLarge ? 44 : 32,
          fontSize: isLarge ? 16 : 14,
        }}
      >
        {product.name}
      </Paragraph>

      <div style={{ marginBottom: 8 }}>
        <Rate
          disabled
          defaultValue={product.averageRating}
          style={{ fontSize: isLarge ? 12 : 10 }}
        />
        <span
          style={{ marginLeft: 8, color: '#666', fontSize: isLarge ? 12 : 10 }}
        >
          {product.averageRating.toFixed(1)}
          {` (${product.reviewCount})`}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isLarge ? 8 : 4,
        }}
      >
        <div>
          <Text type='danger' strong style={{ fontSize: isLarge ? 18 : 14 }}>
            {product.discountPercent > 0
              ? product.discountPrice.toLocaleString('vi-VN')
              : product.price.toLocaleString('vi-VN')}đ
          </Text>
          {product.discountPercent > 0 && (
            <Text
              delete
              type='secondary'
              style={{ marginLeft: 8, fontSize: isLarge ? 14 : 12 }}
            >
              {product.price.toLocaleString('vi-VN')}đ
            </Text>
          )}
        </div>
        {isLarge && (
          <Button
            type='primary'
            icon={<ShoppingCartOutlined />}
            size='small'
            onClick={(e) => {
              e.stopPropagation()
              // Add to cart logic
            }}
            className="bg-primary-500 hover:bg-primary-600 border-primary-500"
          >
            Thêm
          </Button>
        )}
      </div>

      {isLarge && (
        <Text type='secondary' style={{ fontSize: 12 }}>
          Đã bán: {product.saleCount}
          {type === ProductFilterType.TRENDING && ' tuần này'}
        </Text>
      )}
    </Card>
  )
}
