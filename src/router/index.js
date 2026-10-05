import { createRouter, createWebHashHistory } from 'vue-router'
import { ADMIN, state } from '../stores/state'

const routes = [
  { path: '/login', component: () => import('../views/LoginView.vue'), meta: { public: true } },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/new', component: () => import('../views/NewApplicationView.vue') },
  { path: '/result', component: () => import('../views/ResultView.vue') },
  { path: '/documents/:id?', component: () => import('../views/DocumentsView.vue') },
  { path: '/archive', component: () => import('../views/ArchiveView.vue') },
  { path: '/archive/:id', component: () => import('../views/ApplicationCardView.vue') },
  { path: '/admin/users', component: () => import('../views/UsersView.vue'), meta: { admin: true } },
  { path: '/admin/metrics', component: () => import('../views/MetricsView.vue'), meta: { admin: true } },
  { path: '/admin/audit', component: () => import('../views/AuditView.vue'), meta: { admin: true } },
  { path: '/design-system', component: () => import('../views/DesignSystemView.vue'), meta: { public: true } }
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to) => {
  if (to.meta.public) return true
  if (!state.user) return '/login'
  if (to.meta.admin && state.user.role !== ADMIN) return '/dashboard'
  return true
})

export default router
