import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Progress, Timeline, Alert, Button, Space } from 'antd'
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined 
} from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState({
    status: 'running',
    uptime: '2天 14小时 32分钟',
    lastUpdate: '2024-01-15 14:30:00'
  })

  const [metrics, setMetrics] = useState({
    totalArticles: 1247,
    todayPublished: 12,
    successRate: 98.5,
    activeWorkflows: 3
  })

  const [recentActivities] = useState([
    {
      time: '14:30',
      title: '微信文章工作流执行完成',
      description: '成功发布 8 篇文章到微信公众号',
      status: 'success'
    },
    {
      time: '12:15',
      title: 'AI模型排行榜更新',
      description: 'DeepSeek-R1 登顶本周排行榜',
      status: 'info'
    },
    {
      time: '10:45',
      title: 'GitHub热门项目抓取',
      description: '发现 15 个新的AI相关热门项目',
      status: 'success'
    },
    {
      time: '09:20',
      title: 'FireCrawl API额度警告',
      description: '当前额度剩余不足20%，建议及时充值',
      status: 'warning'
    }
  ])

  const [chartData] = useState([
    { name: '周一', articles: 8, success: 8 },
    { name: '周二', articles: 12, success: 11 },
    { name: '周三', articles: 15, success: 14 },
    { name: '周四', articles: 10, success: 10 },
    { name: '周五', articles: 18, success: 17 },
    { name: '周六', articles: 14, success: 13 },
    { name: '周日', articles: 16, success: 16 }
  ])

  const handleSystemControl = (action: string) => {
    console.log(`执行系统操作: ${action}`)
    // 这里会调用后端API
  }

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Alert
            message="系统运行正常"
            description={`系统已稳定运行 ${systemStatus.uptime}，最后更新时间：${systemStatus.lastUpdate}`}
            type="success"
            showIcon
            action={
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
            }
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总发布文章"
              value={metrics.totalArticles}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日发布"
              value={metrics.todayPublished}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="成功率"
              value={metrics.successRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃工作流"
              value={metrics.activeWorkflows}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="发布趋势" extra={<Button size="small">查看详情</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="articles" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  name="总文章数"
                />
                <Line 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#52c41a" 
                  strokeWidth={2}
                  name="成功发布"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="最近活动" extra={<Button size="small">查看全部</Button>}>
            <Timeline
              items={recentActivities.map(activity => ({
                color: activity.status === 'success' ? 'green' : 
                       activity.status === 'warning' ? 'orange' : 'blue',
                children: (
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                      {activity.time} - {activity.title}
                    </div>
                    <div style={{ color: '#666', fontSize: 12 }}>
                      {activity.description}
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="系统资源使用">
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>CPU 使用率</div>
              <Progress percent={45} status="active" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>内存使用率</div>
              <Progress percent={68} status="active" />
            </div>
            <div>
              <div style={{ marginBottom: 8 }}>磁盘使用率</div>
              <Progress percent={32} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="API 额度监控">
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>DeepSeek API</div>
              <Progress percent={75} strokeColor="#52c41a" />
              <div style={{ fontSize: 12, color: '#666' }}>剩余: ¥45.60</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>FireCrawl API</div>
              <Progress percent={15} strokeColor="#faad14" />
              <div style={{ fontSize: 12, color: '#666' }}>剩余: 150 次调用</div>
            </div>
            <div>
              <div style={{ marginBottom: 8 }}>Twitter API</div>
              <Progress percent={60} strokeColor="#1890ff" />
              <div style={{ fontSize: 12, color: '#666' }}>剩余: 3000 次调用</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard