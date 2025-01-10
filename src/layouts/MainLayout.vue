<template>
  <el-container class="layout-container">
    <!-- 头部 -->
    <el-header class="header">
      <div class="logo">
        <span class="logo-text">很6</span>
      </div>
      <div class="theme-switch">
        <el-switch
          v-model="isDarkMode"
          @change="handleThemeChange"
          :active-icon="Moon"
          :inactive-icon="Sunny"
          inline-prompt
        />
      </div>
    </el-header>
    
    <el-container>
      <!-- 侧边菜单 -->
      <el-aside width="200px">
        <el-menu
          :default-active="activeMenu"
          class="side-menu"
          :router="true"
        >
          <el-sub-menu index="/trade">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>交易记录</span>
            </template>
            <el-menu-item index="/trade/list">交易记录列表</el-menu-item>
            <el-menu-item index="/trade/upload">交易记录上传</el-menu-item>
            <el-menu-item index="/trade/statistics">交易记录统计</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="/redis">
            <template #title>
              <el-icon><Connection /></el-icon>
              <span>Redis实例</span>
            </template>
            <el-menu-item index="/redis/string">String类型</el-menu-item>
            <el-menu-item index="/redis/list">List类型</el-menu-item>
            <el-menu-item index="/redis/hash">Hash类型</el-menu-item>
            <el-menu-item index="/redis/set">Set类型</el-menu-item>
            <el-menu-item index="/redis/zset">ZSet类型</el-menu-item>
            <el-menu-item index="/redis/lock">分布式锁</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      
      <!-- 主要内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Moon, Sunny, Document, Connection } from '@element-plus/icons-vue'
import { isDark, toggleDark, saveTheme, initTheme } from '@/utils/theme'

const route = useRoute()
const isDarkMode = ref(isDark.value)

const activeMenu = computed(() => route.path)

const handleThemeChange = (value: boolean) => {
  toggleDark(value)
  saveTheme(value)
  // 更新组件状态
  isDarkMode.value = value
}

onMounted(() => {
  initTheme()
  isDarkMode.value = isDark.value
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--header-bg-color);
  border-bottom: 1px solid var(--border-color);
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
}

.side-menu {
  height: 100%;
  background-color: var(--menu-bg-color);
  border-right: 1px solid var(--border-color);
}

:deep(.el-menu) {
  background-color: var(--menu-bg-color);
  border-right: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: var(--text-color);
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: var(--el-menu-hover-bg-color);
}

:deep(.el-menu-item.is-active) {
  background-color: var(--el-menu-active-bg-color);
}
</style> 