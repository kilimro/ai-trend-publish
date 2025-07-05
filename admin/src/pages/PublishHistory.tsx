import React, { useState } from 'react'
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Modal, 
  DatePicker,
  Select,
  Input,
  Tooltip,
  Progress
} from 'antd'
import { 
  EyeOutlined, 
  LinkOutlined, 
  ReloadOutlined,
  ExportOutlined,
  SearchOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select
const { Search } = Input

interface PublishRecord {
  id: string
  title: string
  platform: string
  status: 'published' | 'failed' | 'pending'
  publishTime: string
  url?: string
  articleCount: number
  successCount: number
  workflow: string
  error?: string
}

const PublishHistory: React.FC = () => {
  const [records, setRecords] = useState<PublishRecord[]>([
    {
      id: '1',
      title: '2024-01-15 AI速递 | DeepSeek-R1登顶排行榜',
      platform: 'weixin',
      status: 'published',
      publishTime: '2024-01-15 14:30:00',
      url: 'https://mp.weixin.qq.com/s/example1',
      articleCount: 8,
      successCount: 8,
      workflow: 'WeixinWorkflow'
    },
    {
      id: '2',
      title: 'AI模型性能榜单 - 2024年第3周',
      platform: 'weixin',
      status: 'published',
      publishTime: '2024-01-14 03:00:00',
      url: 'https://mp.weixin.qq.com/s/example2',
      articleCount: 1,
      successCount: 1,
      workflow: 'WeixinAIBenchWorkflow'
    },
    {
      id: '3',
      title: 'GitHub热门AI项目精选',
      platform: 'weixin',
      status: 'published',
      publishTime: '2024-01-10 03:00:00',
      url: 'https://mp.weixin.qq.com/s/example3',
      articleCount: 5,
      successCount: 5,
      workflow: 'WeixinHelloGithubWorkflow'
    },
    {
      id: '4',
      title: '2024-01-09 AI速递',
      platform: 'weixin',
      status: 'failed',
      publishTime: '2024-01-09 03:00:00',
      articleCount: 10,
      successCount: 0,
      workflow: 'WeixinWorkflow',
      error: 'API额度不足'
    },
    {
      id: '5',
      title: '2024-01-08 AI速递',
      platform: 'weixin',
      status: 'pending',
      publishTime: '2024-01-08 03:00:00',
      articleCount: 12,
      successCount: 0,
      workflow: 'WeixinWorkflow'
    }
  ])

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewRecord, setPreviewRecord] = useState<PublishRecord | null>(null)
  const [filters, setFilters] = useState({
    platform: '',
    status: '',
    workflow: '',
    dateRange: null as any
  })

  const handlePreview = (record: PublishRecord) => {
    setPreviewRecord(record)
    setPreviewVisible(true)
  }

  const handleRetry = (id: string) => {
    setRecords(prev => prev.map(record =>
      record.id === id
        ? { ...record, status: 'pending' as const }
        : record
    ))
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      published: { color: 'success', text: '已发布' },
      failed: { color: 'error', text: '失败' },
      pending: { color: 'processing', text: '处理中' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getPlatformTag = (platform: string) => {
    const platformConfig = {
      weixin: { color: 'green', text: '微信公众号' }
    }
    const config = platformConfig[platform as keyof typeof platformConfig] || { color: 'default', text: platform }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getWorkflowTag = (workflow: string) => {
    const workflowConfig = {
      WeixinWorkflow: { color: 'blue', text: '微信文章工作流' },
      WeixinAIBenchWorkflow: { color: 'purple', text: 'AI排行榜' },
      WeixinHelloGithubWorkflow: { color: 'orange', text: 'GitHub项目' }
    }
    const config = workflowConfig[workflow as keyof typeof workflowConfig] || { color: 'default', text: workflow }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: PublishRecord) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {getWorkflowTag(record.workflow)}
          </div>
        </div>
      )
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      render: (platform: string) => getPlatformTag(platform)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '成功率',
      key: 'successRate',
      width: 150,
      render: (_, record: PublishRecord) => {
        const rate = record.articleCount > 0 ? (record.successCount / record.articleCount) * 100 : 0
        return (
          <div>
            <Progress 
              percent={rate} 
              size="small" 
              status={rate === 100 ? 'success' : rate === 0 ? 'exception' : 'active'}
            />
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.successCount}/{record.articleCount}
            </div>
          </div>
        )
      }
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 150,
      sorter: (a: PublishRecord, b: PublishRecord) => 
        dayjs(a.publishTime).unix() - dayjs(b.publishTime).unix()
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record: PublishRecord) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          {record.url && (
            <Tooltip title="查看文章">
              <Button
                size="small"
                icon={<LinkOutlined />}
                onClick={() => window.open(record.url, '_blank')}
              />
            </Tooltip>
          )}
          {record.status === 'failed' && (
            <Tooltip title="重试发布">
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => handleRetry(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card
        title="发布历史"
        extra={
          <Button icon={<ExportOutlined />}>
            导出记录
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search
              placeholder="搜索标题"
              style={{ width: 200 }}
              onSearch={(value) => console.log('搜索:', value)}
            />
            <Select
              placeholder="选择平台"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, platform: value || '' }))}
            >
              <Option value="weixin">微信公众号</Option>
            </Select>
            <Select
              placeholder="选择状态"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, status: value || '' }))}
            >
              <Option value="published">已发布</Option>
              <Option value="failed">失败</Option>
              <Option value="pending">处理中</Option>
            </Select>
            <Select
              placeholder="选择工作流"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, workflow: value || '' }))}
            >
              <Option value="WeixinWorkflow">微信文章工作流</Option>
              <Option value="WeixinAIBenchWorkflow">AI排行榜</Option>
              <Option value="WeixinHelloGithubWorkflow">GitHub项目</Option>
            </Select>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          pagination={{
            total: records.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>

      <Modal
        title="发布详情"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {previewRecord && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>{previewRecord.title}</h3>
              <Space>
                {getPlatformTag(previewRecord.platform)}
                {getStatusTag(previewRecord.status)}
                {getWorkflowTag(previewRecord.workflow)}
              </Space>
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong>发布时间：</strong>
              {previewRecord.publishTime}
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong>文章统计：</strong>
              <div style={{ marginTop: 8 }}>
                <Progress 
                  percent={previewRecord.articleCount > 0 ? (previewRecord.successCount / previewRecord.articleCount) * 100 : 0}
                  format={() => `${previewRecord.successCount}/${previewRecord.articleCount}`}
                />
              </div>
            </div>

            {previewRecord.url && (
              <div style={{ marginBottom: 16 }}>
                <strong>文章链接：</strong>
                <div style={{ marginTop: 8 }}>
                  <a href={previewRecord.url} target="_blank" rel="noopener noreferrer">
                    {previewRecord.url}
                  </a>
                </div>
              </div>
            )}

            {previewRecord.error && (
              <div style={{ marginBottom: 16 }}>
                <strong>错误信息：</strong>
                <div style={{ 
                  marginTop: 8, 
                  padding: 12, 
                  background: '#fff2f0', 
                  border: '1px solid #ffccc7',
                  borderRadius: 4,
                  color: '#ff4d4f'
                }}>
                  {previewRecord.error}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <strong>执行日志：</strong>
              <div style={{ 
                marginTop: 8, 
                padding: 12, 
                background: '#f5f5f5', 
                borderRadius: 4,
                fontFamily: 'monospace',
                fontSize: 12,
                maxHeight: 200,
                overflow: 'auto'
              }}>
                <div>2024-01-15 14:30:00 - 开始执行工作流</div>
                <div>2024-01-15 14:30:05 - 抓取数据源完成，获取到 15 条内容</div>
                <div>2024-01-15 14:30:10 - 内容排序完成</div>
                <div>2024-01-15 14:30:15 - 内容摘要生成完成</div>
                <div>2024-01-15 14:30:20 - 模板渲染完成</div>
                <div>2024-01-15 14:30:25 - 发布到微信公众号成功</div>
                <div>2024-01-15 14:30:30 - 工作流执行完成</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PublishHistory