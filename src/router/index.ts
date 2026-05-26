import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { Preferences } from '@capacitor/preferences'
import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/start' },
  { path: '/start', component: { template: '<div />' } }, // route sentinelle, remplacée par le guard
  { path: '/onboarding', component: () => import('@/views/OnboardingView.vue') },
  { path: '/home', component: HomeView },
  { path: '/settings', component: () => import('@/views/SettingsView.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Redirige vers /onboarding au premier lancement, /home ensuite
router.beforeEach(async (to) => {
  if (to.path === '/start') {
    const { value } = await Preferences.get({ key: 'onboarding_done' })
    return value ? '/home' : '/onboarding'
  }
})

export default router
