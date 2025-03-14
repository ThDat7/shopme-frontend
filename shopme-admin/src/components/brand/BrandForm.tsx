import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Button,
  Upload,
  Space,
  Image,
  Cascader,
  message,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import type { RcFile } from 'antd/es/upload'
import { BrandCreateRequest, BrandDetailResponse } from '../../types/brandTypes'
import { categoryService } from '../../services/categoryService'
import { CategorySelectResponse } from '../../types/categoryTypes'
import { APP_CONFIG } from '../../config/appConfig'
import {
  findCategoryPath,
  renderCategoryOptions,
} from '../../utils/categoryUtils'

interface BrandFormProps {
  initialValues?: BrandDetailResponse
  onSubmit: (values: BrandCreateRequest) => Promise<void>
  submitButtonText: string
  loading?: boolean
}

const BrandForm: React.FC<BrandFormProps> = ({
  initialValues,
  onSubmit,
  submitButtonText,
  loading = false,
}) => {
  const [form] = Form.useForm()
  const [categories, setCategories] = useState<CategorySelectResponse[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [imageUrl, setImageUrl] = useState<string>()
  const limitImageSize = APP_CONFIG.IMAGE_UPLOAD.MAX_SIZE

  useEffect(() => {
    fetchCategories()
    if (initialValues?.logo) {
      setImageUrl(initialValues.logo)
      setFileList([
        {
          uid: '-1',
          name: 'Current logo',
          status: 'done',
          url: initialValues.logo,
        },
      ])
    }
  }, [initialValues])

  useEffect(() => {
    if (initialValues?.categoryIds && categories.length > 0) {
      const paths = Array.from(initialValues.categoryIds)
        .map((id) => findCategoryPath(id, categories))
        .filter((path) => path !== null) as number[][]
      form.setFieldsValue({
        categoryIds: paths,
      })
    }
  }, [categories, initialValues])

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllInForm()
      setCategories(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleFinish = async (values: any) => {
    const categorySelectedIds =
      values.categoryIds?.map((ids: number[]) => ids[ids.length - 1]) || []

    const formData: BrandCreateRequest = {
      ...values,
      logo: fileList[0]?.originFileObj,
      categoryIds: categorySelectedIds,
    }
    await onSubmit(formData)
  }

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('You can only upload image files!')
      return false
    }
    const isLtLimit = file.size < limitImageSize
    if (!isLtLimit) {
      message.error(`Image must be smaller than ${limitImageSize}`)
      return false
    }
    return false // Prevent automatic upload
  }

  const handleChange = (info: any) => {
    setFileList(info.fileList.slice(-1))
    if (info.fileList[0]?.originFileObj) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageUrl(reader.result as string)
      }
      reader.readAsDataURL(info.fileList[0].originFileObj)
    } else if (info.fileList.length === 0) {
      setImageUrl(initialValues?.logo)
    }
  }

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name='name'
        label='Brand Name'
        rules={[{ required: true, message: 'Please input brand name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name='categoryIds'
        label='Categories'
        rules={[
          { required: true, message: 'Please select at least one category!' },
        ]}
      >
        <Cascader
          options={renderCategoryOptions(categories)}
          placeholder='Select categories'
          changeOnSelect
          multiple
          maxTagCount={3}
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

      <Form.Item label='Logo'>
        <Space direction='vertical'>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt='Brand logo'
              width={200}
              style={{ objectFit: 'contain' }}
            />
          )}
          <Upload
            beforeUpload={beforeUpload}
            onChange={handleChange}
            fileList={fileList}
            maxCount={1}
            listType='picture-card'
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>
                {imageUrl ? 'Change Logo' : 'Upload Logo'}
              </div>
            </div>
          </Upload>
        </Space>
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit' loading={loading}>
          {submitButtonText}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default BrandForm
