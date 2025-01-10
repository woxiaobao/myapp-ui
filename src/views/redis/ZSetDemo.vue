<template>
  <div class="redis-demo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>ZSet 类型示例</span>
        </div>
      </template>
      
      <!-- 商品购买示例 -->
      <div class="demo-section">
        <h3>商品购买</h3>
        <el-form inline>
          <el-form-item label="商品ID">
            <el-select 
              v-model="productId" 
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
          <el-form-item label="购买数量">
            <el-input-number v-model="quantity" :min="1" :max="100" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePurchase">购买</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 热销商品排行 -->
      <div class="demo-section">
        <div class="section-header">
          <h3>热销商品排行</h3>
          <el-button @click="handleGetHotProducts">刷新排行</el-button>
        </div>
        
        <el-table
          v-if="hotProducts.length"
          :data="hotProducts"
          style="width: 100%"
          :header-cell-style="{ background: '#f5f7fa' }"
        >
          <el-table-column type="index" label="排名" width="80" align="center" />
          <el-table-column label="商品信息" align="center">
            <template #default="{ row }">
              <div class="product-info">
                <span class="product-id">{{ row.id }}</span>
                <el-tag size="small" type="info">
                  {{ getProductName(row.id) }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="销量" align="center">
            <template #default="{ row }">
              <el-tag type="success">{{ row.score }}</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div v-else class="empty-data">
          暂无销售数据
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { redisApi } from '@/api/redis'

// 商品列表数据
const products = [
  { id: 'P001', name: '手机' },
  { id: 'P002', name: '电脑' },
  { id: 'P003', name: '平板' },
  { id: 'P004', name: '耳机' },
  { id: 'P005', name: '手表' }
]

const productId = ref('')
const quantity = ref(1)
const hotProducts = ref<any[]>([])

// 根据商品ID获取商品名称
const getProductName = (id: string) => {
  const product = products.find(p => p.id === id)
  return product ? `${product.id} - ${product.name}` : id
}

// 购买商品
const handlePurchase = async () => {
  if (!productId.value) {
    ElMessage.warning('请选择商品')
    return
  }
  try {
    const success = await redisApi.purchaseProduct(productId.value, quantity.value)
    if (success) {
      ElMessage.success('购买成功')
      handleGetHotProducts()
    } else {
      ElMessage.error('购买失败')
    }
  } catch (error) {
    console.error('购买失败:', error)
  }
}

// 获取热销商品
const handleGetHotProducts = async () => {
  try {
    const result = await redisApi.getHotProducts()
    // 处理返回的数据格式
    hotProducts.value = result.map((item: any) => ({
      id: item.member || item.productId, // 适配不同的返回格式
      score: item.score || item.sales    // 适配不同的返回格式
    }))
  } catch (error) {
    console.error('获取热销商品失败:', error)
    hotProducts.value = []
  }
}

// 初始加载热销商品
onMounted(() => {
  handleGetHotProducts()
})
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h3 {
  margin: 0;
  color: var(--el-text-color-primary);
}

:deep(.el-table) {
  margin-top: 15px;
}

:deep(.el-select-dropdown__item) {
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
}

.product-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.product-id {
  font-weight: bold;
}

.empty-data {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 30px 0;
}

:deep(.el-table .cell) {
  white-space: nowrap;
}
</style> 