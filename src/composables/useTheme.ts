import { ref, watch } from 'vue'

const THEME_KEY = 'airalert-theme'

function detectInitial(): boolean {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved) return saved === 'dark'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
}

const isDark = ref(detectInitial())

function applyTheme(dark: boolean) {
  const root = document.documentElement
  root.setAttribute('data-theme', dark ? 'dark' : 'light')
  root.classList.toggle('ion-palette-dark', dark)
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
}

// Appliquer immédiatement (synchrone, avant tout rendu)
applyTheme(isDark.value)

watch(isDark, applyTheme)

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
  }
  return { isDark, toggleTheme }
}
