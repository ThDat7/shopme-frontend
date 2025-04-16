import React, { useState, useEffect } from 'react';
import { Breadcrumb, Typography } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { AppstoreOutlined, BarsOutlined, HomeOutlined } from '@ant-design/icons';

import productService from '../../services/productService';
import brandService from '../../services/brandService';
import categoryService from '../../services/categoryService';
import { useRoutes } from '../../hooks/useRoutes';
import ProductsFilterLayout from '../../components/product/ProductsFilterLayout';
import { useProductFilters } from '../../hooks/useProductFilters';
import { ProductListResponse } from '../../types/productTypes';
import { BrandResponse } from '../../types/brandTypes';
import { CategoryResponse } from '../../types/categoryTypes';
import { ROUTES } from '../../config/appConfig';

const { Title } = Typography;

// Note: We've moved the product type mapping to utils/productUtils.ts for reuse

const ProductListPage: React.FC = () => {
  const params = useParams();
  const { createRoute } = useRoutes();
  const categoryId = params.categoryId ? parseInt(params.categoryId) : undefined;
  const [categoryName, setCategoryName] = useState<string>(params.categoryName || '');
  
  // Sử dụng hook useProductFilters để quản lý filter
  const { filters, handlers, buildFilterParams } = useProductFilters({
    categoryIds: categoryId ? [categoryId] : []
  });

  // Các state còn lại
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Danh sách thương hiệu và danh mục
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = buildFilterParams();
        
        // Gọi API
        const response = await productService.listByPage(params);
        setProducts(response.content);
        setTotalItems(response.totalElements);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters]);
  
  // Fetch filters (brands and categories)
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
        
        // Fetch category detail if categoryId is available
        if (categoryId) {
          const categoryDetail = await categoryService.getCategoryById(categoryId);
          if (categoryDetail) {
            // Tu1ea1o biu1ebfn u0111u1ec3 lưu tu00ean category chi tiu1ebft
            setCategoryName(categoryDetail.name);
          }
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    
    fetchFilters();
  }, [categoryId]);
  
  // Đường dẫn (breadcrumb)
  const breadcrumbItems = [
    {
      title: <Link to={createRoute(ROUTES.HOME)}><HomeOutlined /> Trang chủ</Link>,
    },
    {
      title: <span>{categoryName || 'Tất cả sản phẩm'}</span>,
    },
  ];

  const ProductHeader = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center">
        <Title level={4} className="!mb-0">
          {categoryName || 'Tất cả sản phẩm'}
        </Title>
        
        <div className="flex items-center space-x-2">
          <button 
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}
            onClick={() => setViewMode('grid')}
          >
            <AppstoreOutlined />
          </button>
          <button 
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}
            onClick={() => setViewMode('list')}
          >
            <BarsOutlined />
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        
        <ProductsFilterLayout
          filters={filters}
          handlers={{
            handleFilterChange: handlers.handleFilterChange,
            clearAllFilters: handlers.clearAllFilters
          }}
          brands={brands}
          categories={categories}
          products={products}
          loading={loading}
          totalItems={totalItems}
          showMobileFilters={showFilters}
          setShowMobileFilters={setShowFilters}
          headerContent={<ProductHeader />}
        />
      </div>
  );
};

export default ProductListPage;
