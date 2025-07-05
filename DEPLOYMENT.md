# TrendPublish 部署文档

## 目录
- [系统要求](#系统要求)
- [环境准备](#环境准备)
- [后端部署](#后端部署)
- [前端部署](#前端部署)
- [数据库配置](#数据库配置)
- [反向代理配置](#反向代理配置)
- [SSL证书配置](#ssl证书配置)
- [监控和日志](#监控和日志)
- [故障排除](#故障排除)

## 系统要求

### 硬件要求
- **CPU**: 2核心以上
- **内存**: 4GB以上（推荐8GB）
- **存储**: 20GB以上可用空间
- **网络**: 稳定的互联网连接

### 软件要求
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **Node.js**: v20.0.0+
- **MySQL**: 8.0+
- **Nginx**: 1.18+（可选，用于反向代理）
- **PM2**: 全局安装（用于进程管理）

## 环境准备

### 1. 安装 Node.js

```bash
# 使用 NodeSource 仓库安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 2. 安装 MySQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# 启动 MySQL 服务
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置
sudo mysql_secure_installation
```

### 3. 安装 PM2

```bash
npm install -g pm2
```

### 4. 安装 Nginx（可选）

```bash
sudo apt update
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 后端部署

### 1. 克隆项目

```bash
# 创建项目目录
sudo mkdir -p /opt/trendpublish
sudo chown $USER:$USER /opt/trendpublish
cd /opt/trendpublish

# 克隆代码
git clone https://github.com/OpenAISpace/ai-trend-publish.git .
```

### 2. 安装依赖

```bash
npm install --production
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置文件
nano .env
```

**重要配置项说明：**

```bash
# ===================================
# 基础服务配置
# ===================================

# DeepSeek API配置（推荐）
DEEPSEEK_BASE_URL="https://api.deepseek.com/v1"
DEEPSEEK_API_KEY="your_deepseek_api_key"
DEEPSEEK_MODEL="deepseek-chat|deepseek-reasoner"

# 默认LLM提供者
DEFAULT_LLM_PROVIDER="DEEPSEEK"

# ===================================
# 数据库配置
# ===================================
ENABLE_DB=true
DB_HOST=localhost
DB_PORT=3306
DB_USER=trendpublish
DB_PASSWORD=your_secure_password
DB_DATABASE=trendpublish

# ===================================
# 微信公众号配置
# ===================================
WEIXIN_APP_ID="your_weixin_app_id"
WEIXIN_APP_SECRET="your_weixin_app_secret"
AUTHOR="your_name"

# ===================================
# 数据抓取配置
# ===================================
FIRE_CRAWL_API_KEY="your_firecrawl_api_key"
X_API_BEARER_TOKEN="your_twitter_api_token"
```

### 4. 构建项目

```bash
npm run build
```

### 5. 使用 PM2 启动服务

```bash
# 启动后端服务
pm2 start dist/index.js --name trendpublish-backend

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

## 前端部署

### 1. 进入前端目录

```bash
cd /opt/trendpublish/admin
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
# 创建环境配置文件
cat > .env.production << EOF
VITE_API_BASE_URL=http://localhost:8080
EOF
```

### 4. 构建前端

```bash
npm run build
```

### 5. 使用 PM2 启动前端服务

```bash
# 安装 serve 用于静态文件服务
npm install -g serve

# 启动前端服务
pm2 start "serve -s dist -l 3000" --name trendpublish-frontend

# 保存配置
pm2 save
```

## 数据库配置

### 1. 创建数据库和用户

```sql
-- 登录 MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE trendpublish CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'trendpublish'@'localhost' IDENTIFIED BY 'your_secure_password';

-- 授权
GRANT ALL PRIVILEGES ON trendpublish.* TO 'trendpublish'@'localhost';
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

### 2. 导入数据库结构

```bash
# 导入配置表
mysql -u trendpublish -p trendpublish < sql/config.sql

# 导入数据源表
mysql -u trendpublish -p trendpublish < sql/cron_sources.sql
```

## 反向代理配置

### Nginx 配置

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/trendpublish
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 增加超时时间（用于长时间运行的任务）
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

启用站点：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/trendpublish /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## SSL证书配置

### 使用 Let's Encrypt

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 监控和日志

### 1. PM2 监控

```bash
# 查看进程状态
pm2 status

# 查看日志
pm2 logs

# 查看特定服务日志
pm2 logs trendpublish-backend

# 重启服务
pm2 restart trendpublish-backend

# 停止服务
pm2 stop trendpublish-backend
```

### 2. 系统监控

```bash
# 安装系统监控工具
sudo apt install htop iotop

# 查看系统资源使用
htop

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

### 3. 日志管理

```bash
# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 查看系统日志
sudo journalctl -u nginx -f
sudo journalctl -u mysql -f
```

## 故障排除

### 常见问题

#### 1. 后端服务无法启动

```bash
# 检查端口占用
sudo netstat -tlnp | grep :8080

# 检查环境变量
cat .env

# 查看详细错误日志
pm2 logs trendpublish-backend --lines 50
```

#### 2. 数据库连接失败

```bash
# 测试数据库连接
mysql -u trendpublish -p -h localhost trendpublish

# 检查 MySQL 服务状态
sudo systemctl status mysql

# 查看 MySQL 错误日志
sudo tail -f /var/log/mysql/error.log
```

#### 3. 前端页面无法访问

```bash
# 检查前端服务状态
pm2 status trendpublish-frontend

# 检查 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 4. API 调用失败

```bash
# 检查 API 密钥配置
grep -E "(API_KEY|TOKEN)" .env

# 测试网络连接
curl -I https://api.deepseek.com
curl -I https://api.firecrawl.dev
```

### 性能优化

#### 1. 数据库优化

```sql
-- 添加索引
CREATE INDEX idx_config_key ON config(key);
CREATE INDEX idx_cron_sources_type ON cron_sources(NewsType, NewsPlatform);
```

#### 2. 缓存配置

```bash
# 在 .env 中添加 Redis 配置（如果使用）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

#### 3. 日志轮转

```bash
# 配置 PM2 日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 备份和恢复

### 数据库备份

```bash
# 创建备份脚本
cat > /opt/trendpublish/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/trendpublish/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="trendpublish"
DB_USER="trendpublish"
DB_PASS="your_secure_password"

mkdir -p $BACKUP_DIR

# 数据库备份
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# 配置文件备份
cp .env $BACKUP_DIR/env_backup_$DATE

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "env_backup_*" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /opt/trendpublish/backup.sh

# 设置定时备份
crontab -e
# 添加：0 2 * * * /opt/trendpublish/backup.sh
```

### 恢复数据

```bash
# 恢复数据库
mysql -u trendpublish -p trendpublish < /opt/trendpublish/backups/db_backup_YYYYMMDD_HHMMSS.sql

# 恢复配置
cp /opt/trendpublish/backups/env_backup_YYYYMMDD_HHMMSS /opt/trendpublish/.env
```

## 更新部署

### 更新代码

```bash
cd /opt/trendpublish

# 备份当前版本
git stash

# 拉取最新代码
git pull origin main

# 安装新依赖
npm install --production

# 构建项目
npm run build

# 重启服务
pm2 restart trendpublish-backend

# 更新前端
cd admin
npm install
npm run build
pm2 restart trendpublish-frontend
```

## 安全建议

1. **定期更新系统和依赖包**
2. **使用强密码和密钥**
3. **配置防火墙规则**
4. **定期备份数据**
5. **监控系统日志**
6. **使用 HTTPS**
7. **限制数据库访问权限**

## 联系支持

如果在部署过程中遇到问题，可以：

1. 查看项目 [GitHub Issues](https://github.com/OpenAISpace/ai-trend-publish/issues)
2. 发送邮件至：liuyaowen_smile@126.com
3. 关注微信公众号：AISPACE科技空间

---

**部署完成后，访问 `http://your-domain.com` 即可使用 TrendPublish 管理系统！**