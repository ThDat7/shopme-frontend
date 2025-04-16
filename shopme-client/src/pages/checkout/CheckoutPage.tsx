import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Radio,
  Button,
  message,
  Typography,
  List,
  Row,
  Col,
  Divider,
  Empty,
  Steps,
  Image,
  Tag,
} from 'antd'
import { PaymentMethod } from '../../types/payment'
import { ROUTES } from '../../config/appConfig'
import addressService from '../../services/addressService'
import CheckoutAddressSelector from '../../components/checkout/CheckoutAddressSelector'
import { AddressDetail } from '../../types/address'
import { useCart } from '../../contexts/CartContext'
import {
  ShoppingCartOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import codIcon from '../../assets/icons/cod.png';
import bankingIcon from '../../assets/icons/banking.png';
import checkoutService from '../../services/checkoutService'
import { useRoutes } from '../../hooks/useRoutes'


const { Title, Text } = Typography

const CheckoutPage: React.FC = () => {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  )
  const [selectedAddress, setSelectedAddress] = useState<AddressDetail | null>(
    null
  )
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null)
  const [shippingCost, setShippingCost] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { navigateTo } = useRoutes()
  
  // Sử dụng CartContext thay vì state cục bộ
  const { selectedItems, getSelectedItems, getSelectedTotalAmount } = useCart()

  // Hardcoded payment methods
  const paymentMethods: any[] = [
    {
      method: PaymentMethod.COD,
      displayName: 'Thanh toán khi nhận hàng',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: codIcon,
    },
    {
      method: PaymentMethod.PAY_OS,
      displayName: 'Thanh toán qua ngân hàng',
      description: 'Thanh toán qua ngân hàng bằng QR hoặc chuyển khoản',
      icon: bankingIcon,
    },
    // {
    //   method: PaymentMethod.BANK_TRANSFER,
    //   displayName: 'Chuyển khoản ngân hàng',
    //   description: 'Chuyển khoản trực tiếp vào tài khoản ngân hàng',
    //   icon: '/icons/bank-transfer.png',
    // },
  ]

  useEffect(() => {
    if (selectedAddressId && selectedItems.length > 0) {
      loadAddressDetail()
      calculateShipping()
    }
  }, [selectedAddressId, selectedItems])

  const loadAddressDetail = async () => {
    if (!selectedAddressId) return

    try {
      setLoading(true)
      const address = await addressService.getAddressDetail(selectedAddressId)
      setSelectedAddress(address)
    } catch (error) {
      message.error('Không thể tải thông tin địa chỉ')
    } finally {
      setLoading(false)
    }
  }

  const calculateShipping = async () => {
    if (!selectedAddressId || selectedItems.length === 0) return

    try {
      setLoading(true)
      const cost = await checkoutService.calculateShipping({
        addressId: selectedAddressId,
        cartItemIds: selectedItems,
      })
      setShippingCost(cost.shippingCost)
      setLoading(false)
    } catch (error) {
      message.error('Không thể tính phí vận chuyển')
      setLoading(false)
    }
  }

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId)
  }

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
  }

  const calculateSubtotal = () => {
    return getSelectedTotalAmount()
  }

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCost
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      message.error('Vui lòng chọn địa chỉ giao hàng')
      return
    }

    if (!selectedPaymentMethod) {
      message.error('Vui lòng chọn phương thức thanh toán')
      return
    }

    if (selectedItems.length === 0) {
      message.error('Vui lòng chọn sản phẩm')
      return
    }

    try {
      setLoading(true)
      const request = {
        addressId: selectedAddressId,
        cartItemIds: selectedItems,
        returnUrl: `${window.location.origin}${ROUTES.PAYMENT_RESULT}`,
        cancelUrl: `${window.location.origin}${ROUTES.CHECKOUT}`,
      }

      if (selectedPaymentMethod === PaymentMethod.COD) {
        await checkoutService.placeOrderCOD(request)
        message.success('Đặt hàng thành công!')
        navigateTo(ROUTES.ORDERS)
      } else {
        const response = await checkoutService.placeOrderPayOS(request)
        navigateTo(ROUTES.PAYMENT, undefined, undefined, {
          state: {
            checkoutResponse: response.data,
            cartItems: getSelectedItems().filter((item) =>
              selectedItems.includes(item.productId)
            ),
            totalAmount: calculateTotal(),
            shippingCost,
            address: selectedAddress,
            paymentMethod: selectedPaymentMethod,
          },
        })
      }
    } catch (error) {
      message.error('Đặt hàng thất bại')
      setLoading(false)
    }
  }

  const renderCartItems = () => {
    const selectedCartItems = getSelectedItems()
    
    if (selectedCartItems.length === 0) {
      return (
        <Card title="Sản phẩm" className="shadow-sm rounded-lg">
          <Empty 
            description="Không có sản phẩm nào được chọn"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <div className="text-center mt-4">
            <Button type="primary" onClick={() => navigate(ROUTES.CART)}>
              Quay lại giỏ hàng
            </Button>
          </div>
        </Card>
      )
    }
    
    return (
      <Card 
        title={
          <div className="flex justify-between items-center">
            <Title level={5} className="m-0">
              <ShoppingCartOutlined className="mr-2" />
              Sản phẩm ({selectedCartItems.length})
            </Title>
          </div>
        }
        className="shadow-sm rounded-lg"
      >
        <List
          itemLayout="horizontal"
          dataSource={selectedCartItems}
          renderItem={(item) => (
            <List.Item>
              <div className="flex items-center w-full">
                <div className="flex-shrink-0 mr-4">
                  <Image 
                    src={item.mainImage} 
                    alt={item.name} 
                    width={80} 
                    height={80}
                    className="object-cover rounded"
                    preview={false}
                  />
                </div>
                
                <div className="flex-grow">
                  <Text strong className="text-base">{item.name}</Text>
                  <div className="flex items-center mt-1">
                    <Text type="secondary" className="text-sm">Số lượng: {item.quantity}</Text>
                    {item.discountPercent > 0 && (
                      <Tag color="red" className="ml-2">-{item.discountPercent}%</Tag>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <Text strong className="text-red-500">
                    {(item.discountPrice * item.quantity).toLocaleString('vi-VN')}₫
                  </Text>
                  {item.discountPercent > 0 && (
                    <div>
                      <Text type="secondary" className="line-through text-xs">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    )
  }

  const renderAddressSection = () => (
    <Card 
      title={
        <Title level={5} className="m-0">
          <EnvironmentOutlined className="mr-2" />
          Địa chỉ giao hàng
        </Title>
      }
      className="shadow-sm rounded-lg"
    >
      <CheckoutAddressSelector
        selectedAddressId={selectedAddressId}
        onSelect={handleAddressSelect}
      />
    </Card>
  )

  const renderPaymentSection = () => (
    <Card 
      title={
        <Title level={5} className="m-0">
          <CreditCardOutlined className="mr-2" />
          Phương thức thanh toán
        </Title>
      }
      className="shadow-sm rounded-lg"
    >
      <Radio.Group
        onChange={(e) => handlePaymentMethodSelect(e.target.value)}
        value={selectedPaymentMethod}
        className="w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <Radio.Button
              key={method.method}
              value={method.method}
              className="h-auto p-4 flex items-center"
            >
              <div className="flex items-center space-x-3">
                {method.icon && (
                  <img
                    src={method.icon}
                    alt={method.displayName}
                    className="w-8 h-8"
                  />
                )}
                <div>
                  <Text strong>{method.displayName}</Text>
                  {method.description && (
                    <Text type="secondary" className="block text-xs">
                      {method.description}
                    </Text>
                  )}
                </div>
              </div>
            </Radio.Button>
          ))}
        </div>
      </Radio.Group>
    </Card>
  )

  const renderOrderSummary = () => (
    <Card 
      title={
        <Title level={5} className="m-0">
          <InfoCircleOutlined className="mr-2" />
          Tóm tắt đơn hàng
        </Title>
      } 
      className="shadow-sm rounded-lg sticky top-4"
    >
      {selectedAddress && (
        <>
          <div className="mb-4">
            <Text strong className="text-gray-500">Giao đến:</Text>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <Text strong className="block">
                {`${selectedAddress.firstName} ${selectedAddress.lastName}`}
              </Text>
              <Text className="block mt-1">{selectedAddress.phoneNumber}</Text>
              <Text className="block mt-1 text-gray-500">
                {selectedAddress.addressLine}
              </Text>
              <Text className="block mt-1 text-gray-500">
                {/* Hiển thị thông tin địa chỉ theo cách thông miên hơn */}
                {`${selectedAddress.wardId || ''} ${selectedAddress.districtId ? ', ' + selectedAddress.districtId : ''} ${selectedAddress.provinceId ? ', ' + selectedAddress.provinceId : ''}`}
              </Text>
            </div>
          </div>
          <Divider />
        </>
      )}

      <div className="space-y-3">
        <div className="flex justify-between">
          <Text>Sản phẩm đã chọn:</Text>
          <Text>{selectedItems.length}</Text>
        </div>
        <div className="flex justify-between">
          <Text>Tạm tính:</Text>
          <Text>{calculateSubtotal().toLocaleString('vi-VN')}₫</Text>
        </div>
        <div className="flex justify-between">
          <Text>Phí vận chuyển:</Text>
          <Text>{shippingCost.toLocaleString('vi-VN')}₫</Text>
        </div>
        <Divider className="my-3" />
        <div className="flex justify-between">
          <Title level={4} className="m-0">
            Tổng cộng:
          </Title>
          <Title level={4} className="m-0 text-red-500">
            {calculateTotal().toLocaleString('vi-VN')}₫
          </Title>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        block
        className="mt-6"
        onClick={handlePlaceOrder}
        disabled={
          !selectedAddressId ||
          !selectedPaymentMethod ||
          selectedItems.length === 0
        }
        loading={loading}
      >
        Đặt hàng
      </Button>
      
      <Button
        block
        icon={<ArrowLeftOutlined />}
        className="mt-3"
        onClick={() => navigate(ROUTES.CART)}
      >
        Quay lại giỏ hàng
      </Button>
    </Card>
  )

  const renderCheckoutSteps = () => (
    <div className="mb-6">
      <Steps
        current={1}
        items={[
          {
            title: 'Giỏ hàng',
            description: 'Chọn sản phẩm',
            icon: <ShoppingCartOutlined />,
          },
          {
            title: 'Thanh toán',
            description: 'Xem lại và thanh toán',
            icon: <CreditCardOutlined />,
          },
          {
            title: 'Hoàn tất',
            description: 'Đặt hàng thành công',
            icon: <CheckCircleOutlined />,
          },
        ]}
      />
    </div>
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <Title level={2} className="mb-6">Thanh toán</Title>
      
      {renderCheckoutSteps()}
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {renderCartItems()}
          <div className="mt-6">{renderAddressSection()}</div>
          <div className="mt-6">{renderPaymentSection()}</div>
        </Col>
        <Col xs={24} lg={8}>
          {renderOrderSummary()}
        </Col>
      </Row>
    </div>
  )
}

export default CheckoutPage
