import React, { useState } from 'react';
import { Button, Card, Rate, Space, Tag, Typography, message } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { ProductListResponse } from '../../types/productTypes';
import { useRoutes } from '../../hooks/useRoutes';
import { ROUTES } from '../../config/appConfig';
import { useCart } from '../../contexts/CartContext';

const { Text, Title } = Typography;

interface ProductListViewProps {
  products: ProductListResponse[];
}

const ProductListView: React.FC<ProductListViewProps> = ({ products }) => {
  const { navigateTo } = useRoutes();
  const { addToCart } = useCart();
  const [loadingProducts, setLoadingProducts] = useState<number[]>([]);
  
  // Extract handler for adding products to cart
  const handleAddToCart = async (product: ProductListResponse) => {
    try {
      setLoadingProducts(prev => [...prev, product.id]);
      await addToCart({
        productId: product.id,
        quantity: 1
      });
      message.success(`Đã thêm ${product.name} vào giỏ hàng`);
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      message.error('Không thể thêm sản phẩm vào giỏ hàng');
    } finally {
      setLoadingProducts(prev => prev.filter(id => id !== product.id));
    }
  };
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card 
          key={product.id} 
          hoverable 
          className="overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/4 mb-4 sm:mb-0">
              <div className="relative group">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                />
                {product.discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                    -{product.discountPercent}%
                  </div>
                )}
              </div>
            </div>
            <div className="w-full sm:w-3/4 sm:pl-6">
              <Title level={4} className="text-gray-800 hover:text-primary-500 transition-colors duration-200">
                {product.name}
              </Title>
              <div className="flex items-center mb-2">
                <Rate disabled defaultValue={product.averageRating} className="text-amber-400 text-sm" />
                <Text className="ml-2 text-gray-500">
                  ({product.reviewCount} đánh giá)
                </Text>
                <Text className="ml-4 text-gray-500">
                  Đã bán: {product.saleCount}
                </Text>
              </div>
              <Text className="text-gray-600 line-clamp-2">{product.description}</Text>
              <div className="mt-4 flex items-center">
                {product.discountPercent > 0 ? (
                  <>
                    <Text delete type="secondary" className="mr-2 text-gray-400">
                      {product.price.toLocaleString('vi-VN')}đ
                    </Text>
                    <Text strong className="text-lg text-red-500">
                      {product.discountPrice.toLocaleString('vi-VN')}đ
                    </Text>
                    <Tag color="red" className="ml-2 rounded-md">
                      Giảm {product.discountPercent}%
                    </Tag>
                  </>
                ) : (
                  <Text strong className="text-lg text-primary-500">
                    {product.price.toLocaleString('vi-VN')}đ
                  </Text>
                )}
              </div>
              <div className="mt-2">
                <Text type="secondary">
                  {product.inStock ? (
                    <span className="text-green-500 font-medium">Còn hàng</span>
                  ) : (
                    <span className="text-red-500 font-medium">Hết hàng</span>
                  )}
                  {product.inStock && ` (${product.stockQuantity})`}
                </Text>
              </div>
              <div className="mt-4">
                <Space>
                  <Button 
                    type="primary" 
                    icon={<ShoppingOutlined />}
                    className="bg-primary-500 hover:bg-primary-600 border-primary-500"
                    loading={loadingProducts.includes(product.id)}
                    disabled={!product.inStock || loadingProducts.includes(product.id)}
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button 
                    className="border-gray-300 hover:text-primary-500 hover:border-primary-500 transition-colors duration-200"
                    onClick={() => navigateTo(ROUTES.PRODUCT_DETAIL, { id: product.id.toString() })}
                  >
                    Xem chi tiết
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductListView;
