import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Radio,
  Button,
  message,
  Typography,
  List,
  Avatar,
  Checkbox,
  Row,
  Col,
  Divider,
  Space,
} from 'antd'
import { PaymentMethod, PaymentMethodResponse } from '../../types/payment'
import { usePayOS, PayOSConfig } from '@payos/payos-checkout'
import { ROUTES } from '../../config/appConfig'
import checkoutService from '../../services/checkoutService'
import cartService from '../../services/cartService'
import addressService from '../../services/addressService'
import CheckoutAddressSelector from '../../components/checkout/CheckoutAddressSelector'
import { CartItem } from '../../types/cart'
import { AddressDetail } from '../../types/address'
import {
  PlaceOrderCODRequest,
  PlaceOrderPayOSRequest,
} from '../../types/checkout'

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
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Hardcoded payment methods
  const paymentMethods: PaymentMethodResponse[] = [
    {
      method: PaymentMethod.COD,
      displayName: 'Thanh toán khi nhận hàng',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: '/icons/cod.png',
    },
    {
      method: PaymentMethod.PAY_OS,
      displayName: 'Thanh toán qua PayOS',
      description: 'Thanh toán qua ví điện tử hoặc chuyển khoản ngân hàng',
      icon: '/icons/payos.png',
    },
  ]

  // PayOS configuration
  const payOSConfig: PayOSConfig = {
    RETURN_URL: `${window.location.origin}${ROUTES.ORDER_COMPLETE}`,
    ELEMENT_ID: 'payos-checkout',
    CHECKOUT_URL: '', // Will be set after placing order
    embedded: true,
    onSuccess: (event: any) => {
      message.success('Payment successful')
      navigate(ROUTES.ORDER_COMPLETE)
    },
    onExit: () => {
      message.info('Payment cancelled')
    },
    onCancel: () => {
      message.warning('Payment cancelled')
    },
  }

  // const { open, exit } = usePayOS(payOSConfig)

  useEffect(() => {
    loadCartItems()
  }, [])

  useEffect(() => {
    if (selectedAddressId && selectedItems.length > 0) {
      loadAddressDetail()
      calculateShipping()
    }
  }, [selectedAddressId, selectedItems])

  const loadCartItems = async () => {
    try {
      setLoading(true)
      const items = await cartService.getCartItems()
      setCartItems(items)
      // Initially select all items
      setSelectedItems(items.map((item) => item.productId))
    } catch (error) {
      message.error('Failed to load cart items')
    } finally {
      setLoading(false)
    }
  }

  const loadAddressDetail = async () => {
    if (!selectedAddressId) return

    try {
      const address = await addressService.getAddressDetail(selectedAddressId)
      setSelectedAddress(address)
    } catch (error) {
      message.error('Failed to load address details')
    }
  }

  const calculateShipping = async () => {
    if (!selectedAddressId || selectedItems.length === 0) return

    try {
      const response = await checkoutService.calculateShipping({
        addressId: selectedAddressId,
        cartItemIds: selectedItems,
      })
      setShippingCost(response.shippingCost)
    } catch (error) {
      message.error('Failed to calculate shipping cost')
    }
  }

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId)
  }

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
  }

  const handleItemSelect = (productId: number, checked: boolean) => {
    setSelectedItems((prev) => {
      if (checked) {
        return [...prev, productId]
      }
      return prev.filter((id) => id !== productId)
    })
  }

  const handleSelectAllItems = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.productId))
    } else {
      setSelectedItems([])
    }
  }

  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.productId))
      .reduce((sum, item) => sum + item.quantity * item.discountPrice, 0)
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
        returnUrl: `${window.location.origin}${ROUTES.ORDER_COMPLETE}`,
        cancelUrl: `${window.location.origin}${ROUTES.CHECKOUT}`,
      }

      if (selectedPaymentMethod === PaymentMethod.COD) {
        await checkoutService.placeOrderCOD(request)
        navigate(ROUTES.ORDER_COMPLETE)
      } else {
        const response = await checkoutService.placeOrderPayOS(request)
        navigate('/payment', {
          state: {
            checkoutResponse: response.data,
            cartItems: cartItems.filter((item) =>
              selectedItems.includes(item.productId)
            ),
          },
        })
      }
    } catch (error) {
      message.error('Đặt hàng thất bại')
    } finally {
      setLoading(false)
    }
  }

  const renderCartItems = () => (
    <Card
      title={
        <div className='flex justify-between items-center'>
          <Title level={5} className='m-0'>
            Items
          </Title>
          <Checkbox
            checked={selectedItems.length === cartItems.length}
            indeterminate={
              selectedItems.length > 0 &&
              selectedItems.length < cartItems.length
            }
            onChange={(e) => handleSelectAllItems(e.target.checked)}
          >
            Select All
          </Checkbox>
        </div>
      }
    >
      <List
        itemLayout='horizontal'
        dataSource={cartItems}
        renderItem={(item) => (
          <List.Item>
            <div className='flex items-center w-full'>
              <Checkbox
                checked={selectedItems.includes(item.productId)}
                onChange={(e) =>
                  handleItemSelect(item.productId, e.target.checked)
                }
                className='mr-4'
              />
              <List.Item.Meta
                avatar={
                  <Avatar shape='square' size={64} src={item.mainImage} />
                }
                title={item.name}
                description={`Quantity: ${item.quantity}`}
              />
              <Space direction='vertical' align='end'>
                {item.discountPercent > 0 && (
                  <Text delete type='secondary'>
                    ${item.price.toFixed(2)}
                  </Text>
                )}
                <Text strong>${item.discountPrice.toFixed(2)}</Text>
                {item.discountPercent > 0 && (
                  <Text type='danger'>-{item.discountPercent}% OFF</Text>
                )}
              </Space>
            </div>
          </List.Item>
        )}
      />
    </Card>
  )

  const renderAddressSection = () => (
    <Card title='Shipping Address'>
      <CheckoutAddressSelector
        selectedAddressId={selectedAddressId}
        onSelect={handleAddressSelect}
      />
    </Card>
  )

  const renderPaymentSection = () => (
    <Card title='Phương thức thanh toán'>
      <Radio.Group
        onChange={(e) => handlePaymentMethodSelect(e.target.value)}
        value={selectedPaymentMethod}
        className='w-full'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {paymentMethods.map((method) => (
            <Radio.Button
              key={method.method}
              value={method.method}
              className='h-auto p-4 flex items-center'
            >
              <div className='flex items-center space-x-3'>
                {method.icon && (
                  <img
                    src={method.icon}
                    alt={method.displayName}
                    className='w-8 h-8'
                  />
                )}
                <div>
                  <Text strong>{method.displayName}</Text>
                  {method.description && (
                    <Text type='secondary' className='block'>
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
    <Card title='Order Summary' className='sticky top-4'>
      {selectedAddress && (
        <>
          <Title level={5}>Delivery To</Title>
          <Text
            strong
          >{`${selectedAddress.firstName} ${selectedAddress.lastName}`}</Text>
          <br />
          <Text>{selectedAddress.phoneNumber}</Text>
          <br />
          <Text>
            {selectedAddress.addressLine1}
            {selectedAddress.addressLine2 && (
              <>, {selectedAddress.addressLine2}</>
            )}
          </Text>
          <br />
          <Text>{`${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}`}</Text>
          <br />
          <Text>{selectedAddress.countryName}</Text>
          <Divider />
        </>
      )}

      <div className='space-y-2'>
        <div className='flex justify-between'>
          <Text>Selected Items:</Text>
          <Text>{selectedItems.length}</Text>
        </div>
        <div className='flex justify-between'>
          <Text>Subtotal:</Text>
          <Text>${calculateSubtotal().toFixed(2)}</Text>
        </div>
        <div className='flex justify-between'>
          <Text>Shipping:</Text>
          <Text>${shippingCost.toFixed(2)}</Text>
        </div>
        <Divider />
        <div className='flex justify-between'>
          <Title level={4} className='m-0'>
            Total:
          </Title>
          <Title level={4} className='m-0'>
            ${calculateTotal().toFixed(2)}
          </Title>
        </div>
      </div>

      <Button
        type='primary'
        size='large'
        block
        className='mt-4'
        onClick={handlePlaceOrder}
        disabled={
          !selectedAddressId ||
          !selectedPaymentMethod ||
          selectedItems.length === 0
        }
      >
        Place Order
      </Button>
    </Card>
  )

  return (
    <div className='container mx-auto py-8 px-4'>
      <Title level={2}>Checkout</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {renderCartItems()}
          <div className='mt-6'>{renderAddressSection()}</div>
          <div className='mt-6'>{renderPaymentSection()}</div>
        </Col>
        <Col xs={24} lg={8}>
          {renderOrderSummary()}
        </Col>
      </Row>
    </div>
  )
}

export default CheckoutPage
