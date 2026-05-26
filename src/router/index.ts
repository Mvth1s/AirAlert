import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/onboarding' },
  { path: '/onboarding', component: () => import('@/views/OnboardingView.vue') },
  { path: '/home', component: HomeView },
  { path: '/settings', component: () => import('@/views/SettingsView.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
