# 构建阶段
FROM docker.m.daocloud.io/library/node:20.18.0-alpine AS build-stage

# 设置工作目录
WORKDIR /app

# 设置 npm 镜像源为淘宝源
RUN npm config set registry https://registry.npmmirror.com

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建应用（添加 --skipLibCheck 选项）
RUN npm run build

# 生产阶段
FROM docker.m.daocloud.io/library/nginx:1.24-alpine AS production-stage

# 复制构建产物到 Nginx 目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 安装 curl 用于健康检查
RUN apk add --no-cache curl

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
