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
          path: '/trade/list',
          component: () => import('@/views/trade/TradeList.vue')
        },
        {
          path: '/trade/upload',
          component: () => import('@/views/trade/TradeUpload.vue')
        },
        {
          path: '/trade/statistics',
          component: () => import('@/views/trade/TradeStatistics.vue')
        }
      ]
    }
  ]
})

export default router 