import React, { useState, useMemo } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Badge, Button, Tooltip, theme as antdTheme, ConfigProvider } from 'antd'
import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  DatabaseOutlined,
  HistoryOutlined,
  FileDoneOutlined,
  UserOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  BulbOutlined,
  MoonOutlined,
  SunOutlined
} from '@ant-design/icons'
import Dashboard from './pages/Dashboard'
import WorkflowManagement from './pages/WorkflowManagement'
import ContentManagement from './pages/ContentManagement'
import TemplateManagement from './pages/TemplateManagement'
import DataSources from './pages/DataSources'
import PublishHistory from './pages/PublishHistory'
import ConfigManagement from './pages/ConfigManagement'
import SystemLogs from './pages/SystemLogs'
import './index.css'

const { Header, Sider, Content } = Layout
const { Title } = Typography

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/workflows', icon: <AppstoreOutlined />, label: '流程管理' },
  { key: '/content', icon: <FileTextOutlined />, label: '内容管理' },
  { key: '/templates', icon: <FileDoneOutlined />, label: '模板管理' },
  { key: '/data-sources', icon: <DatabaseOutlined />, label: '数据源' },
  { key: '/publish-history', icon: <HistoryOutlined />, label: '发布历史' },
  { key: '/config', icon: <SettingOutlined />, label: '配置管理' },
  { key: '/logs', icon: <BellOutlined />, label: '系统日志' }
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  const toggleTheme = () => {
    setDarkMode((prev) => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light')
      return !prev
    })
  }

  const themeConfig = useMemo(() => ({
    token: {
      colorPrimary: darkMode ? '#177ddc' : '#1890ff',
      colorBgBase: darkMode ? '#18181c' : '#f5f6fa',
      colorTextBase: darkMode ? '#e6e6e6' : '#222',
      borderRadius: 10,
      fontSize: 16
    },
    algorithm: darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm
  }), [darkMode])

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          style={{
            background: darkMode ? '#23232b' : '#fff',
            boxShadow: '2px 0 8px #00000010',
            transition: 'background 0.3s',
            zIndex: 100
          }}
        >
          <div style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'left',
            fontWeight: 700,
            fontSize: 22,
            color: darkMode ? '#fff' : '#222',
            letterSpacing: 1,
            paddingLeft: collapsed ? 0 : 24
          }}>
            {collapsed ? 'AI' : 'AI 趋势发布'}
          </div>
          <Menu
            theme={darkMode ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{
              borderRight: 0,
              background: 'transparent',
              fontWeight: 500,
              fontSize: 16
            }}
          />
        </Sider>
        <Layout>
          <Header style={{
            background: darkMode ? '#23232b' : '#fff',
            boxShadow: '0 2px 8px #00000010',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 99
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 20 }}
              />
              <Title level={4} style={{ margin: 0, color: darkMode ? '#fff' : '#222', fontWeight: 700 }}>
                {menuItems.find(i => i.key === location.pathname)?.label || 'AI趋势发布'}
              </Title>
            </div>
            <Space size="large">
              <Tooltip title={darkMode ? '切换为白天模式' : '切换为夜间模式'}>
                <Button
                  type="text"
                  icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggleTheme}
                  style={{ fontSize: 22 }}
                />
              </Tooltip>
              <Avatar icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #177ddc 0%, #1890ff 100%)' }} />
            </Space>
          </Header>
          <Content style={{
            margin: 0,
            minHeight: 'calc(100vh - 64px)',
            background: darkMode ? '#18181c' : '#f5f6fa',
            padding: 32,
            transition: 'background 0.3s'
          }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
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
    </ConfigProvider>
  )
}

export default App