# TrendPublish

一个基于 AI 的趋势发现和内容发布系统，支持多源数据采集、智能总结和自动发布到微信公众号。本项目在原版 [ai-trend-publish](https://github.com/OpenAISpace/ai-trend-publish) 基础上进行二次开发，新增了可视化管理界面。

> 🌰 示例公众号：**AISPACE科技空间**


> 即刻关注，体验 AI 智能创作的内容～

## 🎯 二次开发说明

本项目基于原版 [TrendPublish](https://github.com/OpenAISpace/ai-trend-publish) 进行二次开发，主要增加了以下功能：

- 🖥️ **可视化管理界面** - 基于 React + Ant Design 的现代化 B 端管理系统
- 📊 **实时监控面板** - 系统状态、API 额度、发布统计等实时监控
- ⚙️ **配置管理** - 可视化的系统配置管理，无需手动编辑配置文件
- 📝 **内容管理** - 发布内容的查看、编辑和管理
- 🎨 **模板管理** - 可视化的模板编辑和预览功能
- 📈 **数据分析** - 发布历史、成功率统计等数据分析
- 🔧 **工作流管理** - 可视化的工作流配置和状态管理

### 管理界面预览

访问管理界面：`http://your-domain.com:3000`（开发环境）或 `http://your-domain.com`（生产环境）


## 🌟 主要功能

- 🤖 多源数据采集

  - Twitter/X 内容抓取
  - 网站内容抓取 (基于 FireCrawl)
  - 支持自定义数据源配置

- 🧠 AI 智能处理

  - 使用 DeepseekAI Together 千问 万象 讯飞 进行内容总结
  - 关键信息提取
  - 智能标题生成

- 📢 自动发布

  - 微信公众号文章发布
  - 自定义文章模板
  - 定时发布任务

- 📱 通知系统
  - Bark 通知集成
  - 任务执行状态通知
  - 错误告警

## 📝 文章模板

TrendPublish 提供了多种精美的文章模板。查看 [模板展示页面](https://openaispace.github.io/ai-trend-publish/templates.html) 了解更多详情。

## DONE
- [x] 微信公众号文章发布
- [x] 大模型每周排行榜
- [x] 热门AI相关仓库推荐
- [x] 添加通义千问（Qwen）支持
- [x] 支持多模型配置（如 DEEPSEEK_MODEL="deepseek-chat|deepseek-reasoner"）
- [x] 支持指定特定模型（如 AI_CONTENT_RANKER_LLM_PROVIDER="DEEPSEEK:deepseek-reasoner"）

## Todo
- [ ] 热门AI相关论文推荐
- [ ] 热门AI相关工具推荐
- [ ] FireCrawl 自动注册免费续期

## 优化项
 - [ ] 内容插入相关图片
 - [x] 内容去重
 - [ ] 降低AI率
 - [ ] 文章图片优化
 - [ ] ...

## 进阶
 - [ ] 提供exe可视化界面



## 🛠 技术栈

- **运行环境**: Node.js + TypeScript
- **AI 服务**: DeepseekAI Together 千问 万象 讯飞 
- **数据源**:
  - Twitter/X API
  - FireCrawl
- **定时任务**: node-cron
- **模板引擎**: EJS
- **开发工具**:
  - nodemon (热重载)
  - TypeScript
- **管理界面**:
  - React 18
  - Ant Design 5
  - TypeScript
  - Vite

## 🚀 快速开始

### 环境要求

- Node.js (v22+)
- npm
- MySQL 8.0+（可选，用于数据持久化）

### 安装

1. 克隆项目

```bash
git clone https://github.com/OpenAISpace/ai-trend-publish
cd ai-trend-publish
```

2. 安装后端依赖

```bash
npm install
```

3. 安装前端依赖

```bash
cd admin && npm install && cd ..
```

3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件配置必要的环境变量
```

4. 启动开发环境

```bash
# 启动后端服务
npm run start

# 新开终端，启动前端管理界面
cd admin
npm run dev
```

5. 访问管理界面

- 后端服务：http://localhost:8080
- 管理界面：http://localhost:3000

## ⚙️ 环境变量配置

在 `.env` 文件中配置以下必要的环境变量：

```bash
# ===================================
# 基础服务配置
# ===================================

# LLM 服务配置

# OpenAI API配置
OPENAI_BASE_URL="https://api.openai.com/v1"
OPENAI_API_KEY="your_api_key"
OPENAI_MODEL="gpt-3.5-turbo"

# DeepseekAI API配置 https://api-docs.deepseek.com/
DEEPSEEK_BASE_URL="https://api.deepseek.com/v1"
DEEPSEEK_API_KEY="your_api_key"
# 支持配置多个模型，使用 | 分隔
DEEPSEEK_MODEL="deepseek-chat|deepseek-reasoner"

# 讯飞API配置 https://www.xfyun.cn/
XUNFEI_API_KEY="your_api_key"

# 通义千问API配置 https://help.aliyun.com/zh/dashscope/developer-reference/api-details
QWEN_BASE_URL="https://dashscope.aliyuncs.com/api/v1"
QWEN_API_KEY="your_api_key"
QWEN_MODEL="qwen-max"

# 自定义LLM API配置（需要兼容OpenAI API格式）
CUSTOM_LLM_BASE_URL="your_api_base_url"
CUSTOM_LLM_API_KEY="your_api_key"
CUSTOM_LLM_MODEL="your_model_name"

# 默认使用的LLM提供者
# 可选值: OPENAI | DEEPSEEK | XUNFEI | QWEN | CUSTOM
# 也可以指定具体模型，格式为 "提供者:模型名称"，例如 "DEEPSEEK:deepseek-reasoner"
DEFAULT_LLM_PROVIDER="DEEPSEEK"

# ===================================
# 模块功能配置
# ===================================

# 注意：使用以下配置前，请确保已在上方正确配置了对应的 LLM 服务参数
# 内容排名和摘要模块LLM提供者配置
# 可选值: OPENAI | DEEPSEEK | XUNFEI | QWEN | CUSTOM
# 也可以指定具体模型，格式为 "提供者:模型名称"，例如 "DEEPSEEK:deepseek-reasoner"
AI_CONTENT_RANKER_LLM_PROVIDER="DEEPSEEK:deepseek-reasoner"
AI_SUMMARIZER_LLM_PROVIDER="DEEPSEEK"

# 模板配置
# 文章模板类型配置，可选值: default | modern | tech | mianpro | random
ARTICLE_TEMPLATE_TYPE="default"

# HelloGitHub模板类型配置，可选值: weixin | random
HELLOGITHUB_TEMPLATE_TYPE="default"

# AIBench模板类型配置，可选值: default | random
AIBENCH_TEMPLATE_TYPE="default"

# 文章数量配置
ARTICLE_NUM=10

# 数据存储配置
ENABLE_DB=true
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_DATABASE=trendfinder

# 微信公众号配置
WEIXIN_APP_ID="your_app_id"
WEIXIN_APP_SECRET="your_app_secret"

# 微信文章配置
NEED_OPEN_COMMENT=false
ONLY_FANS_CAN_COMMENT=false
AUTHOR="your_name"

# 数据抓取配置
# FireCrawl配置 https://www.firecrawl.dev/
FIRE_CRAWL_API_KEY="your_api_key"

# Twitter API配置 https://twitterapi.io/
X_API_BEARER_TOKEN="your_api_key"

# ===================================
# 其他通用配置
# ===================================

# 通知服务配置
ENABLE_BARK=false
BARK_URL="your_key"

```

## 🖥️ 管理界面使用

### 功能模块

1. **仪表盘** - 系统概览和关键指标监控
2. **工作流管理** - 创建、编辑和管理自动化工作流
3. **内容管理** - 查看和管理已发布的内容
4. **模板管理** - 自定义文章模板和样式
5. **数据源管理** - 配置和管理内容抓取源
6. **发布历史** - 查看发布记录和统计信息
7. **系统配置** - 可视化配置系统参数
8. **系统日志** - 实时查看系统运行日志

### 快速上手

1. **首次使用**：
   - 访问管理界面
   - 在"系统配置"中配置必要的 API 密钥
   - 在"数据源管理"中添加内容源
   - 在"工作流管理"中启动自动化任务

2. **日常管理**：
   - 通过仪表盘监控系统状态
   - 在"内容管理"中查看发布内容
   - 在"发布历史"中查看发布统计
   - 在"系统日志"中排查问题

### 界面特色

- 🎨 **现代化设计** - 基于 Ant Design 的企业级 UI 组件
- 📱 **响应式布局** - 完美适配桌面和移动设备
- 🌙 **主题支持** - 支持亮色和暗色主题切换
- 🔄 **实时更新** - 数据实时刷新，状态同步显示
- 🎯 **用户友好** - 直观的操作界面，降低使用门槛

## 📚 部署指南

详细的部署说明请参考 [部署文档](./DEPLOYMENT.md)，包含完整的生产环境部署步骤。

## ⚠️ 配置IP白名单

在使用微信公众号相关功能前,请先将本机IP添加到公众号后台的IP白名单中。

### 操作步骤

1. 查看本机IP: [IP查询工具](https://tool.lu/ip/)
2. 登录微信公众号后台,添加IP白名单

### 图文指南

<div align="center">
  <img src="https://oss.liuyaowen.cn/images/202503051122480.png" width="200" style="margin-right: 20px"/>
  <img src="https://oss.liuyaowen.cn/images/202503051122263.png" width="400" />
</div>

4. 启动项目

```bash
# 测试模式（仅后端）
npm run test

# 运行
npm run start

详细运行时间见 src\controllers\cron.ts
```

**管理界面启动：**

```bash
cd admin
npm run dev  # 开发模式
npm run build && npm run preview  # 生产模式
```

## 📦 部署指南

### 方式一：直接部署

1. 在服务器上安装 Node.js (v20+) 和 PM2

```bash
# 安装 PM2
npm install -g pm2
```

2. 构建项目

```bash
# 构建后端
npm run build

# 构建前端
cd admin && npm run build && cd ..
npm run build
```

3. 使用 PM2 启动服务

```bash
pm2 start dist/index.js --name ai-trend-publish

# 启动前端服务（可选，也可以用 Nginx 直接服务静态文件）
npm install -g serve
pm2 start "serve -s admin/dist -l 3000" --name ai-trend-publish-frontend
```

### 方式二：Docker 部署

1. 拉取代码

```bash
git clone https://github.com/OpenAISpace/ai-trend-publish.git
```

2. 构建 Docker 镜像：

```bash
# 构建镜像
docker build -t ai-trend-publsih .
```

4. 运行容器：

```bash
# 方式1：通过环境变量文件运行
docker run -d --env-file .env --name ai-trend-publsih-container ai-trend-publsih

# 方式2：直接指定环境变量运行
docker run -d \
  -e XXXX=XXXX \
  ...其他环境变量... \
  --name ai-trend-publsih-container \
  ai-trend-publsih
```

### CI/CD 自动部署

项目已配置 GitHub Actions 自动部署流程：


1. 推送代码到 main 分支会自动触发部署
2. 也可以在 GitHub Actions 页面手动触发部署
3. 确保在 GitHub Secrets 中配置以下环境变量：
   - `SERVER_HOST`: 服务器地址
   - `SERVER_USER`: 服务器用户名
   - `SSH_PRIVATE_KEY`: SSH 私钥
   - 其他必要的环境变量（参考 .env.example）

### 生产环境配置

生产环境建议使用 Nginx 作为反向代理：
- 后端服务：`proxy_pass http://localhost:8080`
- 前端静态文件：直接服务 `admin/dist` 目录

## 模板开发指南

本项目支持自定义模板开发，主要包含以下几个部分：

### 1. 了解数据结构

查看 `src/modules/render/interfaces` 目录下的类型定义文件，了解各个渲染模块需要的数据结构

### 2. 开发模板

在 `src/templates` 目录下按照对应模块开发 EJS 模板

### 3. 注册模板

在对应的渲染器类中注册新模板，如 `ArticleTemplateRenderer`：

### 4. 测试渲染效果

```
npx ts-node -r tsconfig-paths/register src\modules\render\test\test.weixin.template.ts
```

## 🔧 开发指南

### 项目结构

```
├── src/                 # 后端源码
├── admin/              # 前端管理界面
├── docs/               # 项目文档和展示页面
├── sql/                # 数据库脚本
└── DEPLOYMENT.md       # 部署文档
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## ❤️ 特别感谢

感谢以下贡献者对项目的支持：

<a href="https://github.com/kilimro">
  <img src="https://avatars.githubusercontent.com/u/52153481?v=4" width="50" height="50" alt="kilimro">
</a>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=OpenAISpace/ai-trend-publish&type=Date)](https://star-history.com/#OpenAISpace/ai-trend-publish&Date)

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件