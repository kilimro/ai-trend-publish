import React, { useState } from 'react'
import { 
  Card, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Select, 
  TimePicker, 
  Switch,
  message,
  Popconfirm,
  Tooltip
} from 'antd'
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Option } = Select

interface Workflow {
  id: string
  name: string
  type: string
  status: 'running' | 'stopped' | 'error'
  schedule: string
  lastRun: string
  nextRun: string
  description: string
}

const WorkflowManagement: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: '微信文章工作流',
      type: 'WeixinWorkflow',
      status: 'running',
      schedule: '0 3 * * *',
      lastRun: '2024-01-15 03:00:00',
      nextRun: '2024-01-16 03:00:00',
      description: '每日凌晨3点自动抓取AI相关内容并发布到微信公众号'
    },
    {
      id: '2',
      name: 'AI模型排行榜',
      type: 'WeixinAIBenchWorkflow',
      status: 'running',
      schedule: '0 3 * * 2',
      lastRun: '2024-01-14 03:00:00',
      nextRun: '2024-01-21 03:00:00',
      description: '每周二更新AI模型性能排行榜'
    },
    {
      id: '3',
      name: 'GitHub热门项目',
      type: 'WeixinHelloGithubWorkflow',
      status: 'running',
      schedule: '0 3 * * 3',
      lastRun: '2024-01-10 03:00:00',
      nextRun: '2024-01-17 03:00:00',
      description: '每周三发布GitHub热门AI项目推荐'
    }
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null)
  const [form] = Form.useForm()

  const workflowTypes = [
    { value: 'WeixinWorkflow', label: '微信文章工作流' },
    { value: 'WeixinAIBenchWorkflow', label: 'AI模型排行榜' },
    { value: 'WeixinHelloGithubWorkflow', label: 'GitHub热门项目' }
  ]

  const handleStatusChange = (id: string, action: 'start' | 'stop') => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === id 
        ? { ...workflow, status: action === 'start' ? 'running' : 'stopped' }
        : workflow
    ))
    message.success(`工作流已${action === 'start' ? '启动' : '停止'}`)
  }

  const handleEdit = (workflow: Workflow) => {
    setEditingWorkflow(workflow)
    form.setFieldsValue({
      ...workflow,
      scheduleTime: dayjs(workflow.schedule, 'H m * * *')
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== id))
    message.success('工作流已删除')
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const scheduleTime = values.scheduleTime.format('H m')
      const schedule = `0 ${scheduleTime} * * *`
      
      if (editingWorkflow) {
        setWorkflows(prev => prev.map(workflow =>
          workflow.id === editingWorkflow.id
            ? { ...workflow, ...values, schedule }
            : workflow
        ))
        message.success('工作流已更新')
      } else {
        const newWorkflow: Workflow = {
          id: Date.now().toString(),
          ...values,
          schedule,
          status: 'stopped',
          lastRun: '-',
          nextRun: '-'
        }
        setWorkflows(prev => [...prev, newWorkflow])
        message.success('工作流已创建')
      }
      
      setIsModalVisible(false)
      setEditingWorkflow(null)
      form.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const handleRunNow = (workflow: Workflow) => {
    message.info(`正在执行工作流: ${workflow.name}`)
    // 这里会调用后端API立即执行工作流
  }

  const columns = [
    {
      title: '工作流名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Workflow) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.description}</div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeInfo = workflowTypes.find(t => t.value === type)
        return <Tag color="blue">{typeInfo?.label || type}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          running: { color: 'success', text: '运行中' },
          stopped: { color: 'default', text: '已停止' },
          error: { color: 'error', text: '错误' }
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '调度时间',
      dataIndex: 'schedule',
      key: 'schedule',
      render: (schedule: string) => (
        <Tooltip title={`Cron表达式: ${schedule}`}>
          <Tag icon={<ClockCircleOutlined />}>
            {schedule.split(' ').slice(1, 3).join(':')}
          </Tag>
        </Tooltip>
      )
    },
    {
      title: '上次运行',
      dataIndex: 'lastRun',
      key: 'lastRun'
    },
    {
      title: '下次运行',
      dataIndex: 'nextRun',
      key: 'nextRun'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: Workflow) => (
        <Space>
          {record.status === 'running' ? (
            <Button
              size="small"
              icon={<PauseCircleOutlined />}
              onClick={() => handleStatusChange(record.id, 'stop')}
            >
              停止
            </Button>
          ) : (
            <Button
              size="small"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStatusChange(record.id, 'start')}
            >
              启动
            </Button>
          )}
          <Button
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handleRunNow(record)}
          >
            立即执行
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个工作流吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card
        title="工作流管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingWorkflow(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            新建工作流
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={workflows}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title={editingWorkflow ? '编辑工作流' : '新建工作流'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingWorkflow(null)
          form.resetFields()
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'stopped'
          }}
        >
          <Form.Item
            name="name"
            label="工作流名称"
            rules={[{ required: true, message: '请输入工作流名称' }]}
          >
            <input placeholder="请输入工作流名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="工作流类型"
            rules={[{ required: true, message: '请选择工作流类型' }]}
          >
            <Select placeholder="请选择工作流类型">
              {workflowTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="scheduleTime"
            label="执行时间"
            rules={[{ required: true, message: '请选择执行时间' }]}
          >
            <TimePicker format="HH:mm" placeholder="选择执行时间" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <input placeholder="请输入工作流描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default WorkflowManagement