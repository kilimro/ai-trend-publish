import React, { useState } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Input, 
  Select,
  DatePicker,
  Rate,
  Tooltip,
  Popover
} from 'antd'
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FilterOutlined,
  ExportOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

interface ContentItem {
  id: string
  title: string
  content: string
  url: string
  source: string
  platform: string
  publishDate: string
  score: number
  status: 'published' | 'draft' | 'failed'
  keywords: string[]
  media?: string[]
}

const ContentManagement: React.FC = () => {
  const [contents, setContents] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'DeepSeek-R1 登顶AI模型排行榜',
      content: 'DeepSeek-R1在最新的AI模型评测中表现出色...',
      url: 'https://example.com/deepseek-r1',
      source: 'twitter',
      platform: 'weixin',
      publishDate: '2024-01-15 14:30:00',
      score: 95.5,
      status: 'published',
      keywords: ['AI', 'DeepSeek', '排行榜'],
      media: ['https://example.com/image1.jpg']
    },
    {
      id: '2',
      title: 'OpenAI发布新版本GPT模型',
      content: 'OpenAI今日宣布发布新版本的GPT模型...',
      url: 'https://example.com/openai-gpt',
      source: 'firecrawl',
      platform: 'weixin',
      publishDate: '2024-01-15 12:15:00',
      score: 88.2,
      status: 'published',
      keywords: ['OpenAI', 'GPT', '新版本']
    },
    {
      id: '3',
      title: 'GitHub热门AI项目推荐',
      content: '本周GitHub上最受欢迎的AI项目包括...',
      url: 'https://example.com/github-ai',
      source: 'hellogithub',
      platform: 'weixin',
      publishDate: '2024-01-15 10:45:00',
      score: 82.7,
      status: 'draft',
      keywords: ['GitHub', 'AI项目', '开源']
    }
  ])

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null)
  const [filters, setFilters] = useState({
    source: '',
    status: '',
    dateRange: null as any
  })

  const handlePreview = (content: ContentItem) => {
    setPreviewContent(content)
    setPreviewVisible(true)
  }

  const handleDelete = (id: string) => {
    setContents(prev => prev.filter(item => item.id !== id))
  }

  const handleBatchDelete = () => {
    setContents(prev => prev.filter(item => !selectedRowKeys.includes(item.id)))
    setSelectedRowKeys([])
  }

  const getSourceTag = (source: string) => {
    const sourceConfig = {
      twitter: { color: 'blue', text: 'Twitter' },
      firecrawl: { color: 'green', text: 'FireCrawl' },
      hellogithub: { color: 'orange', text: 'HelloGitHub' }
    }
    const config = sourceConfig[source as keyof typeof sourceConfig] || { color: 'default', text: source }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      published: { color: 'success', text: '已发布' },
      draft: { color: 'processing', text: '草稿' },
      failed: { color: 'error', text: '失败' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: ContentItem) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.keywords.map(keyword => (
              <Tag key={keyword} size="small">{keyword}</Tag>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source: string) => getSourceTag(source)
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      width: 120,
      render: (score: number) => (
        <div>
          <Rate disabled value={score / 20} style={{ fontSize: 12 }} />
          <div style={{ fontSize: 12, color: '#666' }}>{score.toFixed(1)}</div>
        </div>
      ),
      sorter: (a: ContentItem, b: ContentItem) => a.score - b.score
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: 150,
      sorter: (a: ContentItem, b: ContentItem) => 
        dayjs(a.publishDate).unix() - dayjs(b.publishDate).unix()
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record: ContentItem) => (
        <Space>
          <Tooltip title="预览">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              size="small"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  return (
    <div>
      <Card
        title="内容管理"
        extra={
          <Space>
            <Button icon={<ExportOutlined />}>导出</Button>
            {selectedRowKeys.length > 0 && (
              <Button danger onClick={handleBatchDelete}>
                批量删除 ({selectedRowKeys.length})
              </Button>
            )}
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search
              placeholder="搜索标题或关键词"
              style={{ width: 300 }}
              onSearch={(value) => console.log('搜索:', value)}
            />
            <Select
              placeholder="选择来源"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, source: value || '' }))}
            >
              <Option value="twitter">Twitter</Option>
              <Option value="firecrawl">FireCrawl</Option>
              <Option value="hellogithub">HelloGitHub</Option>
            </Select>
            <Select
              placeholder="选择状态"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, status: value || '' }))}
            >
              <Option value="published">已发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="failed">失败</Option>
            </Select>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={contents}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            total: contents.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>

      <Modal
        title="内容预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {previewContent && (
          <div>
            <h3>{previewContent.title}</h3>
            <div style={{ marginBottom: 16 }}>
              <Space>
                {getSourceTag(previewContent.source)}
                {getStatusTag(previewContent.status)}
                <Tag>评分: {previewContent.score.toFixed(1)}</Tag>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>关键词：</strong>
              {previewContent.keywords.map(keyword => (
                <Tag key={keyword}>{keyword}</Tag>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>原文链接：</strong>
              <a href={previewContent.url} target="_blank" rel="noopener noreferrer">
                {previewContent.url}
              </a>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>发布时间：</strong>
              {previewContent.publishDate}
            </div>
            <div>
              <strong>内容：</strong>
              <div style={{ 
                marginTop: 8, 
                padding: 16, 
                background: '#f5f5f5', 
                borderRadius: 4,
                maxHeight: 300,
                overflow: 'auto'
              }}>
                {previewContent.content}
              </div>
            </div>
            {previewContent.media && previewContent.media.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <strong>媒体文件：</strong>
                <div style={{ marginTop: 8 }}>
                  {previewContent.media.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`媒体 ${index + 1}`}
                      style={{ 
                        width: 100, 
                        height: 100, 
                        objectFit: 'cover', 
                        marginRight: 8,
                        borderRadius: 4
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ContentManagement