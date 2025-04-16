import React from 'react';
import { Row, Col, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { ProductFilters, FilterParam } from '../../../hooks/useProductFilters';
import { BrandResponse } from '../../../types/brandTypes';
import { CategoryResponse } from '../../../types/categoryTypes';
import ActiveFilterTags from './ActiveFilterTags';
import SortSelector from './SortSelector';
import { ProductFilterType } from '../../../types/productTypes';

interface FilterContainerProps {
  filters: ProductFilters;
  brands: BrandResponse[];
  categories: CategoryResponse[];
  handlers: {
    handleFilterChange: (param: FilterParam, value: any) => void;
    clearAllFilters: () => void;
  };
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
}

const FilterContainer: React.FC<FilterContainerProps> = ({
  filters,
  brands,
  categories,
  handlers,
  // showMobileFilters,
  setShowMobileFilters
}) => {
  // Filter có đang được áp dụng?
  const hasActiveFilters = filters.keyword || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 20000000 || 
    filters.brandIds.length > 0 || 
    filters.categoryIds.length > 0 || 
    filters.minRating > 0 || 
    filters.inStock || 
    filters.productType !== ProductFilterType.ALL;
  
  return (
    <>
      {/* Toolbar và Active Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <ActiveFilterTags
              filters={filters}
              brands={brands}
              categories={categories}
              handlers={handlers}
            />
          </Col>
          <Col xs={24} md={8} className="flex justify-end">
            <div className="flex items-center">
              <div className="mr-4">
                <span className="mr-2">Sắp xếp:</span>
                <SortSelector
                  value={`${filters.sortField},${filters.sortDirection}`}
                  onChange={value => handlers.handleFilterChange(FilterParam.SORT, value)}
                />
              </div>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden"
              >
                Bộ lọc
              </Button>
              {hasActiveFilters && (
                <Button
                  size="small"
                  onClick={handlers.clearAllFilters}
                  icon={<ReloadOutlined />}
                  className="ml-2 hidden md:inline-flex"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FilterContainer;
