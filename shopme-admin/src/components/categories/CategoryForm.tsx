import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Cascader,
  Switch,
  Upload,
  Space,
  message,
  Spin,
} from 'antd'
import { SaveOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { categoryService } from '../../services/categoryService'
import {
  CategorySelectResponse,
  CategoryDetailResponse,
  CategoryFormData,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from '../../types/categoryTypes'
import { RcFile } from 'antd/lib/upload'
import {
  findCategoryPath,
  renderCategoryOptions,
} from '../../utils/categoryUtils'

interface CategoryFormProps {
  initialData?: CategoryDetailResponse
  isEditMode?: boolean
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  isEditMode = false,
}) => {
  const navigate = useNavigate()
  const [form] = Form.useForm<CategoryFormData>()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategorySelectResponse[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        alias: initialData.alias,
        enabled: initialData.enabled,
        parentID: initialData.parentID ? [initialData.parentID] : undefined,
      })
      if (initialData.image) {
        setImageUrl(initialData.image)
      }
    }
  }, [initialData])

  useEffect(() => {
    if (initialData?.parentID && categories.length > 0) {
      const path =
        findCategoryPath(initialData.parentID, categories) || undefined
      form.setFieldsValue({
        parentID: path,
      })
    }
  }, [categories, initialData])

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllInForm()
      setCategories(response)
    } catch (error) {
      message.error('Failed to load categories')
    }
  }

  const options = renderCategoryOptions(categories).map((option) => ({
    ...option,
    disabled: isEditMode && initialData?.id === option.value,
  }))

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('You can only upload image files!')
    }
    return isImage
  }

  const handleImageChange = (info: any) => {
    if (info.file.status === 'uploading') {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageUrl(e.target.result as string)
        }
      }
      reader.readAsDataURL(info.file.originFileObj)
    }
  }

  const onFinish = async (values: CategoryFormData) => {
    setLoading(true)
    try {
      const requestData: CategoryCreateRequest | CategoryUpdateRequest = {
        name: values.name,
        alias: values.alias || values.name.toLowerCase().replace(/\s+/g, '-'),
        enabled: values.enabled,
        parentID: values.parentID?.[values.parentID.length - 1],
      }

      if (values.image) {
        const imageFile = values.image[0]?.originFileObj
        if (imageFile) {
          requestData.image = imageFile
        }
      }

      if (isEditMode && initialData) {
        await categoryService.updateCategory(
          initialData.id,
          requestData as CategoryUpdateRequest
        )
        message.success('Category updated successfully')
      } else {
        await categoryService.createCategory(
          requestData as CategoryCreateRequest
        )
        message.success('Category created successfully')
      }
      navigate('/categories')
    } catch (error) {
      message.error(`Failed to ${isEditMode ? 'update' : 'create'} category`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Spin spinning={loading}>
      <Form<CategoryFormData>
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ enabled: true }}
      >
        <Form.Item
          name='name'
          label='Category Name'
          rules={[{ required: true, message: 'Please input category name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='alias'
          label='Alias'
          help='Used for SEO-friendly URLs. Will be auto-generated from the name if left empty.'
        >
          <Input />
        </Form.Item>

        <Form.Item name='parentID' label='Parent Category'>
          <Cascader
            options={options}
            placeholder='Select parent category'
            changeOnSelect
            expandTrigger='hover'
            showSearch={{
              filter: (inputValue, path) => {
                return path.some(
                  (option) =>
                    (option.label as string)
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) > -1
                )
              },
            }}
          />
        </Form.Item>

        <Form.Item name='enabled' label='Enabled' valuePropName='checked'>
          <Switch />
        </Form.Item>

        <Form.Item
          name='image'
          label='Category Image'
          valuePropName='fileList'
          rules={[
            {
              required: !isEditMode,
              message: 'Please upload a category image!',
            },
          ]}
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e
            }
            return e?.fileList
          }}
        >
          <Upload
            name='image'
            listType='picture-card'
            maxCount={1}
            beforeUpload={beforeUpload}
            onChange={handleImageChange}
            showUploadList={false}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess?.('ok')
              }, 0)
            }}
          >
            {imageUrl ? (
              <div style={{ position: 'relative' }}>
                <img src={imageUrl} alt='category' style={{ width: '100%' }} />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    padding: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setImageUrl(null)
                    form.setFieldsValue({ image: undefined })
                  }}
                >
                  <DeleteOutlined />
                </div>
              </div>
            ) : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit' icon={<SaveOutlined />}>
              {isEditMode ? 'Update' : 'Create'} Category
            </Button>
            <Button onClick={() => navigate('/categories')}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default CategoryForm
