import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  SettingOutlined,
  FileTextOutlined,
  CloudOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  PlayCircleOutlined,
  DatabaseOutlined,
  ApiOutlined,
  PictureOutlined
} from '@ant-design/icons'

import Dashboard from './pages/Dashboard'
import WorkflowManagement from './pages/WorkflowManagement'
import ContentManagement from './pages/ContentManagement'
import ConfigManagement from './pages/ConfigManagement'
import TemplateManagement from './pages/TemplateManagement'
import PublishHistory from './pages/PublishHistory'
import SystemLogs from './pages/SystemLogs'
import DataSources from './pages/DataSources'

const { Header, Sider, Content } = Layout
const { Title } = Typography

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '/workflows',
    icon: <PlayCircleOutlined />,
    label: '工作流管理',
  },
  {
    key: '/content',
    icon: <FileTextOutlined />,
    label: '内容管理',
  },
  {
    key: '/templates',
    icon: <PictureOutlined />,
    label: '模板管理',
  },
  {
    key: '/data-sources',
    icon: <DatabaseOutlined />,
    label: '数据源管理',
  },
  {
    key: '/publish-history',
    icon: <CloudOutlined />,
    label: '发布历史',
  },
  {
    key: '/config',
    icon: <SettingOutlined />,
    label: '系统配置',
  },
  {
    key: '/logs',
    icon: <BarChartOutlined />,
    label: '系统日志',
  },
]

const userMenuItems = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: '个人设置',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
]

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <Layout>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div className="logo">
          {collapsed ? 'TP' : 'TrendPublish'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => {
            window.location.href = key
          }}
        />
      </Sider>
      
      <Layout>
        <Header>
          <Title level={4} style={{ margin: 0, color: '#262626' }}>
            TrendPublish 管理系统
          </Title>
          
          <Space size="middle">
            <BellOutlined style={{ fontSize: 18, color: '#666' }} />
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => {
                  if (key === 'logout') {
                    // 处理退出登录
                    console.log('退出登录')
                  }
                }
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>管理员</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workflows" element={<WorkflowManagement />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/templates" element={<TemplateManagement />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/publish-history" element={<PublishHistory />} />
            <Route path="/config" element={<ConfigManagement />} />
            <Route path="/logs" element={<SystemLogs />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App