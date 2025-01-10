<template>
  <div class="redis-demo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Hash 类型示例</span>
        </div>
      </template>
      
      <!-- 用户信息示例 -->
      <div class="demo-section">
        <h3>用户信息管理</h3>
        <el-form inline>
          <el-form-item label="用户ID">
            <el-input v-model="userId" placeholder="请输入用户ID" />
          </el-form-item>
          <el-form-item label="字段">
            <el-select v-model="field" placeholder="请选择字段">
              <el-option label="用户名" value="username" />
              <el-option label="年龄" value="age" />
              <el-option label="邮箱" value="email" />
              <el-option label="手机" value="phone" />
            </el-select>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="value" placeholder="请输入值" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdateInfo">更新信息</el-button>
            <el-button @click="handleGetInfo">查看信息</el-button>
          </el-form-item>
        </el-form>

        <!-- 用户信息展示 -->
        <div v-if="Object.keys(userInfo).length" class="info-display">
          <h4>用户信息：</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item v-for="(value, key) in userInfo" :key="key" :label="key">
              {{ value }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { redisApi } from '@/api/redis'

const userId = ref('')
const field = ref('')
const value = ref('')
const userInfo = ref<Record<string, any>>({})

// 更新用户信息
const handleUpdateInfo = async () => {
  if (!userId.value || !field.value || !value.value) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    await redisApi.updateUserInfo(userId.value, field.value, value.value)
    ElMessage.success('更新成功')
    value.value = ''
    handleGetInfo()
  } catch (error) {
    console.error('更新失败:', error)
  }
}

// 获取用户信息
const handleGetInfo = async () => {
  if (!userId.value) {
    ElMessage.warning('请输入用户ID')
    return
  }
  try {
    const result = await redisApi.getUserInfo(userId.value)
    userInfo.value = result
  } catch (error) {
    console.error('获取信息失败:', error)
  }
}
</script>

<style scoped>
.redis-demo {
  padding: 20px;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
}

.info-display {
  margin-top: 20px;
  padding: 20px;
  background-color: var(--el-bg-color-page);
  border-radius: 4px;
}

h3, h4 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

:deep(.el-descriptions) {
  margin-top: 15px;
}
</style> 