import React, { useState } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select,
  Switch,
  Tag,
  message,
  Popconfirm,
  Tooltip
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SyncOutlined,
  LinkOutlined
} from '@ant-design/icons'

const { Option } = Select

interface DataSource {
  id: string
  name: string
  type: 'firecrawl' | 'twitter' | 'custom'
  url: string
  enabled: boolean
  lastSync: string
  status: 'active' | 'error' | 'inactive'
  description: string
}

const DataSources: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Hacker News',
      type: 'firecrawl',
      url: 'https://news.ycombinator.com/',
      enabled: true,
      lastSync: '2024-01-15 14:30:00',
      status: 'active',
      description: '技术新闻和讨论'
    },
    {
      id: '2',
      name: 'Reuters AI News',
      type: 'firecrawl',
      url: 'https://www.reuters.com/technology/artificial-intelligence/',
      enabled: true,
      lastSync: '2024-01-15 14:25:00',
      status: 'active',
      description: '路透社AI新闻'
    },
    {
      id: '3',
      name: 'OpenAI Twitter',
      type: 'twitter',
      url: 'https://x.com/OpenAI',
      enabled: true,
      lastSync: '2024-01-15 14:20:00',
      status: 'active',
      description: 'OpenAI官方Twitter账号'
    },
    {
      id: '4',
      name: 'DeepSeek Twitter',
      type: 'twitter',
      url: 'https://x.com/deepseek_ai',
      enabled: false,
      lastSync: '2024-01-14 10:15:00',
      status: 'inactive',
      description: 'DeepSeek官方Twitter账号'
    }
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingSource, setEditingSource] = useState<DataSource | null>(null)
  const [form] = Form.useForm()

  const sourceTypes = [
    { value: 'firecrawl', label: 'FireCrawl网页抓取', icon: '🌐' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { value: 'custom', label: '自定义API', icon: '⚙️' }
  ]

  const handleEdit = (source: DataSource) => {
    setEditingSource(source)
    form.setFieldsValue(source)
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setDataSources(prev => prev.filter(source => source.id !== id))
    message.success('数据源已删除')
  }

  const handleToggleEnabled = (id: string, enabled: boolean) => {
    setDataSources(prev => prev.map(source =>
      source.id === id
        ? { ...source, enabled, status: enabled ? 'active' : 'inactive' }
        : source
    ))
    message.success(`数据源已${enabled ? '启用' : '禁用'}`)
  }

  const handleTest = async (source: DataSource) => {
    message.loading({ content: '正在测试连接...', key: 'test' })
    
    // 模拟测试
    setTimeout(() => {
      const success = Math.random() > 0.3
      if (success) {
        message.success({ content: '连接测试成功', key: 'test' })
        setDataSources(prev => prev.map(s =>
          s.id === source.id ? { ...s, status: 'active' } : s
        ))
      } else {
        message.error({ content: '连接测试失败', key: 'test' })
        setDataSources(prev => prev.map(s =>
          s.id === source.id ? { ...s, status: 'error' } : s
        ))
      }
    }, 2000)
  }

  const handleSync = (source: DataSource) => {
    message.info(`正在同步数据源: ${source.name}`)
    setDataSources(prev => prev.map(s =>
      s.id === source.id 
        ? { ...s, lastSync: new Date().toLocaleString() }
        : s
    ))
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingSource) {
        setDataSources(prev => prev.map(source =>
          source.id === editingSource.id
            ? { ...source, ...values }
            : source
        ))
        message.success('数据源已更新')
      } else {
        const newSource: DataSource = {
          id: Date.now().toString(),
          ...values,
          lastSync: '-',
          status: 'inactive'
        }
        setDataSources(prev => [...prev, newSource])
        message.success('数据源已创建')
      }
      
      setIsModalVisible(false)
      setEditingSource(null)
      form.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'success', text: '正常' },
      error: { color: 'error', text: '错误' },
      inactive: { color: 'default', text: '未激活' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getTypeTag = (type: string) => {
    const typeInfo = sourceTypes.find(t => t.value === type)
    return (
      <Tag>
        {typeInfo?.icon} {typeInfo?.label}
      </Tag>
    )
  }

  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DataSource) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.description}</div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeTag(type)
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => (
        <Tooltip title={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <LinkOutlined /> {url.length > 40 ? `${url.substring(0, 40)}...` : url}
          </a>
        </Tooltip>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: DataSource) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleEnabled(record.id, checked)}
        />
      )
    },
    {
      title: '最后同步',
      dataIndex: 'lastSync',
      key: 'lastSync'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: DataSource) => (
        <Space>
          <Tooltip title="测试连接">
            <Button
              size="small"
              icon={<SyncOutlined />}
              onClick={() => handleTest(record)}
            />
          </Tooltip>
          <Tooltip title="立即同步">
            <Button
              size="small"
              icon={<SyncOutlined />}
              onClick={() => handleSync(record)}
              disabled={!record.enabled}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个数据源吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card
        title="数据源管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingSource(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            添加数据源
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSources}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>

      <Modal
        title={editingSource ? '编辑数据源' : '添加数据源'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingSource(null)
          form.resetFields()
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            enabled: true
          }}
        >
          <Form.Item
            name="name"
            label="数据源名称"
            rules={[{ required: true, message: '请输入数据源名称' }]}
          >
            <Input placeholder="请输入数据源名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="数据源类型"
            rules={[{ required: true, message: '请选择数据源类型' }]}
          >
            <Select placeholder="请选择数据源类型">
              {sourceTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="url"
            label="URL地址"
            rules={[
              { required: true, message: '请输入URL地址' },
              { type: 'url', message: '请输入有效的URL地址' }
            ]}
          >
            <Input placeholder="请输入URL地址" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入数据源描述" />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DataSources