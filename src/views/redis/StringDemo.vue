<template>
  <div class="redis-demo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>String 类型示例</span>
        </div>
      </template>
      
      <!-- 验证码示例 -->
      <div class="demo-section">
        <h3>验证码示例</h3>
        <el-form inline>
          <el-form-item label="手机号">
            <el-input v-model="phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="code" placeholder="请输入验证码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSetVerifyCode">设置验证码</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 文章点赞示例 -->
      <div class="demo-section">
        <h3>文章点赞示例</h3>
        <el-form inline>
          <el-form-item label="文章ID">
            <el-input v-model="articleId" placeholder="请输入文章ID" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLikeArticle">点赞</el-button>
          </el-form-item>
        </el-form>
        <div v-if="likeCount !== null" class="result-info">
          点赞数：{{ likeCount }}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { redisApi } from '@/api/redis'

const phone = ref('')
const code = ref('')
const articleId = ref('')
const likeCount = ref<number | null>(null)

// 设置验证码
const handleSetVerifyCode = async () => {
  if (!phone.value || !code.value) {
    ElMessage.warning('请输入手机号和验证码')
    return
  }
  try {
    await redisApi.setVerifyCode(phone.value, code.value)
    ElMessage.success('验证码设置成功')
  } catch (error) {
    console.error('设置验证码失败:', error)
  }
}

// 文章点赞
const handleLikeArticle = async () => {
  if (!articleId.value) {
    ElMessage.warning('请输入文章ID')
    return
  }
  try {
    const count = await redisApi.likeArticle(articleId.value)
    likeCount.value = count
    ElMessage.success('点赞成功')
  } catch (error) {
    console.error('点赞失败:', error)
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

.demo-section:last-child {
  margin-bottom: 0;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.result-info {
  margin-top: 15px;
  padding: 10px;
  background-color: var(--el-color-success-light-9);
  border-radius: 4px;
  color: var(--el-color-success);
}
</style> 