# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


# MyApp 前端项目

基于 Vue 3 + TypeScript + Vite + Element Plus 的前端项目，用于演示 Redis 各种数据类型的使用场景。

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- TypeScript - JavaScript 的超集
- Vite - 下一代前端构建工具
- Element Plus - 基于 Vue 3 的组件库
- Vue Router - Vue.js 的官方路由
- Axios - 基于 promise 的 HTTP 客户端

## 项目结构

- src/views/redis/LockDemo.vue - 分布式锁示例
- src/views/redis/StringDemo.vue - 字符串示例
- src/views/redis/ListDemo.vue - 列表示例
- src/views/redis/SetDemo.vue - 集合示例
- src/views/redis/HashDemo.vue - 哈希示例
- src/views/redis/ZSetDemo.vue - 有序集合示例


myapp-ui/
├── src/
│ ├── api/ # API 接口
│ │ └── redis.ts # Redis相关接口
│ ├── router/ # 路由配置
│ ├── utils/ # 工具函数
│ │ └── request.ts # axios封装
│ ├── views/ # 页面组件
│ │ ├── redis/ # Redis示例页面
│ │ │ ├── StringDemo.vue # String类型示例
│ │ │ ├── ListDemo.vue # List类型示例
│ │ │ ├── HashDemo.vue # Hash类型示例
│ │ │ ├── SetDemo.vue # Set类型示例
│ │ │ ├── ZSetDemo.vue # ZSet类型示例
│ │ │ └── LockDemo.vue # 分布式锁示例
│ │ └── trade/ # 交易记录页面
│ ├── App.vue # 根组件
│ └── main.ts # 入口文件
├── .env.development # 开发环境配置
├── .env.production # 生产环境配置
├── nginx.conf # Nginx配置
├── vite.config.ts # Vite配置
└── package.json # 项目依赖




bash
安装依赖
npm install
启动开发服务器
npm run dev
构建生产版本
npm run build
bash

## Docker 部署

1. 构建镜像

bash
docker build -t myapp-ui .
bash
开发环境
docker run -d -p 80:80 --name myapp-ui \
-e VITE_API_BASE_URL=http://localhost:8080 \
myapp-ui
生产环境
docker run -d -p 80:80 --name myapp-ui \
-e VITE_API_BASE_URL=http://api.example.com \
myapp-ui
VITE_API_BASE_URL=http://localhost:8080
VITE_API_BASE_URL=http://api.example.com