import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProductFilterType } from '../types/productTypes';

// Định nghĩa enum cho các loại filter param
export enum FilterParam {
  PAGE = 'page',
  SIZE = 'size',
  SORT = 'sort', // Được sử dụng để thể hiện cả sortField và sortDirection
  KEYWORD = 'keyword',
  PRICE_RANGE = 'priceRange',
  BRAND_IDS = 'brandIds',
  CATEGORY_IDS = 'categoryIds',
  FEATURES = 'features',
  MIN_RATING = 'minRating',
  IN_STOCK = 'inStock',
  PRODUCT_TYPE = 'productType'
}

// Định nghĩa kiểu dữ liệu cho các filter
export interface ProductFilters {
  page: number;
  size: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  keyword: string;
  priceRange: [number, number];
  brandIds: number[];
  categoryIds: number[];
  features: string[];
  minRating: number;
  inStock: boolean;
  productType: ProductFilterType;
}

// Lấy giá trị mặc định cho tất cả filter
export const defaultFilters: ProductFilters = {
  page: 0,
  size: 12,
  sortField: 'createdTime',
  sortDirection: 'desc',
  keyword: '',
  priceRange: [0, 20000000],
  brandIds: [],
  categoryIds: [],
  features: [],
  minRating: 0,
  inStock: false,
  productType: ProductFilterType.ALL
};

