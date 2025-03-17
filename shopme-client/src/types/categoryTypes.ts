interface Category {
  id: number
  name: string
}

export interface CategoryResponse extends Category {
  image: string
}

export interface CategoryBreadcrumbResponse extends Category {}

export interface ListCategoryResponse {
  categories: CategoryResponse[]
  breadcrumbs: CategoryBreadcrumbResponse[]
}
