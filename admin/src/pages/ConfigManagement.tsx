import React, { useState } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Select, 
  InputNumber,
  message,
  Tabs,
  Space,
  Alert,
  Divider
} from 'antd'
import { SaveOutlined, ReloadOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

const ConfigManagement: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      console.log('保存配置:', values)
      // 这里会调用后端API保存配置
      message.success('配置已保存')
    } catch (error) {
      console.error('保存配置失败:', error)
      message.error('保存配置失败')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    form.resetFields()
    message.info('配置已重置')
  }

  const SecretInput: React.FC<{ field: string; placeholder: string }> = ({ field, placeholder }) => (
    <Input.Password
      placeholder={placeholder}
      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
    />
  )

  return (
    <div>
      <Card
        title="系统配置"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              loading={loading}
              onClick={handleSave}
            >
              保存配置
            </Button>
          </Space>
        }
      >
        <Alert
          message="配置说明"
          description="修改配置后需要重启系统才能生效。请确保API密钥的正确性，错误的配置可能导致系统无法正常工作。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            // LLM配置
            DEFAULT_LLM_PROVIDER: 'DEEPSEEK',
            OPENAI_BASE_URL: 'https://api.openai.com/v1',
            OPENAI_MODEL: 'gpt-3.5-turbo',
            DEEPSEEK_BASE_URL: 'https://api.deepseek.com/v1',
            DEEPSEEK_MODEL: 'deepseek-chat',
            QWEN_BASE_URL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            QWEN_MODEL: 'qwen-max',
            
            // 模块配置
            AI_CONTENT_RANKER_LLM_PROVIDER: 'DEEPSEEK:deepseek-reasoner',
            AI_SUMMARIZER_LLM_PROVIDER: 'QWEN:qwen-max',
            ARTICLE_TEMPLATE_TYPE: 'default',
            ARTICLE_NUM: 10,
            
            // 微信配置
            NEED_OPEN_COMMENT: false,
            ONLY_FANS_CAN_COMMENT: false,
            AUTHOR: 'AI助手',
            
            // 数据库配置
            ENABLE_DB: true,
            DB_HOST: 'localhost',
            DB_PORT: 3306,
            DB_USER: 'root',
            DB_DATABASE: 'trendfinder',
            
            // 通知配置
            ENABLE_BARK: false
          }}
        >
          <Tabs defaultActiveKey="llm">
            <TabPane tab="LLM配置" key="llm">
              <Form.Item
                name="DEFAULT_LLM_PROVIDER"
                label="默认LLM提供者"
                rules={[{ required: true, message: '请选择默认LLM提供者' }]}
              >
                <Select>
                  <Option value="OPENAI">OpenAI</Option>
                  <Option value="DEEPSEEK">DeepSeek</Option>
                  <Option value="QWEN">通义千问</Option>
                  <Option value="XUNFEI">讯飞星火</Option>
                  <Option value="CUSTOM">自定义</Option>
                </Select>
              </Form.Item>

              <Divider orientation="left">OpenAI 配置</Divider>
              <Form.Item name="OPENAI_BASE_URL" label="OpenAI API地址">
                <Input placeholder="https://api.openai.com/v1" />
              </Form.Item>
              <Form.Item name="OPENAI_API_KEY" label="OpenAI API密钥">
                <SecretInput field="OPENAI_API_KEY" placeholder="sk-..." />
              </Form.Item>
              <Form.Item name="OPENAI_MODEL" label="OpenAI模型">
                <Input placeholder="gpt-3.5-turbo" />
              </Form.Item>

              <Divider orientation="left">DeepSeek 配置</Divider>
              <Form.Item name="DEEPSEEK_BASE_URL" label="DeepSeek API地址">
                <Input placeholder="https://api.deepseek.com/v1" />
              </Form.Item>
              <Form.Item name="DEEPSEEK_API_KEY" label="DeepSeek API密钥">
                <SecretInput field="DEEPSEEK_API_KEY" placeholder="sk-..." />
              </Form.Item>
              <Form.Item name="DEEPSEEK_MODEL" label="DeepSeek模型">
                <Input placeholder="deepseek-chat|deepseek-reasoner" />
              </Form.Item>

              <Divider orientation="left">通义千问 配置</Divider>
              <Form.Item name="QWEN_BASE_URL" label="千问 API地址">
                <Input placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1" />
              </Form.Item>
              <Form.Item name="QWEN_API_KEY" label="千问 API密钥">
                <SecretInput field="QWEN_API_KEY" placeholder="sk-..." />
              </Form.Item>
              <Form.Item name="QWEN_MODEL" label="千问模型">
                <Input placeholder="qwen-max" />
              </Form.Item>

              <Divider orientation="left">讯飞星火 配置</Divider>
              <Form.Item name="XUNFEI_API_KEY" label="讯飞 API密钥">
                <SecretInput field="XUNFEI_API_KEY" placeholder="..." />
              </Form.Item>
            </TabPane>

            <TabPane tab="模块配置" key="modules">
              <Form.Item
                name="AI_CONTENT_RANKER_LLM_PROVIDER"
                label="内容排名模块LLM提供者"
              >
                <Input placeholder="DEEPSEEK:deepseek-reasoner" />
              </Form.Item>

              <Form.Item
                name="AI_SUMMARIZER_LLM_PROVIDER"
                label="内容摘要模块LLM提供者"
              >
                <Input placeholder="QWEN:qwen-max" />
              </Form.Item>

              <Form.Item
                name="ARTICLE_TEMPLATE_TYPE"
                label="文章模板类型"
              >
                <Select>
                  <Option value="default">默认模板</Option>
                  <Option value="modern">现代风格</Option>
                  <Option value="tech">技术专栏</Option>
                  <Option value="mianpro">Mianpro风格</Option>
                  <Option value="random">随机选择</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="ARTICLE_NUM"
                label="文章数量"
                rules={[{ required: true, message: '请输入文章数量' }]}
              >
                <InputNumber min={1} max={50} />
              </Form.Item>
            </TabPane>

            <TabPane tab="微信配置" key="weixin">
              <Form.Item name="WEIXIN_APP_ID" label="微信公众号AppID">
                <Input placeholder="wx..." />
              </Form.Item>

              <Form.Item name="WEIXIN_APP_SECRET" label="微信公众号AppSecret">
                <SecretInput field="WEIXIN_APP_SECRET" placeholder="..." />
              </Form.Item>

              <Form.Item name="AUTHOR" label="作者名称">
                <Input placeholder="AI助手" />
              </Form.Item>

              <Form.Item name="NEED_OPEN_COMMENT" label="开启评论" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="ONLY_FANS_CAN_COMMENT" label="仅粉丝可评论" valuePropName="checked">
                <Switch />
              </Form.Item>
            </TabPane>

            <TabPane tab="数据源配置" key="datasource">
              <Form.Item name="FIRE_CRAWL_API_KEY" label="FireCrawl API密钥">
                <SecretInput field="FIRE_CRAWL_API_KEY" placeholder="fc-..." />
              </Form.Item>

              <Form.Item name="X_API_BEARER_TOKEN" label="Twitter API Token">
                <SecretInput field="X_API_BEARER_TOKEN" placeholder="..." />
              </Form.Item>

              <Form.Item name="DASHSCOPE_API_KEY" label="阿里云API密钥">
                <SecretInput field="DASHSCOPE_API_KEY" placeholder="sk-..." />
              </Form.Item>
            </TabPane>

            <TabPane tab="数据库配置" key="database">
              <Form.Item name="ENABLE_DB" label="启用数据库" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="DB_HOST" label="数据库主机">
                <Input placeholder="localhost" />
              </Form.Item>

              <Form.Item name="DB_PORT" label="数据库端口">
                <InputNumber min={1} max={65535} />
              </Form.Item>

              <Form.Item name="DB_USER" label="数据库用户名">
                <Input placeholder="root" />
              </Form.Item>

              <Form.Item name="DB_PASSWORD" label="数据库密码">
                <SecretInput field="DB_PASSWORD" placeholder="..." />
              </Form.Item>

              <Form.Item name="DB_DATABASE" label="数据库名称">
                <Input placeholder="trendfinder" />
              </Form.Item>
            </TabPane>

            <TabPane tab="通知配置" key="notification">
              <Form.Item name="ENABLE_BARK" label="启用Bark通知" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="BARK_URL" label="Bark通知URL">
                <Input placeholder="https://api.day.app/your_key" />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Card>
    </div>
  )
}

export default ConfigManagement