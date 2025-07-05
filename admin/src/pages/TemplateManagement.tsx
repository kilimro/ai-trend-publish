import React, { useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select,
  Upload,
  message,
  Popconfirm,
  Tag
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined,
  CopyOutlined
} from '@ant-design/icons'
import Editor from '@monaco-editor/react'

const { Option } = Select
const { TextArea } = Input

interface Template {
  id: string
  name: string
  type: 'article' | 'aibench' | 'hellogithub'
  description: string
  preview: string
  content: string
  isDefault: boolean
}

const TemplateManagement: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: '默认文章模板',
      type: 'article',
      description: '简洁大方的文章模板，适合各类内容',
      preview: 'https://oss.liuyaowen.cn/images/202503051143589.png',
      content: '<div>默认模板内容...</div>',
      isDefault: true
    },
    {
      id: '2',
      name: '现代风格模板',
      type: 'article',
      description: '时尚现代的设计风格，适合科技类文章',
      preview: 'https://oss.liuyaowen.cn/images/202503051144321.png',
      content: '<div>现代模板内容...</div>',
      isDefault: false
    },
    {
      id: '3',
      name: '技术专栏模板',
      type: 'article',
      description: '专为技术文章定制的排版样式',
      preview: 'https://oss.liuyaowen.cn/images/202503051144824.png',
      content: '<div>技术模板内容...</div>',
      isDefault: false
    },
    {
      id: '4',
      name: 'AI排行榜模板',
      type: 'aibench',
      description: '大模型性能排行榜展示模板',
      preview: 'https://oss.liuyaowen.cn/images/202503081200663.png',
      content: '<div>排行榜模板内容...</div>',
      isDefault: true
    },
    {
      id: '5',
      name: 'GitHub项目模板',
      type: 'hellogithub',
      description: 'GitHub热门项目展示模板',
      preview: 'https://oss.liuyaowen.cn/images/202503081200433.png',
      content: '<div>GitHub模板内容...</div>',
      isDefault: true
    }
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [form] = Form.useForm()

  const templateTypes = [
    { value: 'article', label: '文章模板' },
    { value: 'aibench', label: 'AI排行榜模板' },
    { value: 'hellogithub', label: 'GitHub项目模板' }
  ]

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    form.setFieldsValue(template)
    setIsModalVisible(true)
  }

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template)
    setIsPreviewVisible(true)
  }

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id))
    message.success('模板已删除')
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingTemplate) {
        setTemplates(prev => prev.map(template =>
          template.id === editingTemplate.id
            ? { ...template, ...values }
            : template
        ))
        message.success('模板已更新')
      } else {
        const newTemplate: Template = {
          id: Date.now().toString(),
          ...values,
          isDefault: false
        }
        setTemplates(prev => [...prev, newTemplate])
        message.success('模板已创建')
      }
      
      setIsModalVisible(false)
      setEditingTemplate(null)
      form.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const handleCopy = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} - 副本`,
      isDefault: false
    }
    setTemplates(prev => [...prev, newTemplate])
    message.success('模板已复制')
  }

  const handleSetDefault = (id: string, type: string) => {
    setTemplates(prev => prev.map(template => ({
      ...template,
      isDefault: template.id === id && template.type === type
    })))
    message.success('已设置为默认模板')
  }

  const getTypeTag = (type: string) => {
    const typeConfig = {
      article: { color: 'blue', text: '文章模板' },
      aibench: { color: 'green', text: 'AI排行榜' },
      hellogithub: { color: 'orange', text: 'GitHub项目' }
    }
    const config = typeConfig[type as keyof typeof typeConfig]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.type]) {
      acc[template.type] = []
    }
    acc[template.type].push(template)
    return acc
  }, {} as Record<string, Template[]>)

  return (
    <div>
      <Card
        title="模板管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTemplate(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            新建模板
          </Button>
        }
      >
        {Object.entries(groupedTemplates).map(([type, typeTemplates]) => (
          <div key={type} style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16 }}>
              {templateTypes.find(t => t.value === type)?.label}
            </h3>
            <Row gutter={[16, 16]}>
              {typeTemplates.map(template => (
                <Col xs={24} sm={12} lg={8} xl={6} key={template.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={template.name}
                        src={template.preview}
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    }
                    actions={[
                      <EyeOutlined key="preview" onClick={() => handlePreview(template)} />,
                      <EditOutlined key="edit" onClick={() => handleEdit(template)} />,
                      <CopyOutlined key="copy" onClick={() => handleCopy(template)} />,
                      <Popconfirm
                        title="确定要删除这个模板吗？"
                        onConfirm={() => handleDelete(template.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <DeleteOutlined key="delete" />
                      </Popconfirm>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {template.name}
                          {template.isDefault && <Tag color="gold">默认</Tag>}
                        </div>
                      }
                      description={template.description}
                    />
                    <div style={{ marginTop: 12 }}>
                      {getTypeTag(template.type)}
                      {!template.isDefault && (
                        <Button
                          size="small"
                          type="link"
                          onClick={() => handleSetDefault(template.id, template.type)}
                        >
                          设为默认
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Card>

      <Modal
        title={editingTemplate ? '编辑模板' : '新建模板'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingTemplate(null)
          form.resetFields()
        }}
        width={1000}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="模板名称"
                rules={[{ required: true, message: '请输入模板名称' }]}
              >
                <Input placeholder="请输入模板名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="模板类型"
                rules={[{ required: true, message: '请选择模板类型' }]}
              >
                <Select placeholder="请选择模板类型">
                  {templateTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="模板描述"
          >
            <TextArea rows={2} placeholder="请输入模板描述" />
          </Form.Item>

          <Form.Item
            name="preview"
            label="预览图URL"
          >
            <Input placeholder="请输入预览图URL" />
          </Form.Item>

          <Form.Item
            name="content"
            label="模板内容"
            rules={[{ required: true, message: '请输入模板内容' }]}
          >
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <Editor
                height="400px"
                defaultLanguage="html"
                value={form.getFieldValue('content')}
                onChange={(value) => form.setFieldsValue({ content: value })}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14
                }}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="模板预览"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={1200}
        style={{ top: 20 }}
      >
        {previewTemplate && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>{previewTemplate.name}</h3>
              <p>{previewTemplate.description}</p>
              {getTypeTag(previewTemplate.type)}
            </div>
            <div style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: 6,
              height: 600,
              overflow: 'auto'
            }}>
              <Editor
                height="100%"
                defaultLanguage="html"
                value={previewTemplate.content}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TemplateManagement