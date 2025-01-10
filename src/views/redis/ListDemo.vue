<template>
  <div class="redis-demo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>List 类型示例</span>
        </div>
      </template>
      
      <!-- 操作日志示例 -->
      <div class="demo-section">
        <h3>操作日志示例</h3>
        <el-form inline>
          <el-form-item label="用户ID">
            <el-input v-model="userId" placeholder="请输入用户ID" />
          </el-form-item>
          <el-form-item label="操作内容">
            <el-input v-model="operation" placeholder="请输入操作内容" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAddLog">添加日志</el-button>
            <el-button @click="handleGetLogs">查看最近操作</el-button>
          </el-form-item>
        </el-form>

        <!-- 操作日志列表 -->
        <div v-if="logs.length" class="log-list">
          <h4>最近10条操作记录：</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(log, index) in logs"
              :key="index"
              :timestamp="log.time"
              placement="top"
            >
              {{ log.operation }}
            </el-timeline-item>
          </el-timeline>
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
const operation = ref('')
const logs = ref<any[]>([])

// 添加操作日志
const handleAddLog = async () => {
  if (!userId.value || !operation.value) {
    ElMessage.warning('请输入用户ID和操作内容')
    return
  }
  try {
    await redisApi.addOperationLog(userId.value, operation.value)
    ElMessage.success('添加日志成功')
    operation.value = ''
    handleGetLogs()
  } catch (error) {
    console.error('添加日志失败:', error)
  }
}

// 获取最近操作记录
const handleGetLogs = async () => {
  if (!userId.value) {
    ElMessage.warning('请输入用户ID')
    return
  }
  try {
    const result = await redisApi.getRecentOperations(userId.value)
    logs.value = result
  } catch (error) {
    console.error('获取操作记录失败:', error)
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

.log-list {
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
</style> 