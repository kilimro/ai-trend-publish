import React, { useState, useEffect } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Progress, 
  Timeline, 
  Alert, 
  Button, 
  Space,
  Divider,
  Tag,
  Avatar,
  List,
  Typography
} from 'antd'
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  TrophyOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  HeartOutlined
} from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState({
    status: 'running',
    uptime: '2天 14小时 32分钟',
    lastUpdate: '2024-01-15 14:30:00',
    version: 'v1.2.3'
  })

  const [metrics, setMetrics] = useState({
    totalArticles: 1247,
    todayPublished: 12,
    successRate: 98.5,
    activeWorkflows: 3,
    totalViews: 45678,
    avgResponseTime: 1.2
  })

  const [recentActivities] = useState([
    {
      id: 1,
      time: '14:30',
      title: '微信文章工作流执行完成',
      description: '成功发布 8 篇文章到微信公众号',
      status: 'success',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      user: 'System'
    },
    {
      id: 2,
      time: '12:15',
      title: 'AI模型排行榜更新',
      description: 'DeepSeek-R1 登顶本周排行榜',
      status: 'info',
      icon: <TrophyOutlined style={{ color: '#1890ff' }} />,
      user: 'AI Engine'
    },
    {
      id: 3,
      time: '10:45',
      title: 'GitHub热门项目抓取',
      description: '发现 15 个新的AI相关热门项目',
      status: 'success',
      icon: <RocketOutlined style={{ color: '#52c41a' }} />,
      user: 'Crawler'
    },
    {
      id: 4,
      time: '09:20',
      title: 'FireCrawl API额度警告',
      description: '当前额度剩余不足20%，建议及时充值',
      status: 'warning',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      user: 'Monitor'
    }
  ])

  const [chartData] = useState([
    { name: '周一', articles: 8, success: 8, views: 1200 },
    { name: '周二', articles: 12, success: 11, views: 1800 },
    { name: '周三', articles: 15, success: 14, views: 2200 },
    { name: '周四', articles: 10, success: 10, views: 1500 },
    { name: '周五', articles: 18, success: 17, views: 2800 },
    { name: '周六', articles: 14, success: 13, views: 2100 },
    { name: '周日', articles: 16, success: 16, views: 2400 }
  ])

  const [pieData] = useState([
    { name: '微信公众号', value: 65, color: '#52c41a' },
    { name: '其他平台', value: 25, color: '#1890ff' },
    { name: '草稿箱', value: 10, color: '#faad14' }
  ])

  const [apiQuotas] = useState([
    { name: 'DeepSeek API', used: 75, total: 100, color: '#52c41a', amount: '¥45.60' },
    { name: 'FireCrawl API', used: 85, total: 100, color: '#faad14', amount: '150 次' },
    { name: 'Twitter API', used: 40, total: 100, color: '#1890ff', amount: '3000 次' },
    { name: '阿里云 API', used: 30, total: 100, color: '#722ed1', amount: '¥28.90' }
  ])

  const handleSystemControl = (action: string) => {
    console.log(`执行系统操作: ${action}`)
    // 这里会调用后端API
  }

  const MetricCard = ({ title, value, prefix, suffix, trend, color, icon }: any) => (
    <Card 
      hoverable
      style={{ 
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`,
        borderRadius: 12
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>{title}</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: 700, color }}>
              {prefix}{value}{suffix}
            </Text>
            {trend && (
              <Tag color={trend > 0 ? 'success' : 'error'} style={{ margin: 0 }}>
                {trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(trend)}%
              </Tag>
            )}
          </div>
        </div>
        <div style={{ 
          fontSize: 32, 
          color: `${color}60`,
          background: `${color}10`,
          padding: 16,
          borderRadius: 12
        }}>
          {icon}
        </div>
      </div>
    </Card>
  )

  return (
    <div style={{ padding: '0 4px' }}>
      {/* 系统状态横幅 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Alert
            message={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      background: '#52c41a',
                      animation: 'pulse 2s infinite'
                    }} />
                    <Text strong>系统运行正常</Text>
                  </div>
                  <Divider type="vertical" />
                  <Text type="secondary">运行时间: {systemStatus.uptime}</Text>
                  <Divider type="vertical" />
                  <Text type="secondary">版本: {systemStatus.version}</Text>
                  <Divider type="vertical" />
                  <Text type="secondary">最后更新: {systemStatus.lastUpdate}</Text>
                </div>
                <Space>
                  <Button 
                    size="small" 
                    icon={<ReloadOutlined />}
                    onClick={() => handleSystemControl('refresh')}
                  >
                    刷新状态
                  </Button>
                  <Button 
                    size="small" 
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleSystemControl('restart')}
                  >
                    重启系统
                  </Button>
                </Space>
              </div>
            }
            type="success"
            style={{ 
              borderRadius: 12,
              border: '1px solid #b7eb8f',
              background: 'linear-gradient(135deg, #f6ffed, #d9f7be)'
            }}
          />
        </Col>
      </Row>

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="总发布文章"
            value={metrics.totalArticles.toLocaleString()}
            trend={12}
            color="#1890ff"
            icon={<FileOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="今日发布"
            value={metrics.todayPublished}
            trend={8}
            color="#52c41a"
            icon={<ThunderboltOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="成功率"
            value={metrics.successRate}
            suffix="%"
            trend={2.1}
            color="#722ed1"
            icon={<TrophyOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="总阅读量"
            value={(metrics.totalViews / 1000).toFixed(1)}
            suffix="K"
            trend={15}
            color="#fa8c16"
            icon={<FireOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* 发布趋势图表 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChartOutlined style={{ color: '#1890ff' }} />
                <span>发布趋势分析</span>
              </div>
            }
            extra={
              <Space>
                <Tag color="blue">近7天</Tag>
                <Button size="small" type="link">查看详情</Button>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#8c8c8c" />
                <YAxis stroke="#8c8c8c" />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: 8, 
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="articles" 
                  stroke="#1890ff" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorArticles)"
                  name="发布文章"
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#52c41a" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  name="阅读量"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 发布平台分布 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PieChartOutlined style={{ color: '#52c41a' }} />
                <span>发布平台分布</span>
              </div>
            }
            style={{ borderRadius: 12 }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16 }}>
              {pieData.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
                    <Text>{item.name}</Text>
                  </div>
                  <Text strong>{item.value}%</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ClockCircleOutlined style={{ color: '#faad14' }} />
                <span>最近活动</span>
              </div>
            }
            extra={<Button size="small" type="link">查看全部</Button>}
            style={{ borderRadius: 12 }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: '12px 0', border: 'none' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={item.icon} 
                        style={{ 
                          background: 'transparent',
                          border: 'none'
                        }}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 14 }}>{item.title}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>{item.description}</Text>
                        <div style={{ marginTop: 4 }}>
                          <Tag size="small" color="blue">{item.user}</Tag>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* API 额度监控 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ApiOutlined style={{ color: '#722ed1' }} />
                <span>API 额度监控</span>
              </div>
            }
            extra={<Button size="small" type="link">管理配置</Button>}
            style={{ borderRadius: 12 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {apiQuotas.map((quota, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 14 }}>{quota.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>剩余: {quota.amount}</Text>
                  </div>
                  <Progress 
                    percent={quota.used} 
                    strokeColor={{
                      '0%': quota.color,
                      '100%': quota.color + '80',
                    }}
                    trailColor="#f5f5f5"
                    strokeWidth={8}
                    style={{ marginBottom: 4 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>已使用 {quota.used}%</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {quota.used >= 80 ? '⚠️ 额度不足' : '✅ 正常'}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 系统资源监控 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MonitorOutlined style={{ color: '#1890ff' }} />
                <span>系统资源</span>
              </div>
            }
            style={{ borderRadius: 12 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>CPU 使用率</Text>
                  <Text strong>45%</Text>
                </div>
                <Progress percent={45} strokeColor="#1890ff" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>内存使用率</Text>
                  <Text strong>68%</Text>
                </div>
                <Progress percent={68} strokeColor="#52c41a" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>磁盘使用率</Text>
                  <Text strong>32%</Text>
                </div>
                <Progress percent={32} strokeColor="#faad14" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SettingOutlined style={{ color: '#52c41a' }} />
                <span>工作流状态</span>
              </div>
            }
            style={{ borderRadius: 12 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { name: '微信文章工作流', status: 'running', nextRun: '明天 03:00' },
                { name: 'AI排行榜工作流', status: 'running', nextRun: '周二 03:00' },
                { name: 'GitHub项目工作流', status: 'stopped', nextRun: '已暂停' }
              ].map((workflow, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: 12,
                  background: '#fafafa',
                  borderRadius: 8
                }}>
                  <div>
                    <Text strong style={{ fontSize: 14 }}>{workflow.name}</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>下次运行: {workflow.nextRun}</Text>
                    </div>
                  </div>
                  <Tag color={workflow.status === 'running' ? 'success' : 'default'}>
                    {workflow.status === 'running' ? '运行中' : '已停止'}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HeartOutlined style={{ color: '#ff4d4f' }} />
                <span>系统健康度</span>
              </div>
            }
            style={{ borderRadius: 12 }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%',
                background: 'conic-gradient(#52c41a 0deg 324deg, #f0f0f0 324deg 360deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                position: 'relative'
              }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#52c41a'
                }}>
                  90%
                </div>
              </div>
              <Title level={4} style={{ margin: 0, color: '#52c41a' }}>优秀</Title>
              <Text type="secondary">系统运行状态良好</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard