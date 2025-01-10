import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/trade/list',
      children: [
        {
          path: 'trade/list',
          name: 'TradeList',
          component: () => import('@/views/trade/TradeList.vue')
        },
        {
          path: 'trade/upload',
          name: 'TradeUpload',
          component: () => import('@/views/trade/TradeUpload.vue')
        },
        {
          path: 'trade/statistics',
          name: 'TradeStatistics',
          component: () => import('@/views/trade/TradeStatistics.vue')
        },
        {
          path: 'redis/string',
          name: 'StringDemo',
          component: () => import('@/views/redis/StringDemo.vue')
        },
        {
          path: 'redis/list',
          name: 'ListDemo',
          component: () => import('@/views/redis/ListDemo.vue')
        },
        {
          path: 'redis/hash',
          name: 'HashDemo',
          component: () => import('@/views/redis/HashDemo.vue')
        },
        {
          path: 'redis/set',
          name: 'SetDemo',
          component: () => import('@/views/redis/SetDemo.vue')
        },
        {
          path: 'redis/zset',
          name: 'ZSetDemo',
          component: () => import('@/views/redis/ZSetDemo.vue')
        },
        {
          path: 'redis/lock',
          name: 'LockDemo',
          component: () => import('@/views/redis/LockDemo.vue')
        }
      ]
    }
  ]
})

export default router 