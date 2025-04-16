import React from 'react';
import { Drawer, Button } from 'antd';
import FilterPanel from './FilterPanel';
import { ProductFilters, FilterParam } from '../../../hooks/useProductFilters';
import { BrandResponse } from '../../../types/brandTypes';
import { CategoryResponse } from '../../../types/categoryTypes';
import { ProductFilterType } from '../../../types/productTypes';

interface FilterPanelContainerProps {
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

const FilterPanelContainer: React.FC<FilterPanelContainerProps> = ({
  filters,
  brands,
  categories,
  handlers,
  showMobileFilters,
  setShowMobileFilters
}) => {
  return (
    <>
      {/* Desktop Filter Panel */}
      <div className="hidden md:block">
        <FilterPanel
          priceRange={filters.priceRange}
          selectedBrandIds={filters.brandIds}
          setSelectedBrandIds={(brandIds) => handlers.handleFilterChange(FilterParam.BRAND_IDS, brandIds)}
          selectedCategoryIds={filters.categoryIds}
          setSelectedCategoryIds={(categoryIds) => handlers.handleFilterChange(FilterParam.CATEGORY_IDS, categoryIds)}
          selectedFeatures={filters.features}
          setSelectedFeatures={(features) => handlers.handleFilterChange(FilterParam.FEATURES, features)}
          minRating={filters.minRating}
          setMinRating={(rating: number) => handlers.handleFilterChange(FilterParam.MIN_RATING, rating)}
          inStockOnly={filters.inStock}
          setInStockOnly={(checked: boolean) => handlers.handleFilterChange(FilterParam.IN_STOCK, checked)}
          handlePriceRangeChange={(range: [number, number]) => handlers.handleFilterChange(FilterParam.PRICE_RANGE, range)}
          productType={filters.productType}
          setProductType={(type: ProductFilterType) => handlers.handleFilterChange(FilterParam.PRODUCT_TYPE, type)}
          brands={brands}
          categories={categories}
        />
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Bộ lọc sản phẩm"
        placement="left"
        closable={true}
        onClose={() => setShowMobileFilters(false)}
        open={showMobileFilters}
        width={300}
        className="md:hidden"
        footer={
          <div className="flex justify-end">
            <Button 
              type="primary" 
              onClick={() => setShowMobileFilters(false)}
            >
              Áp dụng
            </Button>
          </div>
        }
      >
        <FilterPanel
          priceRange={filters.priceRange}
          selectedBrandIds={filters.brandIds}
          setSelectedBrandIds={(brandIds) => handlers.handleFilterChange(FilterParam.BRAND_IDS, brandIds)}
          selectedCategoryIds={filters.categoryIds}
          setSelectedCategoryIds={(categoryIds) => handlers.handleFilterChange(FilterParam.CATEGORY_IDS, categoryIds)}
          selectedFeatures={filters.features}
          setSelectedFeatures={(features) => handlers.handleFilterChange(FilterParam.FEATURES, features)}
          minRating={filters.minRating}
          setMinRating={(rating: number) => handlers.handleFilterChange(FilterParam.MIN_RATING, rating)}
          inStockOnly={filters.inStock}
          setInStockOnly={(checked: boolean) => handlers.handleFilterChange(FilterParam.IN_STOCK, checked)}
          handlePriceRangeChange={(range: [number, number]) => handlers.handleFilterChange(FilterParam.PRICE_RANGE, range)}
          productType={filters.productType}
          setProductType={(type: ProductFilterType) => handlers.handleFilterChange(FilterParam.PRODUCT_TYPE, type)}
          brands={brands}
          categories={categories}
        />
      </Drawer>
    </>
  );
};

export default FilterPanelContainer;
