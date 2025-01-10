<template>
  <div class="redis-demo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>分布式锁示例</span>
        </div>
      </template>
      
      <!-- 初始化库存 -->
      <div class="demo-section">
        <h3>初始化商品库存</h3>
        <el-form inline>
          <el-form-item label="商品ID">
            <el-select 
              v-model="initProductId" 
              placeholder="请选择商品"
              style="width: 220px"
            >
              <el-option
                v-for="product in products"
                :key="product.id"
                :label="`${product.id} - ${product.name}`"
                :value="product.id"
              >
                <span style="float: left">{{ product.id }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ product.name }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input-number v-model="stock" :min="1" :max="1000" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleInitStock">初始化库存</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 秒杀功能 -->
      <div class="demo-section">
        <h3>商品秒杀</h3>
        <el-alert
          title="提示：先初始化商品库存，然后多开几个浏览器窗口同时秒杀测试并发"
          type="info"
          :closable="false"
          class="tip-alert"
        />
        <el-form inline class="seckill-form">
          <el-form-item label="商品ID">
            <el-select 
              v-model="seckillProductId" 
              placeholder="请选择商品"
              style="width: 220px"
            >
              <el-option
                v-for="product in products"
                :key="product.id"
                :label="`${product.id} - ${product.name}`"
                :value="product.id"
              >
                <span style="float: left">{{ product.id }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ product.name }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户ID">
            <el-input v-model="userId" placeholder="请输入用户ID" />
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="handleSeckill" :loading="seckilling">
              立即秒杀
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 秒杀结果展示 -->
        <div v-if="seckillResult" :class="['result-box', seckillResult.success ? 'success' : 'error']">
          <el-icon v-if="seckillResult.success"><CircleCheckFilled /></el-icon>
          <el-icon v-else><CircleCloseFilled /></el-icon>
          <span>{{ seckillResult.message }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { redisApi } from '@/api/redis'

// 商品列表数据
const products = [
  { id: 'P001', name: '手机' },
  { id: 'P002', name: '电脑' },
  { id: 'P003', name: '平板' },
  { id: 'P004', name: '耳机' },
  { id: 'P005', name: '手表' }
]

const initProductId = ref('')
const stock = ref(100)
const seckillProductId = ref('')
const userId = ref('')
const seckilling = ref(false)
const seckillResult = ref<{ success: boolean; message: string } | null>(null)

// 根据商品ID获取商品名称
const getProductName = (id: string) => {
  const product = products.find(p => p.id === id)
  return product ? `${product.id} - ${product.name}` : id
}

// 初始化库存
const handleInitStock = async () => {
  if (!initProductId.value) {
    ElMessage.warning('请选择商品')
    return
  }
  try {
    const result = await redisApi.initStock(initProductId.value, stock.value)
    ElMessage.success(result)
  } catch (error) {
    console.error('初始化库存失败:', error)
  }
}

// 执行秒杀
const handleSeckill = async () => {
  if (!seckillProductId.value || !userId.value) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  seckilling.value = true
  seckillResult.value = null
  
  try {
    const result = await redisApi.seckill(seckillProductId.value, userId.value)
    seckillResult.value = {
      success: !result.includes('失败'),
      message: result
    }
  } catch (error: any) {
    seckillResult.value = {
      success: false,
      message: error.message || '秒杀失败'
    }
  } finally {
    seckilling.value = false
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

.tip-alert {
  margin-bottom: 20px;
}

.seckill-form {
  margin-top: 20px;
}

.result-box {
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-box.success {
  background-color: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.result-box.error {
  background-color: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

:deep(.el-select-dropdown__item) {
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
}
</style> 