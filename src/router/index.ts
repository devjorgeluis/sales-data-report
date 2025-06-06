import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/cash-register',
      name: 'CashRegister',
      component: () => import('../views/CashRegister.vue'),
      meta: {
        title: 'CashRegister',
      },
    },
  ],
})

export default router