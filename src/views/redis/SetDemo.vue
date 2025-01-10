<template>
  <div class="redis-demo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Set 类型示例</span>
        </div>
      </template>
      
      <!-- 用户关注示例 -->
      <div class="demo-section">
        <h3>用户关注功能</h3>
        <el-form inline>
          <el-form-item label="用户ID">
            <el-input v-model="userId" placeholder="请输入用户ID" />
          </el-form-item>
          <el-form-item label="关注用户">
            <el-select
              v-model="selectedUsers"
              multiple
              placeholder="请选择要关注的用户"
              style="width: 300px"
            >
              <el-option
                v-for="id in ['user1', 'user2', 'user3', 'user4', 'user5']"
                :key="id"
                :label="id"
                :value="id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFollow">关注</el-button>
            <el-button @click="handleGetFollows">查看关注</el-button>
          </el-form-item>
        </el-form>

        <!-- 关注列表展示 -->
        <div v-if="followList.length" class="follow-list">
          <h4>关注列表：</h4>
          <el-tag
            v-for="user in followList"
            :key="user"
            class="follow-tag"
            type="success"
            effect="light"
          >
            {{ user }}
          </el-tag>
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
const selectedUsers = ref<string[]>([])
const followList = ref<string[]>([])

// 关注用户
const handleFollow = async () => {
  if (!userId.value || !selectedUsers.value.length) {
    ElMessage.warning('请选择要关注的用户')
    return
  }
  try {
    await redisApi.followUser(userId.value, selectedUsers.value)
    ElMessage.success('关注成功')
    selectedUsers.value = []
    handleGetFollows()
  } catch (error) {
    console.error('关注失败:', error)
  }
}

// 获取关注列表
const handleGetFollows = async () => {
  if (!userId.value) {
    ElMessage.warning('请输入用户ID')
    return
  }
  try {
    const result = await redisApi.getFollowList(userId.value)
    followList.value = result
  } catch (error) {
    console.error('获取关注列表失败:', error)
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

.follow-list {
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

.follow-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style> 