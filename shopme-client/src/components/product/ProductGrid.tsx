import React from 'react';
import { Row, Col, Empty, Spin, Pagination, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { ProductListResponse } from '../../types/productTypes';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: ProductListResponse[];
  loading: boolean;
  emptyText?: string;
  // Pagination props
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (page: number, size: number) => void;
  // Optional clear filters callback
  onClearFilters?: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  emptyText = 'Không tìm thấy sản phẩm',
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onClearFilters
}) => {
  if (loading) {
    return (
      <div className="py-12 text-center">
        <Spin size="large" />
        <div className="mt-4">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Empty 
        description={emptyText} 
        className="py-12"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        {onClearFilters && (
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={onClearFilters}
          >
            Xóa bộ lọc
          </Button>
        )}
      </Empty>
    );
  }

  return (
    <div>
      <Row gutter={[24, 24]}>
        {products.map(product => (
          <Col xs={12} sm={12} md={8} lg={6} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      
      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex justify-center mt-8 mb-4">
          <Pagination
            current={page + 1} // Convert from 0-based to 1-based for display
            pageSize={pageSize}
            total={totalItems}
            onChange={onPageChange}
            onShowSizeChange={onPageSizeChange}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['12', '24', '36', '48']}
            locale={{ items_per_page: '/ trang' }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