export const useProductFilters = (initialFilters: Partial<ProductFilters> = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Trích xuất các tham số từ URL
  const getInitialFiltersFromUrl = (): Partial<ProductFilters> => {
    const queryParams = new URLSearchParams(location.search);
    const filters: Partial<ProductFilters> = {};
    
    // Sử dụng enum FilterParam để xử lý tất cả các loại filter
    Object.values(FilterParam).forEach(param => {
      switch(param) {
        case FilterParam.PAGE:
        case FilterParam.SIZE:
        case FilterParam.MIN_RATING:
          if (queryParams.has(param)) 
            filters[param] = parseInt(queryParams.get(param) || '') || defaultFilters[param];
          break;
          
        case FilterParam.SORT:
          // Xử lý đặc biệt cho sort (vì liên quan đến 2 tham số: field và direction)
          if (queryParams.has('sortField')) 
            filters.sortField = queryParams.get('sortField') || 'createdTime';
          if (queryParams.has('sortDirection')) {
            const direction = queryParams.get('sortDirection');
            filters.sortDirection = (direction === 'asc' || direction === 'desc') ? direction : 'desc';
          }
          break;
          
        case FilterParam.KEYWORD:
          if (queryParams.has(param)) 
            filters[param] = queryParams.get(param) || '';
          break;
          
        case FilterParam.PRICE_RANGE:
          // Xử lý đặc biệt cho priceRange vì sử dụng 2 tham số: minPrice & maxPrice
          if (queryParams.has('minPrice')) 
            filters.priceRange = [parseInt(queryParams.get('minPrice') || '') || defaultFilters.priceRange[0],
                                 parseInt(queryParams.get('maxPrice') || '') || defaultFilters.priceRange[1]];
          break;
          
        case FilterParam.CATEGORY_IDS:
        case FilterParam.BRAND_IDS:
          if (queryParams.has(param)) {
            const ids = queryParams.get(param)?.split(',').map(id => parseInt(id));
            if (ids && ids.length > 0) filters[param] = ids;
          }
          break;
          
        case FilterParam.FEATURES:
          if (queryParams.has(param)) {
            const features = queryParams.get(param)?.split(',');
            if (features && features.length > 0) filters[param] = features;
          }
          break;
          
        case FilterParam.IN_STOCK:
          if (queryParams.has(param)) 
            filters[param] = queryParams.get(param) === 'true';
          break;
          
        case FilterParam.PRODUCT_TYPE:
          if (queryParams.has(param)) 
            filters[param] = queryParams.get(param) as ProductFilterType || ProductFilterType.ALL;
          break;
      }
    });
    
    return filters;
  };
  
  // Kết hợp các filter từ URL và filter mặc định
  const urlFilters = getInitialFiltersFromUrl();
  const combinedInitialFilters = { ...defaultFilters, ...initialFilters, ...urlFilters };
  
  // Tạo state cho tất cả các filter
  const [filters, setFilters] = useState<ProductFilters>(combinedInitialFilters);
  
  // Cập nhật URL khi filter thay đổi
  const updateUrlWithFilters = () => {
    const queryParams = new URLSearchParams();
    
    Object.values(FilterParam).forEach(param => {
      switch(param) {          
        case FilterParam.SORT:
          if (filters.sortField !== defaultFilters.sortField)
            queryParams.set('sortField', filters.sortField);
          if (filters.sortDirection !== defaultFilters.sortDirection)
            queryParams.set('sortDirection', filters.sortDirection);
          break;
          
        case FilterParam.PRICE_RANGE:
          if (filters.priceRange[0] > defaultFilters.priceRange[0])
            queryParams.set('minPrice', filters.priceRange[0].toString());
          if (filters.priceRange[1] < defaultFilters.priceRange[1])
            queryParams.set('maxPrice', filters.priceRange[1].toString());
          break;
          
        case FilterParam.BRAND_IDS:
        case FilterParam.CATEGORY_IDS:
        case FilterParam.FEATURES:
          const arrayValue = filters[param] as any[];
          if (arrayValue.length > 0) {
            const paramName = param === FilterParam.FEATURES ? 'features' : 
                             (param === FilterParam.BRAND_IDS ? 'brandIds' : 'categoryIds');
            queryParams.set(paramName, arrayValue.join(','));
          }
          break;

        default:
            if (filters[param] &&filters[param] !== defaultFilters[param])
              queryParams.set(param, filters[param].toString());
            break;
      }
    });
    
    // Cập nhật URL nhưng không reload trang
    const newSearch = queryParams.toString();
    navigate({
      pathname: location.pathname,
      search: newSearch ? `?${newSearch}` : ''
    }, { replace: true });
  };
  
  // Cập nhật URL khi filter thay đổi (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrlWithFilters();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters]);
  
  // Cập nhật filters khi URL thay đổi từ bên ngoài (như từ Header)
  useEffect(() => {
    const urlFilters = getInitialFiltersFromUrl();
    if (Object.keys(urlFilters).length > 0) {
      // Chỉ cập nhật khi URL có params
      setFilters(prev => ({
        ...prev,
        ...urlFilters,
        // Reset về trang 0 để tránh lỗi khi filter thay đổi
        page: 0
      }));
    }
  }, [location.search]);
  
  // Xu1eed lu00fd khi sort filter thay u0111u1ed5i (tru01b0u1eddng rieng cho sort)
  const handleSortFilterChange = (sortValue: string) => {
    const [field, direction] = sortValue.split(',');
    
    // Cu1eadp nhu1eadt cu1ea3 sortField vu00e0 sortDirection
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortDirection: direction as 'asc' | 'desc',
      page: 0
    }));
  };

  // Handler chung cho tất cả các loại filter
  const handleFilterChange = (param: FilterParam, value: any) => {
    switch (param) {
      case FilterParam.PAGE:
        // Chuyển từ 1-based (UI) sang 0-based (API)
        const pageIndex = typeof value === 'number' && value > 0 ? value - 1 : 0;
        setFilters(prev => ({ ...prev, page: pageIndex }));
        break;
        
      case FilterParam.SORT:
        handleSortFilterChange(value);
        break;
        
      case FilterParam.PRICE_RANGE:
        // Giữ nguyên price range (array [min, max])
        if (Array.isArray(value) && value.length === 2) {
          setFilters(prev => ({ ...prev, priceRange: value as [number, number], page: 0 }));
        }
        break;
        
      default:
        // Sử dụng key của enum để cập nhật filter tương ứng
        const key = param as keyof ProductFilters;
        setFilters(prev => ({ ...prev, [key]: value, page: 0 }));
    }
  };
  
  const clearAllFilters = () => {
    setFilters({
      ...defaultFilters,
      page: 0,
      size: filters.size
    });
  };
  
  // Tạo object params từ filters (cho API calls)
  const buildFilterParams = () => {
    const params: Record<string, any> = {
      page: filters.page,
      size: filters.size,
      sortField: filters.sortField,
      sortDirection: filters.sortDirection,
    };
    
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.brandIds.length > 0) params.brandIds = filters.brandIds;
    if (filters.categoryIds.length > 0) params.categoryIds = filters.categoryIds;
    if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0];
    if (filters.priceRange[1] < 20000000) params.maxPrice = filters.priceRange[1];
    if (filters.minRating > 0) params.minRating = filters.minRating;
    if (filters.inStock) params.inStock = true;
    if (filters.productType !== ProductFilterType.ALL) params.filterType = filters.productType;
    
    return params;
  };
  
  return {
    filters,
    setFilters,
    handleFilterChange, 
    handlers: {
      handleFilterChange, 
      clearAllFilters 
    },
    buildFilterParams
  };
};
