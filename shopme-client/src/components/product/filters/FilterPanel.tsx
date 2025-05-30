import React, { useEffect, useState } from 'react'
import {
  Slider,
  Checkbox,
  Radio,
  Divider,
  Typography,
  Avatar,
  List,
  Tree,
  Button,
} from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { BrandResponse } from '../../../types/brandTypes'
import { CategoryResponse } from '../../../types/categoryTypes'
import {
  ProductFilterType,
  PRODUCT_TYPE_LABELS,
} from '../../../types/productTypes'
import categoryService from '../../../services/categoryService'

const { Title } = Typography

interface FilterPanelProps {
  priceRange: [number, number]
  selectedBrandIds: number[]
  setSelectedBrandIds: (brandIds: number[]) => void
  selectedCategoryIds: number[]
  setSelectedCategoryIds: (categoryIds: number[]) => void
  selectedFeatures: string[]
  setSelectedFeatures: (features: string[]) => void
  minRating: number
  setMinRating: (rating: number) => void
  inStockOnly: boolean
  setInStockOnly: (inStock: boolean) => void
  handlePriceRangeChange: (values: [number, number]) => void
  productType: ProductFilterType
  setProductType: (type: ProductFilterType) => void
  brands: BrandResponse[]
  categories: CategoryResponse[]
}

