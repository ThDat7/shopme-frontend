import { PaginationParams } from "./commonTypes";

interface Category {
  id: number
  name: string
}

export interface CategoryResponse extends Category {
  image: string
  productCount?: number
  parentId?: number
  hasChildren?: boolean
}

export interface CategoryBreadcrumbResponse extends Category {
  alias?: string;
}

export interface CategoryListParams extends PaginationParams {
  keyword?: string
  parentId?: number
}
