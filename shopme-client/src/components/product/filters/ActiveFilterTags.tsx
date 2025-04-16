import React from 'react';
import { Button, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { ProductFilters, FilterParam } from '../../../hooks/useProductFilters';
import { BrandResponse } from '../../../types/brandTypes';
import { CategoryResponse } from '../../../types/categoryTypes';
import { ProductFilterType } from '../../../types/productTypes';

interface ActiveFilterTagsProps {
  filters: ProductFilters;
  brands: BrandResponse[];
  categories: CategoryResponse[];
  handlers: {
    handleFilterChange: (param: FilterParam, value: any) => void;
    clearAllFilters: () => void;
  };
}

const ActiveFilterTags: React.FC<ActiveFilterTagsProps> = ({
  filters,
  brands,
  categories,
  handlers
}) => {
  // Helper để lấy tên thương hiệu từ ID
  const getBrandName = (id: number): string => {
    const brand = brands.find(b => b.id === id);
    return brand ? brand.name : `Brand ${id}`;
  };

  // Helper để lấy tên danh mục từ ID
  const getCategoryName = (id: number): string => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : `Category ${id}`;
  };

  // Filter type names
  const getFilterTypeName = (type: ProductFilterType): string => {
    switch (type) {
      case ProductFilterType.BEST_SELLER:
        return 'Bán chạy';
      case ProductFilterType.TRENDING:
        return 'Xu hướng';
      case ProductFilterType.HIGH_RATED:
        return 'Đánh giá cao';
      case ProductFilterType.DISCOUNTED:
        return 'Giảm giá';
      default:
        return '';
    }
  };

  const hasActiveFilters = filters.keyword || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 20000000 || 
    filters.brandIds.length > 0 || 
    filters.categoryIds.length > 0 || 
    filters.minRating > 0 || 
    filters.inStock || 
    filters.productType !== ProductFilterType.ALL;

  return (
    <div className="filter-tags flex flex-wrap gap-2">
      {/* Từ khóa */}
      {filters.keyword && (
        <Tag closable onClose={() => handlers.handleFilterChange(FilterParam.KEYWORD, '')}>
          Từ khóa: {filters.keyword}
        </Tag>
      )}
      
      {/* Khoảng giá */}
      {(filters.priceRange[0] > 0 || filters.priceRange[1] < 20000000) && (
        <Tag closable onClose={() => handlers.handleFilterChange(FilterParam.PRICE_RANGE, [0, 20000000])}>
          Giá: {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} VND
        </Tag>
      )}
      
      {/* Thương hiệu */}
      {filters.brandIds.map(id => (
        <Tag 
          key={`brand-${id}`} 
          closable 
          onClose={() => handlers.handleFilterChange(FilterParam.BRAND_IDS, filters.brandIds.filter(b => b !== id))}
        >
          {getBrandName(id)}
        </Tag>
      ))}
      
      {/* Danh mục */}
      {filters.categoryIds.map(id => (
        <Tag 
          key={`category-${id}`} 
          closable 
          onClose={() => handlers.handleFilterChange(FilterParam.CATEGORY_IDS, filters.categoryIds.filter(c => c !== id))}
        >
          {getCategoryName(id)}
        </Tag>
      ))}
      
      {/* Đánh giá */}
      {filters.minRating > 0 && (
        <Tag closable onClose={() => handlers.handleFilterChange(FilterParam.MIN_RATING, 0)}>
          Đánh giá: ≥{filters.minRating}⭐
        </Tag>
      )}
      
      {/* Còn hàng */}
      {filters.inStock && (
        <Tag closable onClose={() => handlers.handleFilterChange(FilterParam.IN_STOCK, false)}>
          Còn hàng
        </Tag>
      )}
      
      {/* Loại sản phẩm */}
      {filters.productType !== ProductFilterType.ALL && (
        <Tag closable onClose={() => handlers.handleFilterChange(FilterParam.PRODUCT_TYPE, ProductFilterType.ALL)}>
          {getFilterTypeName(filters.productType)}
        </Tag>
      )}
      
      {/* Xóa tất cả */}
      {hasActiveFilters && (
        <Button 
          size="small"
          onClick={handlers.clearAllFilters}
          icon={<CloseOutlined />}
        >
          Xóa tất cả
        </Button>
      )}
    </div>
  );
};

export default ActiveFilterTags;
