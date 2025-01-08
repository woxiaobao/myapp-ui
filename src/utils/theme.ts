import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: ''
})

export const toggleDark = useToggle(isDark)

// 初始化主题
export const initTheme = () => {
  const darkMode = localStorage.getItem('darkMode')
  if (darkMode === 'true') {
    toggleDark(true)
  }
}

// 保存主题设置
export const saveTheme = (isDark: boolean) => {
  localStorage.setItem('darkMode', String(isDark))
} 