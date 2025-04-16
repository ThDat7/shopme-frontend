import React, { useState, useEffect } from 'react';
import { Avatar, List, Rate, Space, Typography, Pagination } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import reviewService from '../../services/reviewService';
import { ProductReviewResponse } from '../../types/reviewTypes';
import { formatRelativeTime } from '../../utils/dateUtils';

const { Title, Text } = Typography;

interface ProductReviewsProps {
  productId: number;
  averageRating?: number;
  reviewCount?: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ 
  productId, 
  averageRating = 0,
  reviewCount = 0
}) => {
  const [reviews, setReviews] = useState<ProductReviewResponse[]>([]);
  const [loading, setLoading] = useState(false);
  // Các state liên quan đến form đánh giá đã bị loại bỏ
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });
  
  // Load reviews on component mount and when pagination changes
  useEffect(() => {
    fetchReviews();
  }, [productId, pagination.current, pagination.pageSize]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getProductReviews(productId, {
        page: pagination.current - 1, // Backend uses 0-based pagination
        size: pagination.pageSize
      });
      
      setReviews(response.content);
      setPagination({
        ...pagination,
        total: response.totalElements
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Đã loại bỏ xử lý submit đánh giá - sẽ triển khai ở phiên bản sau

  // Hiển thị relative time
  const formatReviewTime = (dateString: string) => {
    return formatRelativeTime(new Date(dateString));
  };

  // Thống kê số lượng đánh giá theo số sao - giả định dựa trên dữ liệu có sẵn
  // Trong tương lai có thể cần API riêng để lấy số liệu thống kê chính xác
  const ratingStats = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(review => review.rating === stars).length;
    const percent = reviewCount > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, count, percent };
  });

  return (
    <div className="space-y-6">
      {/* Tổng quan đánh giá */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="text-center md:border-r md:pr-6 md:mr-6">
            <Title level={2} className="text-primary-500 m-0">{averageRating.toFixed(1)}</Title>
            <Rate disabled allowHalf value={averageRating} className="text-amber-400 text-sm" />
            <Text className="block text-gray-500 mt-1">{reviewCount} đánh giá</Text>
          </div>
          
          <div className="flex-1 w-full">
            {ratingStats.map(stat => (
              <div key={stat.stars} className="flex items-center mb-2">
                <div className="w-20 flex items-center">
                  <span className="mr-1">{stat.stars}</span>
                  <span className="text-amber-400">★</span>
                </div>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500" 
                    style={{ width: `${stat.percent}%` }}
                  ></div>
                </div>
                <div className="w-16 text-right text-gray-500">
                  {stat.count} ({stat.percent}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div className="bg-white rounded-lg border border-gray-100">
        <List
          loading={loading}
          header={<Title level={4} className="px-6 pt-4 pb-2 m-0">Tất cả đánh giá ({reviewCount})</Title>}
          itemLayout="horizontal"
          dataSource={reviews}
          locale={{ emptyText: <div className="py-8 text-center">Chưa có đánh giá nào cho sản phẩm này</div> }}
          renderItem={review => (
            <List.Item className="px-6 py-4">
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                  <Space direction="vertical" size={0}>
                    <Space>
                      <Text strong>{`${review.firstName} ${review.lastName}`}</Text>
                      <Rate disabled value={review.rating} className="text-amber-400 text-xs" />
                    </Space>
                    <Text strong className="text-gray-800">{review.headline}</Text>
                  </Space>
                }
                description={
                  <>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                    <span className="text-gray-500 text-sm">{formatReviewTime(review.reviewTime)}</span>
                  </>
                }
              />
            </List.Item>
          )}
        />
        <div className="py-4 flex justify-center">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={(page, pageSize) => {
              setPagination({
                ...pagination,
                current: page,
                pageSize: pageSize || pagination.pageSize
              });
            }}
            showSizeChanger
            pageSizeOptions={['5', '10', '20']}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
