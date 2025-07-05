import React, { useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Badge, Button, Tooltip } from 'antd'
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
  PictureOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
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
  const [isFullscreen, setIsFullscreen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // 处理退出登录
      console.log('退出登录')
    } else if (key === 'profile') {
      // 处理个人设置
      console.log('个人设置')
    }
  }

  return (
    <Layout className="page-enter">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
        width={256}
        collapsedWidth={80}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div className="logo">
          {collapsed ? 'TP' : 'TrendPublish'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            borderRight: 0,
            background: 'transparent'
          }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'margin-left 0.2s' }}>
        <Header style={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: collapsed ? 80 : 256,
          zIndex: 99,
          transition: 'left 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
              }}
            />
            <Title level={4} style={{ margin: 0, color: '#262626', flex: 1 }}>
              TrendPublish 智能内容发布系统
            </Title>
          </div>
          
          <Space size="large">
            <Tooltip title={isFullscreen ? '退出全屏' : '全屏显示'}>
              <Button
                type="text"
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
                style={{ fontSize: 16 }}
              />
            </Tooltip>
            
            <Badge count={3} size="small">
              <Tooltip title="系统通知">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  style={{ fontSize: 16 }}
                />
              </Tooltip>
            </Badge>
            
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: 8, transition: 'background 0.3s' }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>管理员</span>
                  <span style={{ fontSize: 12, color: '#8c8c8c' }}>超级管理员</span>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          marginTop: 64,
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto'
        }}>
          <div className="card-enter">
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
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App