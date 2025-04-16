import React, { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Typography,
  Table,
  InputNumber,
  message,
  Popconfirm,
  Checkbox,
  Empty,
  Image,
  Tag,
} from 'antd'
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { useCart } from '../../contexts/CartContext'
import { CartItem } from '../../types/cart'
import { useRoutes } from '../../hooks/useRoutes'
import { ROUTES } from '../../config/appConfig'

const { Title, Text } = Typography

const CartPage: React.FC = () => {
  const routes = useRoutes()
  const {
    cartItems,
    loading,
    selectedItems,
    selectItem,
    selectAllItems,
    updateQuantity: updateCartItemQuantity,
    removeFromCart: removeCartItem,
    getSelectedTotalAmount,
    getCartTotalAmount,
    refreshCart
  } = useCart()

  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    // Refresh cart when component mounts
    refreshCart()
  }, [])

  useEffect(() => {
    // Kiểm tra nút tự động chọn
    if (cartItems.length > 0 && selectedItems.length === cartItems.length) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }, [selectedItems, cartItems])

  const handleQuantityChange = async (productId: number, quantity: number) => {
    if (quantity < 1) return
    await updateCartItemQuantity(productId, quantity)
  }

  const handleRemoveItem = async (productId: number) => {
    await removeCartItem(productId)
    message.success('Đã xóa sản phẩm khỏi giỏ hàng')
  }

  const handleSelectItem = (productId: number, checked: boolean) => {
    selectItem(productId, checked)
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    selectAllItems(checked)
  }

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      message.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán')
      return
    }
    routes.navigateTo(ROUTES.CHECKOUT)
  }

  const columns = [
    {
      title: (
        <Checkbox
          checked={selectAll}
          onChange={(e) => handleSelectAll(e.target.checked)}
          disabled={cartItems.length === 0}
        />
      ),
      key: 'selection',
      width: 50,
      render: (record: CartItem) => (
        <Checkbox
          checked={selectedItems.includes(record.productId)}
          onChange={(e) => handleSelectItem(record.productId, e.target.checked)}
        />
      ),
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (record: CartItem) => (
        <div className="flex items-center">
          <Image
            src={record.mainImage}
            alt={record.name}
            width={80}
            height={80}
            className="object-cover rounded mr-4"
            preview={false}
          />
          <div>
            <Text 
              strong 
              className="block text-base hover:text-blue-500 cursor-pointer" 
              onClick={() => routes.navigateTo(ROUTES.PRODUCT_DETAIL, { id: record.productId })}
            >
              {record.name}
            </Text>
            {record.discountPercent > 0 && (
              <Tag color="red" className="mt-1">-{record.discountPercent}%</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (_: number, record: CartItem) => (
        <div>
          <Text strong className="text-red-500 block">
            {record.discountPrice.toLocaleString('vi-VN')}₫
          </Text>
          {record.discountPercent > 0 && (
            <Text type="secondary" className="line-through text-xs">
              {record.price.toLocaleString('vi-VN')}₫
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      render: (record: CartItem) => (
        <InputNumber
          min={1}
          max={99}
          value={record.quantity}
          onChange={(value) =>
            handleQuantityChange(record.productId, value as number)
          }
          className="w-16"
        />
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (record: CartItem) => (
        <Text strong className="text-red-500">
          {(record.discountPrice * record.quantity).toLocaleString('vi-VN')}₫
        </Text>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (record: CartItem) => (
        <Popconfirm
          title="Xóa sản phẩm"
          description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
          onConfirm={() => handleRemoveItem(record.productId)}
          okText="Có"
          cancelText="Không"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            className="flex items-center"
          >
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ]

  const renderEmptyCart = () => (
    <Card className="shadow-sm rounded-lg">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span className="text-gray-500">Giỏ hàng của bạn đang trống</span>
        }
      >
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          onClick={() => routes.navigateTo(ROUTES.PRODUCTS)}
        >
          Mua sắm ngay
        </Button>
      </Empty>
    </Card>
  )

  const renderCartSummary = () => (
    <Card className="shadow-sm rounded-lg">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Text>Tổng tiền hàng:</Text>
          <Text strong>{getCartTotalAmount().toLocaleString('vi-VN')}₫</Text>
        </div>

        <div className="flex justify-between items-center">
          <Text>Đã chọn:</Text>
          <Text>{selectedItems.length} sản phẩm</Text>
        </div>

        <div className="flex justify-between items-center">
          <Text strong>Tổng thanh toán:</Text>
          <Text strong className="text-xl text-red-500">
            {getSelectedTotalAmount().toLocaleString('vi-VN')}₫
          </Text>
        </div>

        <Button
          type="primary"
          size="large"
          block
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
          className="mt-4"
          icon={<ArrowRightOutlined />}
        >
          Thanh toán ({selectedItems.length})
        </Button>

        <Button
          block
          onClick={() => routes.navigateTo(ROUTES.PRODUCTS)}
          className="mt-2"
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    </Card>
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <Title level={2} className="mb-6">Giỏ hàng của bạn</Title>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-sm rounded-lg overflow-x-auto">
              <Table
                columns={columns}
                dataSource={cartItems}
                rowKey="productId"
                pagination={false}
                loading={loading}
                locale={{
                  emptyText: 'Không có sản phẩm nào trong giỏ hàng',
                }}
              />
            </Card>
          </div>
          <div className="lg:col-span-1">
            {renderCartSummary()}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
