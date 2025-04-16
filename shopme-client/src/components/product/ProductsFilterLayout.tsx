import React from 'react';
import { Row, Col } from 'antd';
import { ProductListResponse } from '../../types/productTypes';
import { BrandResponse } from '../../types/brandTypes';
import { CategoryResponse } from '../../types/categoryTypes';
import { ProductFilters } from '../../hooks/useProductFilters';
import { FilterParam } from '../../hooks/useProductFilters';
import FilterPanelContainer from './filters/FilterPanelContainer';
import FilterContainer from './filters/FilterContainer';
import ProductGrid from './ProductGrid';

interface ProductsFilterLayoutProps {
  // Common props
  filters: ProductFilters;
  handlers: {
    handleFilterChange: (param: FilterParam, value: any) => void;
    clearAllFilters: () => void;
  };
  brands: BrandResponse[];
  categories: CategoryResponse[];
  products: ProductListResponse[];
  loading: boolean;
  totalItems: number;
  
  // Custom props
  emptyText?: string;
  headerContent?: React.ReactNode; // Custom header content slot
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
}

const ProductsFilterLayout: React.FC<ProductsFilterLayoutProps> = ({
  filters,
  handlers,
  brands,
  categories,
  products,
  loading,
  totalItems,
  emptyText,
  headerContent,
  showMobileFilters,
  setShowMobileFilters
}) => {
  return (
    <Row gutter={24}>
      {/* Sidebar Filters - Desktop */}
      <Col xs={0} md={6} lg={5} className="hidden md:block">
        <FilterPanelContainer
          filters={filters}
          brands={brands}
          categories={categories}
          handlers={{
            handleFilterChange: handlers.handleFilterChange,
            clearAllFilters: handlers.clearAllFilters
          }}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
        />
      </Col>
      
      {/* Product Content */}
      <Col xs={24} md={18} lg={19}>
        {/* Optional header content */}
        {headerContent}
        
        {/* Filter container for active filters */}
        <FilterContainer 
          filters={filters}
          brands={brands}
          categories={categories}
          handlers={{
            handleFilterChange: handlers.handleFilterChange,
            clearAllFilters: handlers.clearAllFilters
          }}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
        />
        
        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          emptyText={emptyText}
          page={filters.page}
          pageSize={filters.size}
          totalItems={totalItems}
          onPageChange={(page) => handlers.handleFilterChange(FilterParam.PAGE, page)}
          onPageSizeChange={(size) => handlers.handleFilterChange(FilterParam.SIZE, size)}
          onClearFilters={handlers.clearAllFilters}
        />
      </Col>
    </Row>
  );
};

export default ProductsFilterLayout;
