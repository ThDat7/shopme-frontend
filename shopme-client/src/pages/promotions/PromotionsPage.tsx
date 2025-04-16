import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Breadcrumb, 
  Tabs, 
  Skeleton
} from 'antd';
import { HomeOutlined, CalendarOutlined, FireOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { 
  PromotionType, 
  PromotionIdWithTypeResponse,
  PromotionDetailResponse,
  getPromotionTypeInfo,
  getPromotionTypeBySlug
} from '../../types/promotion';

import { BrandResponse } from '../../types/brandTypes';
import { CategoryResponse } from '../../types/categoryTypes';
import promotionService from '../../services/promotionService';
import brandService from '../../services/brandService';
import categoryService from '../../services/categoryService';
import ProductsFilterLayout from '../../components/product/ProductsFilterLayout';
import { useProductFilters } from '../../hooks/useProductFilters';
import { ProductListResponse } from '../../types/productTypes';
import { ROUTES } from '../../config/appConfig';
import { createRoute } from '../../hooks/useRoutes';

const { Title, Text } = Typography;

// Component đơn giản hiển thị thời gian đếm ngược (không dùng state/effect phức tạp)
const PromotionCountdown = ({ type, endDate }: { type: PromotionType; endDate?: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!endDate) return;
    
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Tính toán ban đầu
    setTimeLeft(calculateTimeLeft());

    // Cập nhật mỗi giây
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);
  
  // Nếu chưa có ngày kết thúc, không hiển thị
  if (!endDate) return null;
  
  // Hiển thị khác nhau tùy loại promotion
  if (type === PromotionType.FLASH_SALE) {
    return (
      <div className="flex flex-col items-center justify-center mt-4">
        <Text strong className="text-white mb-2">
          Kết thúc sau:
        </Text>
        <div className="flex items-center space-x-2">
          <div className="bg-white text-red-500 rounded-md px-3 py-2 text-center min-w-[60px]">
            <div className="text-xl font-bold">{timeLeft.days}</div>
            <div className="text-xs">Ngày</div>
          </div>
          <div className="bg-white text-red-500 rounded-md px-3 py-2 text-center min-w-[60px]">
            <div className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs">Giờ</div>
          </div>
          <div className="bg-white text-red-500 rounded-md px-3 py-2 text-center min-w-[60px]">
            <div className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs">Phút</div>
          </div>
          <div className="bg-white text-red-500 rounded-md px-3 py-2 text-center min-w-[60px]">
            <div className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs">Giây</div>
          </div>
        </div>
      </div>
    );
  }
  
  if (type === PromotionType.CATEGORY_DISCOUNT) {
    return (
      <div className="flex items-center justify-center mt-4">
        <CalendarOutlined className="text-white mr-2" />
        <Text strong className="text-white">
          Kết thúc: {new Date(endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </Text>
      </div>
    );
  }
  
  if (type === PromotionType.NEW_ARRIVAL) {
    // Tính số ngày đã trôi qua từ khi ra mắt
    const daysSinceLaunch = Math.floor((new Date().getTime() - new Date(endDate).getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <div className="flex items-center justify-center mt-4">
        <FireOutlined className="text-white mr-2" />
        <Text strong className="text-white">
          Sản phẩm mới ra mắt {daysSinceLaunch} ngày trước
        </Text>
      </div>
    );
  }
  
  return null;
};

const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { promotionSlug } = useParams<{ promotionSlug?: string }>();
  
  // Sử dụng hàm helper có sẵn từ types/promotion.ts để chuyển đổi slug sang type
  const promotionType = getPromotionTypeBySlug(promotionSlug || '') || PromotionType.FLASH_SALE;
  
  // Các state cho trang khuyến mãi
  const [promotions, setPromotions] = useState<PromotionIdWithTypeResponse[]>([]);
  const [promotionDetail, setPromotionDetail] = useState<PromotionDetailResponse | null>(null);
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // State cho brands và categories
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  
  // Sử dụng hook useProductFilters một cách cẩn thận
  const { filters, handlers, buildFilterParams } = useProductFilters();
  
  // Lấy danh sách khuyến mãi đang hoạt động - chạy một lần
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await promotionService.getCurrentPromotionTypesActive();
        setPromotions(data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };
    
    fetchPromotions();
  }, []);
  
  // Fetch thông tin chi tiết về promotion khi promotionType hoặc promotions thay đổi
  useEffect(() => {
    const fetchPromotionDetail = async () => {
      const promotionId = getCurrentPromotionId();
      if (!promotionId) return;
      
      setDetailLoading(true);
      try {
        const detail = await promotionService.getPromotionDetailById(promotionId);
        setPromotionDetail(detail);
      } catch (error) {
        console.error('Error fetching promotion detail:', error);
      } finally {
        setDetailLoading(false);
      }
    };
    
    fetchPromotionDetail();
  }, [promotionType, promotions]);
  
  // QUAN TRỌNG: Xử lý thay đổi tab - dùng useEffect riêng cho promotionType
  useEffect(() => {
    // Reset bộ lọc khi chuyển tab
    // Disable tạm thởi việc tự động clear filter khi thay đổi tab 
    // handlers.clearAllFilters();
  }, [promotionType]); // Chỉ phụ thuộc vào promotionType
  
  // Fetch promotions khi có promotionType hoặc filters thay đổi
  useEffect(() => {
    // Hàm fetch sản phẩm
    const fetchPromotionProducts = async () => {
      const promotionId = getCurrentPromotionId();
      
      if (!promotionId) {
        setProducts([]);
        setTotalItems(0);
        return;
      }
      
      setProductLoading(true);
      try {
        const params = buildFilterParams();
        
        // Gọi API lấy sản phẩm trong khuyến mãi
        const response = await promotionService.getPromotionProducts(promotionId, params);
        if (response && typeof response === 'object' && 'content' in response) {
          setProducts(response.content as ProductListResponse[]);
          setTotalItems((response as any).totalElements || 0);
        }
      } catch (error) {
        console.error('Error fetching promotion products:', error);
        setProducts([]);
        setTotalItems(0);
      } finally {
        setProductLoading(false);
      }
    };
    
    fetchPromotionProducts();
  }, [promotionType, filters, promotions]); // Thêm promotions để kích hoạt fetch khi có promotions mới
  
  // Fetch filters (brands and categories) - chạy một lần
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Fetch brands
        const brandsData = await brandService.getBrands({});
        if (brandsData && Array.isArray(brandsData.content)) {
          setBrands(brandsData.content);
        }
        
        // Fetch categories
        const categoriesData = await categoryService.getRootCategories({});
        if (categoriesData && categoriesData.content) {
          setCategories(categoriesData.content);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    
    fetchFilters();
  }, []);
  
  // Hàm lấy ID khuyến mãi hiện tại
  const getCurrentPromotionId = (): number | undefined => {
    const currentPromotion = promotions.find(promo => promo.type === promotionType);
    return currentPromotion?.id;
  };
  
  // Hàm xử lý khi thay đổi tab
  const handleTabChange = (key: string) => {
    // Lấy thông tin loại khuyến mãi từ key (PromotionType)
    const typeInfo = getPromotionTypeInfo(key as PromotionType);
    navigate(createRoute(ROUTES.PROMOTION_DETAIL, { promotionSlug: typeInfo.slug }));
  };
  
  // Banner khuyến mãi với gradient màu và thông tin chi tiết
  const renderPromotionBanner = () => {
    const currentType = promotionType;
    const info = getPromotionTypeInfo(currentType);
    
    return (
      <div 
        className="p-8 rounded-lg mb-6 text-center relative overflow-hidden"
        style={{ 
          background: info.gradient,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Hiệu ứng overlay nếu cần */}
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
        
        <div className="relative z-10">
        {detailLoading ? (
            <Skeleton.Input active style={{ width: 300, height: 16 }} />
          ) : (
            <>
            {/* Tiêu đề khuyến mãi */}
            <h2 className="text-3xl font-bold text-white mb-2">{promotionDetail?.title || info.name}</h2>
            
            {/* Hiển thị content từ API hoặc mô tả mặc định */}
              <p className="text-white text-lg mb-4">
                {promotionDetail?.content || info.description}
              </p>
            </>
          )}
          
          {/* Hiển thị countdown tùy theo loại khuyến mãi */}
          <PromotionCountdown 
            type={currentType} 
            endDate={promotionDetail?.endDate} 
          />
        </div>
      </div>
    );
  };
  
  // Tạo mảng tabs cho Ant Design Tabs
  const items = Object.values(PromotionType).map(type => {
    const info = getPromotionTypeInfo(type);
    return {
      key: type,
      label: info.name,
      children: null,
    };
  });
  
  // Breadcrumb
  const breadcrumbItems = [
    {
      title: <a href="/"><HomeOutlined /> Trang chủ</a>,
    },
    {
      title: <span>Khuyến mãi</span>,
    },
    {
      title: <span>{getPromotionTypeInfo(promotionType).name}</span>,
    },
  ];


  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      
      {/* Tiêu đề */}
      <div className="mb-6">
        <Title level={2} className="text-primary-600 mb-2">Khuyến mãi</Title>
        <p className="text-gray-500">
          Khám phá các ưu đãi hấp dẫn với giá cực kỳ tốt
        </p>
      </div>
      
      {/* Tabs khuyến mãi */}
      <Tabs 
        activeKey={promotionType} 
        onChange={handleTabChange}
        items={items}
        className="promotion-tabs"
        tabBarGutter={24}
      />
      
      {/* Banner và countdown với gradient */}
      {renderPromotionBanner()}
      
      {/* Nội dung phần sản phẩm */}
      <ProductsFilterLayout
        filters={filters}
        handlers={{
          handleFilterChange: handlers.handleFilterChange,
          clearAllFilters: handlers.clearAllFilters
        }}
        brands={brands}
        categories={categories}
        products={products}
        loading={productLoading}
        totalItems={totalItems}
        showMobileFilters={showFilters}
        setShowMobileFilters={setShowFilters}
        emptyText={`Không tìm thấy sản phẩm trong khuyến mãi ${getPromotionTypeInfo(promotionType).name}`}
      />
    </div>
  );
};

export default PromotionsPage;
