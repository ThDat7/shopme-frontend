import { BaseOptionType } from 'antd/es/cascader'
import { CategorySelectResponse } from '../types/categoryTypes'

export const findCategoryPath = (
  id: number,
  categories: CategorySelectResponse[],
  path: number[] = []
): number[] | null => {
  for (const category of categories) {
    const newPath = [...path, category.id]
    if (category.id === id) return newPath

    if (category.children) {
      const foundPath = findCategoryPath(id, category.children, newPath)
      if (foundPath) return foundPath
    }
  }
  return null
}

export const renderCategoryOptions = (
  categories: CategorySelectResponse[]
): BaseOptionType[] => {
  return categories.map((category) => ({
    value: category.id,
    label: category.name,
    children: category.children
      ? renderCategoryOptions(category.children)
      : undefined,
  }))
}
