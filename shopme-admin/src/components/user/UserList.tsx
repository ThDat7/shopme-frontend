import React, { useEffect, useState } from 'react'
import { User, UserParams } from '../../types/userTypes'
import { userService } from '../../services/userService'
import {
  Table,
  Button,
  Space,
  Switch,
  Image,
  Input,
  Modal,
  message,
  Dropdown,
} from 'antd'
import '@ant-design/v5-patch-for-react-19'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'

const { Search } = Input

const UserList: React.FC = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<UserParams>({
    page: '0',
    size: '10',
    sortField: 'firstName',
    sortDirection: 'asc',
    keyword: '',
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userService.listByPage(params)
      setUsers(response.result.content)
      setTotalPages(response.result.totalPages)
    } catch (error) {
      console.error('Error fetching users:', error)
      message.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [params])

  const handleSearch = (value: string) => {
    setParams({
      ...params,
      keyword: value,
      page: '0', // Reset to first page when searching
    })
  }

  const handleDelete = async (id: number) => {
    try {
      setLoading(true)
      await userService.deleteUser(id)
      message.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      message.error('Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      await userService.updateUserStatus(id, status)
      message.success('User status updated successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error updating user status:', error)
      message.error('Failed to update user status')
    }
  }

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      await userService.exportUsers(format)
      message.success(`Users exported to ${format.toUpperCase()} successfully`)
    } catch (error) {
      console.error('Error exporting users:', error)
      message.error(`Failed to export users to ${format.toUpperCase()}`)
    }
  }

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'csv',
      label: 'Export to CSV',
      icon: <DownloadOutlined />,
      onClick: () => handleExport('csv'),
    },
    {
      key: 'excel',
      label: 'Export to Excel',
      icon: <DownloadOutlined />,
      onClick: () => handleExport('excel'),
    },
    {
      key: 'pdf',
      label: 'Export to PDF',
      icon: <DownloadOutlined />,
      onClick: () => handleExport('pdf'),
    },
  ]

  const columns: ColumnsType<User> = [
    {
      title: 'Photo',
      dataIndex: 'photos',
      key: 'photos',
      render: (photo: string) => (
        <Image
          src={photo || '/default-user.png'}
          alt='User photo'
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: '50%' }}
        />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: true,
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: true,
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => roles.join(', '),
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: User) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: User) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to delete this user?',
                content: 'This action cannot be undone.',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: async () => await handleDelete(record.id),
              })
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const handleTableChange = (pagination: any, _: any, sorter: any) => {
    const newParams: UserParams = {
      ...params,
      page: (pagination.current - 1).toString(),
      sortField: sorter.field || 'firstName',
      sortDirection: sorter.order === 'ascend' ? 'asc' : 'desc',
    }
    setParams(newParams)
  }

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space>
          <Search
            placeholder='Search users...'
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Dropdown menu={{ items: exportMenuItems }} placement='bottomLeft'>
            <Button icon={<ExportOutlined />}>Export</Button>
          </Dropdown>
        </Space>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigate('/users/create')}
        >
          Add User
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey='id'
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          total: totalPages * parseInt(params.size || '10'),
          pageSize: parseInt(params.size || '10'),
          current: parseInt(params.page || '0') + 1,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />
    </div>
  )
}

export default UserList
