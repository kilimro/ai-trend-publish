import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Select, 
  Button, 
  Space, 
  DatePicker, 
  Input,
  Switch,
  Tag,
  Tooltip
} from 'antd'
import { 
  ReloadOutlined, 
  DownloadOutlined, 
  ClearOutlined,
  PauseOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Option } = Select
const { RangePicker } = DatePicker
const { Search } = Input

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  module: string
  message: string
  details?: any
}

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2024-01-15 14:30:25',
      level: 'info',
      module: 'WeixinWorkflow',
      message: '工作流执行完成，成功发布 8 篇文章',
      details: { articleCount: 8, successCount: 8 }
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:30:20',
      level: 'info',
      module: 'WeixinPublisher',
      message: '文章发布到微信公众号成功',
      details: { mediaId: 'SwCSRjrdGJNaWioRQUHzgF68BHFkSlb_f5xlTquvsOSA6Yy0ZRjFo0aW9eS3JJu_' }
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:30:15',
      level: 'info',
      module: 'WeixinArticleTemplateRenderer',
      message: '模板渲染完成',
      details: { templateType: 'default' }
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:30:10',
      level: 'info',
      module: 'AISummarizer',
      message: '内容摘要生成完成',
      details: { processedCount: 8 }
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:30:05',
      level: 'info',
      module: 'ContentRanker',
      message: '内容排序完成，筛选出 8 条高质量内容',
      details: { totalCount: 15, selectedCount: 8 }
    },
    {
      id: '6',
      timestamp: '2024-01-15 14:30:00',
      level: 'info',
      module: 'WeixinWorkflow',
      message: '开始执行微信工作流'
    },
    {
      id: '7',
      timestamp: '2024-01-15 12:15:30',
      level: 'warn',
      module: 'FireCrawlScraper',
      message: 'FireCrawl API额度剩余不足20%',
      details: { remainingCalls: 150 }
    },
    {
      id: '8',
      timestamp: '2024-01-15 10:45:15',
      level: 'error',
      module: 'TwitterScraper',
      message: 'Twitter API调用失败',
      details: { error: 'Rate limit exceeded', retryAfter: 900 }
    },
    {
      id: '9',
      timestamp: '2024-01-15 09:20:00',
      level: 'debug',
      module: 'ConfigManager',
      message: '配置刷新完成',
      details: { configSources: 2 }
    }
  ])

  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(logs)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [filters, setFilters] = useState({
    level: '',
    module: '',
    search: '',
    dateRange: null as any
  })

  const logLevels = [
    { value: 'debug', label: 'Debug', color: '#666' },
    { value: 'info', label: 'Info', color: '#1890ff' },
    { value: 'warn', label: 'Warning', color: '#faad14' },
    { value: 'error', label: 'Error', color: '#ff4d4f' }
  ]

  const modules = [
    'WeixinWorkflow',
    'WeixinPublisher',
    'WeixinArticleTemplateRenderer',
    'AISummarizer',
    'ContentRanker',
    'FireCrawlScraper',
    'TwitterScraper',
    'ConfigManager'
  ]

  useEffect(() => {
    let filtered = logs

    if (filters.level) {
      filtered = filtered.filter(log => log.level === filters.level)
    }

    if (filters.module) {
      filtered = filtered.filter(log => log.module === filters.module)
    }

    if (filters.search) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.module.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange
      filtered = filtered.filter(log => {
        const logTime = dayjs(log.timestamp)
        return logTime.isAfter(start) && logTime.isBefore(end)
      })
    }

    setFilteredLogs(filtered)
  }, [logs, filters])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // 模拟新日志
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        level: ['info', 'warn', 'error', 'debug'][Math.floor(Math.random() * 4)] as any,
        module: modules[Math.floor(Math.random() * modules.length)],
        message: '系统运行正常，定期检查完成'
      }
      setLogs(prev => [newLog, ...prev.slice(0, 99)]) // 保持最新100条
    }, 10000) // 每10秒添加一条新日志

    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleClearLogs = () => {
    setLogs([])
    setFilteredLogs([])
  }

  const handleExportLogs = () => {
    const logText = filteredLogs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.module}] ${log.message}`
    ).join('\n')
    
    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-logs-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getLevelTag = (level: string) => {
    const levelConfig = logLevels.find(l => l.value === level)
    return (
      <Tag color={levelConfig?.color} style={{ minWidth: 60, textAlign: 'center' }}>
        {levelConfig?.label.toUpperCase()}
      </Tag>
    )
  }

  const getModuleTag = (module: string) => {
    return <Tag color="blue">{module}</Tag>
  }

  return (
    <div>
      <Card
        title="系统日志"
        extra={
          <Space>
            <Tooltip title={autoRefresh ? '暂停自动刷新' : '开启自动刷新'}>
              <Button
                icon={autoRefresh ? <PauseOutlined /> : <PlayCircleOutlined />}
                onClick={() => setAutoRefresh(!autoRefresh)}
                type={autoRefresh ? 'primary' : 'default'}
              >
                {autoRefresh ? '暂停' : '开始'}
              </Button>
            </Tooltip>
            <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
              刷新
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportLogs}>
              导出
            </Button>
            <Button icon={<ClearOutlined />} danger onClick={handleClearLogs}>
              清空
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search
              placeholder="搜索日志内容"
              style={{ width: 250 }}
              onSearch={(value) => setFilters(prev => ({ ...prev, search: value }))}
              allowClear
            />
            <Select
              placeholder="选择日志级别"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, level: value || '' }))}
            >
              {logLevels.map(level => (
                <Option key={level.value} value={level.value}>
                  {level.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="选择模块"
              style={{ width: 200 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, module: value || '' }))}
            >
              {modules.map(module => (
                <Option key={module} value={module}>
                  {module}
                </Option>
              ))}
            </Select>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              showTime
              onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
            />
            <div style={{ color: '#666', fontSize: 14 }}>
              共 {filteredLogs.length} 条日志
            </div>
          </Space>
        </div>

        <div className="log-container">
          {filteredLogs.map(log => (
            <div key={log.id} className="log-line">
              <span className="log-timestamp">[{log.timestamp}]</span>
              <span style={{ marginRight: 8 }}>
                {getLevelTag(log.level)}
              </span>
              <span style={{ marginRight: 8 }}>
                {getModuleTag(log.module)}
              </span>
              <span>{log.message}</span>
              {log.details && (
                <div style={{ 
                  marginLeft: 200, 
                  marginTop: 4, 
                  color: '#888', 
                  fontSize: 11,
                  fontFamily: 'monospace'
                }}>
                  {JSON.stringify(log.details, null, 2)}
                </div>
              )}
            </div>
          ))}
          
          {filteredLogs.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: 40 }}>
              暂无日志数据
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default SystemLogs