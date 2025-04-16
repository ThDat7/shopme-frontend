import React, { useEffect, useState } from 'react'
import { Carousel, Typography, Space, Badge } from 'antd'
import { Link } from 'react-router-dom'
import {
  ThunderboltOutlined,
  TagOutlined,
  FireOutlined,
} from '@ant-design/icons'
import promotionService from '../../services/promotionService'
import { PromotionIdWithTypeResponse, getPromotionTypeInfo, PromotionType } from '../../types/promotion'
import { ROUTES } from '../../config/appConfig'
import { createRoute } from '../../hooks/useRoutes'

const { Text } = Typography

// Hàm helper để lấy biểu tượng dựa trên tên
const getPromotionIconByName = (iconName: string) => {
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
}

// Hàm định dạng thời gian đếm ngược
const formatCountdown = (timeRemaining: number): string => {
  if (timeRemaining <= 0) return '00:00:00';
  
  const hours = Math.floor(timeRemaining / 3600000);
  const minutes = Math.floor((timeRemaining % 3600000) / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const PromotionBanner: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionIdWithTypeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [flashSaleEndTime, setFlashSaleEndTime] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await promotionService.getCurrentPromotionTypesActive()
        setPromotions(data || [])
        
        // Tìm promotion loại Flash Sale
        const flashSalePromotion = data?.find(p => p.type === PromotionType.FLASH_SALE);
        if (flashSalePromotion) {
          const promotionDetail = await promotionService.getPromotionDetailById(flashSalePromotion.id);
          if (promotionDetail && promotionDetail.endDate) {
            const endTime = new Date(promotionDetail.endDate).getTime();
            setFlashSaleEndTime(endTime);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải khuyến mãi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  // Đếm ngược thời gian flash sale
  useEffect(() => {
    if (!flashSaleEndTime) return;
    
    const updateTimeRemaining = () => {
      const now = Date.now();
      setTimeRemaining(Math.max(0, flashSaleEndTime - now));
    };
    
    // Cập nhật lần đầu
    updateTimeRemaining();
    
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [flashSaleEndTime]);

  if (loading || promotions.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-800 text-white py-2">
      <Carousel
        autoplay
        dots={false}
        autoplaySpeed={5000}
        className="max-w-screen-xl mx-auto"
      >
        {promotions.map(promotion => {
          const promotionType = getPromotionTypeInfo(promotion.type);
          const isFlashSale = promotion.type === PromotionType.FLASH_SALE;
          
          return (
            <div key={promotion.id}>
              <Link
                to={createRoute(ROUTES.PROMOTION_DETAIL, { promotionSlug: promotionType.slug })}
                className="flex justify-center items-center hover:text-white"
              >
                <Space size="small" align="center">
                  <span
                    style={{
                      color: promotionType.color || '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {getPromotionIconByName(promotionType.icon || 'TagOutlined')}
                  </span>
                  <Text strong style={{ color: '#ffffff' }}>
                    {promotionType.name}
                  </Text>
                  {isFlashSale && timeRemaining > 0 && (
                    <Badge 
                      count={formatCountdown(timeRemaining)} 
                      style={{ backgroundColor: promotionType.color || '#ff4d4f' }}
                    />
                  )}
                  {!isFlashSale && promotionType.description && (
                    <Text style={{ color: '#cccccc' }}>{promotionType.description}</Text>
                  )}
                </Space>
              </Link>
            </div>
          );
        })}
      </Carousel>
    </div>
  )
}

export default PromotionBanner
