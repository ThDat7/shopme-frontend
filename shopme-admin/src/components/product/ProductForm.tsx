import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Button,
  InputNumber,
  Switch,
  Upload,
  Space,
  Select,
  Tabs,
  Row,
  Col,
  Card,
  Divider,
  message,
  Image,
} from 'antd'
import {
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { RcFile, UploadFile } from 'antd/es/upload'
import {
  ProductCreateRequest,
  ProductDetailResponse,
  ProductImage,
  ProductSpecific,
} from '../../types/productTypes'
import { brandService } from '../../services/brandService'
import { FormSelectOption } from '../../types/commonTypes'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { APP_CONFIG } from '../../config/appConfig'

const { TabPane } = Tabs
const { Option } = Select

interface ProductFormProps {
  initialValues: any
  onSubmit: (values: any) => Promise<void>
  submitButtonText: string
  loading?: boolean
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  submitButtonText,
  loading = false,
}) => {
  const [form] = Form.useForm()
  const [brands, setBrands] = useState<FormSelectOption[]>([])
  const [categories, setCategories] = useState<FormSelectOption[]>([])
  const [extraImageFileList, setExtraImageFileList] = useState<UploadFile[]>([])
  const [mainImageFileList, setMainImageFileList] = useState<UploadFile[]>([])
  const [mainImageUrl, setMainImageUrl] = useState<string>()

  const [selectedBrandId, setSelectedBrandId] = useState<number>()
  const limitImageSize = APP_CONFIG.IMAGE_UPLOAD.MAX_SIZE

  useEffect(() => {
    fetchBrands()

    if (initialValues) {
      // Set initial values for the form
      form.setFieldsValue({
        ...initialValues,
        details: initialValues.details || [],
      })

      // Set images
      if (initialValues.mainImage) {
        setMainImageFileList([
          {
            uid: '1',
            name: initialValues.mainImage.split('/').pop() || '',
            status: 'done',
            url: initialValues.mainImage,
          },
        ])
        setMainImageUrl(initialValues.mainImage)
      }

      if (initialValues.images && initialValues.images.length > 0) {
        setExtraImageFileList(
          initialValues.images.map((image: ProductImage) => ({
            uid: image.id.toString(),
            name: image.url.split('/').pop() || '',
            status: 'done',
            url: image.url,
          }))
        )
      }

      // Set brand and fetch categories
      if (initialValues.brandId) {
        setSelectedBrandId(initialValues.brandId)
        fetchCategoriesByBrand(initialValues.brandId)
      }
    }
  }, [initialValues, form])

  const fetchBrands = async () => {
    try {
      const data = await brandService.listAllForFormSelection()
      setBrands(data)
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    }
  }

  const fetchCategoriesByBrand = async (brandId: number) => {
    try {
      const data = await brandService.listCategoriesByBrand(brandId)
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleBrandChange = (value: number) => {
    setSelectedBrandId(value)
    fetchCategoriesByBrand(value)
    form.setFieldsValue({ categoryId: undefined })
  }

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('You can only upload image files!')
      return false
    }

    const isLtLimit = file.size < limitImageSize
    if (!isLtLimit) {
      message.error(
        `Image must be smaller than ${limitImageSize / (1024 * 1024)}MB!`
      )
      return false
    }

    return false // Prevent automatic upload
  }

  const handleMainImageChange = async ({ fileList }: any) => {
    setMainImageFileList(fileList)

    if (fileList.length > 0 && fileList[0].originFileObj) {
      const fileURL = URL.createObjectURL(fileList[0].originFileObj)
      setMainImageUrl(fileURL)
    }
  }

  const handleExtraImagesChange = ({ fileList }: any) => {
    fileList.forEach((file: any) => {
      if (file.originFileObj) {
        const fileURL = URL.createObjectURL(file.originFileObj)
        file.url = fileURL
      }
    })
    setExtraImageFileList(fileList)
  }

  const handleFinish = async (values: any) => {
    const mainImage = mainImageFileList?.[0].originFileObj as RcFile
    const images = extraImageFileList
      .map((file) => file.originFileObj as RcFile)
      .filter(Boolean)
    const remainingImageIds = extraImageFileList
      .filter((file) => file.status === 'done')
      .map((file) => file.uid)

    const productData = {
      ...initialValues,
      ...values,
      mainImage,
      images,
      remainingImageIds,
      details: values.details || [],
    }

    await onSubmit(productData)
  }

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <Tabs defaultActiveKey='general'>
        <TabPane tab='General' key='general'>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='name'
                label='Product Name'
                rules={[
                  { required: true, message: 'Please enter product name' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='alias'
                label='Alias'
                help='Used for SEO-friendly URLs. Will be auto-generated from the name if left empty.'
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name='shortDescription'
            label='Short Description'
            rules={[
              { required: true, message: 'Please enter short description' },
            ]}
          >
            <ReactQuill
              theme='snow'
              style={{ height: 200, marginBottom: 50 }}
            />
          </Form.Item>

          <Form.Item
            name='fullDescription'
            label='Full Description'
            rules={[
              { required: true, message: 'Please enter full description' },
            ]}
          >
            <ReactQuill
              theme='snow'
              style={{ height: 200, marginBottom: 50 }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='brandId'
                label='Brand'
                rules={[{ required: true, message: 'Please select a brand' }]}
              >
                <Select
                  placeholder='Select a brand'
                  onChange={handleBrandChange}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {brands.map((brand) => (
                    <Option key={brand.key} value={parseInt(brand.key)}>
                      {brand.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='categoryId'
                label='Category'
                rules={[
                  { required: true, message: 'Please select a category' },
                ]}
              >
                <Select
                  placeholder={
                    selectedBrandId
                      ? 'Select a category'
                      : 'Select a brand first'
                  }
                  disabled={!selectedBrandId}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {categories.map((category) => (
                    <Option key={category.key} value={parseInt(category.key)}>
                      {category.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name='enabled' label='Enabled' valuePropName='checked'>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name='inStock'
                label='In Stock'
                valuePropName='checked'
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab='Images' key='images'>
          <Row gutter={16}>
            <Col span={12}>
              <Card title='Main Image' bordered={false}>
                <Form.Item label='Main Image' required>
                  {mainImageUrl && (
                    <div style={{ marginBottom: 16 }}>
                      <Image
                        src={mainImageUrl}
                        alt='Main product image'
                        style={{ maxWidth: '100%', maxHeight: 200 }}
                      />
                    </div>
                  )}
                  <Upload
                    beforeUpload={beforeUpload}
                    onChange={handleMainImageChange}
                    showUploadList={false}
                    fileList={mainImageFileList}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>
                      {mainImageUrl ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </Upload>
                </Form.Item>
              </Card>
            </Col>
            <Col span={12}>
              <Card title='Extra Images' bordered={false}>
                <Form.Item label='Extra Images'>
                  <Upload
                    listType='picture-card'
                    fileList={extraImageFileList}
                    beforeUpload={beforeUpload}
                    onChange={handleExtraImagesChange}
                    multiple
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab='Details' key='details'>
          <Card title='Product Details' bordered={false}>
            <Form.List name='details'>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align='baseline'
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Missing name' }]}
                      >
                        <Input placeholder='Name (e.g. Color)' />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true, message: 'Missing value' }]}
                      >
                        <Input placeholder='Value (e.g. Red)' />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Detail
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </TabPane>

        <TabPane tab='Shipping' key='shipping'>
          <Card title='Price & Cost' bordered={false}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name='cost'
                  label='Cost'
                  rules={[{ required: true, message: 'Please enter cost' }]}
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    style={{ width: '100%' }}
                    addonBefore='$'
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='price'
                  label='Price'
                  rules={[{ required: true, message: 'Please enter price' }]}
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    style={{ width: '100%' }}
                    addonBefore='$'
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='discountPercent'
                  label='Discount Percent'
                  rules={[{ required: true, message: 'Please enter discount' }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    precision={2}
                    style={{ width: '100%' }}
                    addonAfter='%'
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title='Dimensions' bordered={false} style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name='length'
                  label='Length'
                  rules={[{ required: true, message: 'Please enter length' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='width'
                  label='Width'
                  rules={[{ required: true, message: 'Please enter width' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='height'
                  label='Height'
                  rules={[{ required: true, message: 'Please enter height' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='weight'
                  label='Weight'
                  rules={[{ required: true, message: 'Please enter weight' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      <Divider />

      <Form.Item>
        <Button type='primary' htmlType='submit' loading={loading}>
          {submitButtonText}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ProductForm