// Interface cho cấu trúc dữ liệu Tree của Ant Design
interface TreeNode {
  title: React.ReactNode
  key: string
  children?: TreeNode[]
  isLeaf?: boolean
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceRange,
  selectedBrandIds,
  setSelectedBrandIds,
  selectedCategoryIds,
  setSelectedCategoryIds,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  handlePriceRangeChange,
  productType,
  setProductType,
  brands,
  categories,
}) => {
  // State để lưu trữ cây danh mục
  const [categoryTree, setCategoryTree] = useState<TreeNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [loadedKeys, setLoadedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [showAllBrands, setShowAllBrands] = useState(false)

  // Hàm cập nhật cây danh mục (đã di chuyển ra ngoài để tái sử dụng)
  const updateTreeData = (
    list: TreeNode[],
    id: string,
    children: TreeNode[]
  ): TreeNode[] => {
    return list.map((node) => {
      if (node.key === id) {
        return {
          ...node,
          children,
        }
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, id, children),
        }
      }
      return node
    })
  }

  // Xử lý khi chọn/bỏ chọn thương hiệu
  const handleBrandChange = (brandId: number, checked: boolean) => {
    if (checked) {
      setSelectedBrandIds([...selectedBrandIds, brandId])
    } else {
      setSelectedBrandIds(selectedBrandIds.filter((id) => id !== brandId))
    }
  }

  // Tạo danh sách loại sản phẩm từ enum
  const productTypeOptions = Object.entries(PRODUCT_TYPE_LABELS).map(
    ([value, label]) => ({
      value: value as ProductFilterType,
      label,
    })
  )

  // Xử lý khi chọn/bỏ chọn một danh mục
  const handleCategorySelect = (
    categoryId: number,
    checked: boolean,
    parentId?: number
  ) => {
    const newSelectedCategories = checked
      ? [...selectedCategoryIds, categoryId]
      : selectedCategoryIds.filter((id) => id !== categoryId)

    setSelectedCategoryIds(newSelectedCategories)

    // Nếu là danh mục con và được chọn, tự động mở rộng danh mục cha
    if (checked && parentId) {
      const parentKey = parentId.toString()
      if (!expandedKeys.includes(parentKey)) {
        setExpandedKeys([...expandedKeys, parentKey])
        setAutoExpandParent(true)
      }
    }
  }

  // Chuyển đổi danh sách danh mục thành cấu trúc cây
  useEffect(() => {
    const buildInitialTree = () => {
      // Lọc ra các danh mục gốc (không có parentId)
      const rootCategories = categories.filter((cat) => !cat.parentId)

      // Tạo cây ban đầu từ các danh mục gốc
      const tree = rootCategories.map((cat) => ({
        title: (
          <div className='flex items-center w-full'>
            <Checkbox
              checked={selectedCategoryIds.includes(cat.id)}
              onChange={(e) => handleCategorySelect(cat.id, e.target.checked)}
              className='mr-2'
            />
            <div className='flex items-center'>
              {cat.image && (
                <Avatar
                  src={cat.image}
                  size={24}
                  shape='square'
                  className='mr-2'
                />
              )}
              <span className='text-gray-700'>{cat.name}</span>
              {cat.productCount !== undefined && (
                <span className='ml-1 text-gray-400 text-xs'>
                  ({cat.productCount})
                </span>
              )}
            </div>
          </div>
        ),
        key: cat.id.toString(),
        isLeaf: !cat.hasChildren,
      }))

      setCategoryTree(tree)
    }

    buildInitialTree()
  }, [categories, selectedCategoryIds, setSelectedCategoryIds])

  // Xử lý khi mở rộng một node trong cây
  const onLoadData = async (node: any) => {
    const { key } = node

    // Kiểm tra nếu node đã được load rồi thì không load lại
    if (loadedKeys.includes(key)) {
      return Promise.resolve()
    }

    try {
      // Gọi API để lấy danh mục con
      const childCategories = await categoryService.getChildCategoryById(
        parseInt(key)
      )

      // Tạo danh sách các node con
      const childNodes = childCategories.map((cat) => ({
        title: (
          <div className='flex items-center w-full'>
            <Checkbox
              checked={selectedCategoryIds.includes(cat.id)}
              onChange={(e) =>
                handleCategorySelect(cat.id, e.target.checked, parseInt(key))
              }
              className='mr-2'
            />
            <div className='flex items-center'>
              {cat.image && (
                <Avatar
                  src={cat.image}
                  size={24}
                  shape='square'
                  className='mr-2'
                />
              )}
              <span className='text-gray-700'>{cat.name}</span>
              {cat.productCount !== undefined && (
                <span className='ml-1 text-gray-400 text-xs'>
                  ({cat.productCount})
                </span>
              )}
            </div>
          </div>
        ),
        key: cat.id.toString(),
        isLeaf: !cat.hasChildren,
      }))

      setCategoryTree((prev) => updateTreeData(prev, key, childNodes))
      setLoadedKeys((prev) => [...prev, key])
      return Promise.resolve()
    } catch (error) {
      console.error('Lỗi khi tải danh mục con:', error)
      // Đánh dấu node là đã load để tránh gọi lại liên tục khi có lỗi
      setLoadedKeys((prev) => [...prev, key])
      return Promise.resolve()
    }
  }

  // Xử lý khi mở rộng/thu gọn node
  const onExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false) // Tắt tự động mở rộng sau khi người dùng đã tương tác
  }

  // Tự động mở rộng danh mục cha khi có danh mục con được chọn
  useEffect(() => {
    // Tìm danh mục cha của các danh mục đã chọn
    const findParentIds = async () => {
      // Chỉ xử lý nếu có danh mục được chọn
      if (selectedCategoryIds.length > 0) {
        // Danh sách tạm thời các khóa mở rộng
        const keysToExpand: string[] = []

        // Xử lý từng danh mục được chọn
        for (const catId of selectedCategoryIds) {
          try {
            // Tìm danh mục trong danh sách gốc
            const category = categories.find((c) => c.id === catId)

            // Nếu có danh mục và nó có parentId
            if (category?.parentId) {
              keysToExpand.push(category.parentId.toString())

              // Đảm bảo đã load danh mục con của cha
              const parentId = category.parentId // Lưu parentId để TypeScript hiểu nó không undefined
              if (parentId && !loadedKeys.includes(parentId.toString())) {
                try {
                  const childCategories =
                    await categoryService.getChildCategoryById(parentId)
                  // Cập nhật cây với danh mục con đã load
                  const childNodes = childCategories.map((cat) => ({
                    title: (
                      <div className='flex items-center w-full'>
                        <Checkbox
                          checked={selectedCategoryIds.includes(cat.id)}
                          onChange={(e) =>
                            handleCategorySelect(
                              cat.id,
                              e.target.checked,
                              parentId
                            )
                          }
                          className='mr-2'
                        />
                        <div className='flex items-center'>
                          {cat.image && (
                            <Avatar
                              src={cat.image}
                              size={24}
                              shape='square'
                              className='mr-2'
                            />
                          )}
                          <span className='text-gray-700'>{cat.name}</span>
                          {cat.productCount !== undefined && (
                            <span className='ml-1 text-gray-400 text-xs'>
                              ({cat.productCount})
                            </span>
                          )}
                        </div>
                      </div>
                    ),
                    key: cat.id.toString(),
                    isLeaf: true,
                  }))

                  // Cập nhật cây danh mục
                  setCategoryTree((prev) =>
                    updateTreeData(prev, parentId.toString(), childNodes)
                  )
                  setLoadedKeys((prev) => [...prev, parentId.toString()])
                } catch (error) {
                  console.error('Error loading child categories:', error)
                }
              }
            }
          } catch (error) {
            console.error('Error processing category:', error)
          }
        }

        // Cập nhật danh sách khóa mở rộng nếu cần
        if (keysToExpand.length > 0) {
          setExpandedKeys((prev) => [...new Set([...prev, ...keysToExpand])])
          setAutoExpandParent(true)
        }
      }
    }

    findParentIds()
  }, [selectedCategoryIds, categories, loadedKeys])

  return (
    <div className='space-y-5'>
      {/* Loại sản phẩm */}
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
        <Title level={5} className='!mb-3 text-primary-600 font-medium'>
          Loại sản phẩm
        </Title>
        <Radio.Group
          value={productType}
          onChange={(e) => setProductType(e.target.value as ProductFilterType)}
          className='w-full'
        >
          {productTypeOptions.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              className='block mb-2'
            >
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <Divider className='my-0 bg-gray-100' />

      {/* Danh mục */}
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
        <Title level={5} className='!mb-3 text-primary-600 font-medium'>
          Danh mục
        </Title>
        <Tree
          showLine={{ showLeafIcon: false }}
          showIcon={false}
          switcherIcon={<DownOutlined />}
          loadData={onLoadData}
          treeData={categoryTree}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          autoExpandParent={autoExpandParent}
          className='custom-category-tree'
        />
      </div>

      <Divider className='my-0 bg-gray-100' />

      {/* Thương hiệu */}
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
        <Title level={5} className='!mb-3 text-primary-600 font-medium'>
          Thương hiệu
        </Title>
        <div className='max-h-60 overflow-auto mb-2'>
          <List
            dataSource={brands.slice(0, showAllBrands ? brands.length : 5)}
            renderItem={(brand) => (
              <List.Item className='py-2 px-0 border-b border-gray-100 last:border-0'>
                <Checkbox
                  checked={selectedBrandIds.includes(brand.id)}
                  onChange={(e) =>
                    handleBrandChange(brand.id, e.target.checked)
                  }
                  className='flex items-center w-full'
                >
                  <div className='flex items-center'>
                    <Avatar src={brand.image} size={24} className='mr-2' />
                    <span className='text-gray-700'>{brand.name}</span>
                    {brand.productCount && (
                      <span className='ml-1 text-gray-400 text-xs'>
                        ({brand.productCount})
                      </span>
                    )}
                  </div>
                </Checkbox>
              </List.Item>
            )}
          />
        </div>
        {brands.length > 5 && (
          <Button
            type='link'
            onClick={() => setShowAllBrands(!showAllBrands)}
            className='p-0 text-primary-500 hover:text-primary-600'
          >
            {showAllBrands ? 'Thu gọn' : `Xem thêm (${brands.length - 5})`}
          </Button>
        )}
      </div>

      <Divider className='my-0 bg-gray-100' />

      {/* Khoảng giá */}
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
        <Title level={5} className='!mb-3 text-primary-600 font-medium'>
          Khoảng giá
        </Title>
        <Slider
          range
          min={0}
          max={20000000}
          step={100000}
          value={priceRange}
          onChange={(values) =>
            handlePriceRangeChange(values as [number, number])
          }
          tipFormatter={(value) => `${value?.toLocaleString('vi-VN')}đ`}
          className='mb-4'
        />
        <div className='flex justify-between text-sm'>
          <span className='font-medium'>
            {priceRange[0].toLocaleString('vi-VN')}đ
          </span>
          <span className='font-medium'>
            {priceRange[1].toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>

      <Divider className='my-0 bg-gray-100' />

      {/* Đánh giá */}
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
        <Title level={5} className='!mb-3 text-primary-600 font-medium'>
          Đánh giá
        </Title>
        <Radio.Group
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <Radio key={rating} value={rating} className='block mb-2 last:mb-0'>
              <div className='flex items-center'>
                {Array(rating)
                  .fill(null)
                  .map((_, i) => (
                    <span key={i} className='text-yellow-400 text-lg mr-0.5'>
                      ★
                    </span>
                  ))}
                <span className='ml-1'>trở lên</span>
              </div>
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <Divider className='my-0 bg-gray-100' />

      <Divider className='my-0 bg-gray-100' />

      {/* Tình trạng kho */}
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
        <Checkbox
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className='text-gray-700'
        >
          Chỉ hiển thị sản phẩm còn hàng
        </Checkbox>
      </div>
    </div>
  )
}

export default FilterPanel
