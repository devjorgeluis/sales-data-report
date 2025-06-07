import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: '/cash-flow',
      name: 'CashFlow',
      component: () => import('../views/CashFlow.vue'),
      meta: {
        title: 'CashFlow',
      },
    },
    {
      path: '/profit-loss',
      name: 'ProfitLoss',
      component: () => import('../views/ProfitLoss.vue'),
      meta: {
        title: 'ProfitLoss',
      },
    },
    {
      path: '/cash-out',
      name: 'CashOut',
      component: () => import('../views/CashOut.vue'),
      meta: {
        title: 'CashOut',
      },
    }
  ],
})

export default router