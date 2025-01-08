<template>
  <div class="trade-list">
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button type="primary" @click="handleExport">导出</el-button>
    </div>

    <el-form :model="queryForm" inline class="query-form">
      <el-form-item label="交易类型">
        <el-input v-model="queryForm.tradeType" placeholder="请输入交易类型" />
      </el-form-item>
      <el-form-item label="交易对手">
        <el-input v-model="queryForm.counterparty" placeholder="请输入交易对手" />
      </el-form-item>
      <el-form-item label="交易方向">
        <el-select v-model="queryForm.direction" placeholder="请选择" clearable>
          <el-option label="收入" value="IN" />
          <el-option label="支出" value="OUT" />
        </el-select>
      </el-form-item>
      <el-form-item label="交易时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="handleDateChange"
        />
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="queryForm.paymentMethod" placeholder="请选择" clearable>
          <el-option
            v-for="item in PAYMENT_METHOD_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="金额范围">
        <el-input-number
          v-model="queryForm.minAmount"
          :precision="2"
          :step="100"
          placeholder="最小金额"
          style="width: 150px"
        />
        <span class="mx-2">-</span>
        <el-input-number
          v-model="queryForm.maxAmount"
          :precision="2"
          :step="100"
          placeholder="最大金额"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      v-loading="loading"
      :header-cell-style="{ background: '#f5f7fa' }"
      stripe
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="tradeTime" label="交易时间" width="180" />
      <el-table-column prop="tradeType" label="交易类型" width="120" />
      <el-table-column prop="counterparty" label="交易对手" />
      <el-table-column prop="product" label="产品" />
      <el-table-column prop="direction" label="方向" width="80">
        <template #default="{ row }">
          <el-tag :type="row.direction === 'IN' ? 'success' : 'danger'">
            {{ row.direction === 'IN' ? '收入' : '支出' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="120">
        <template #default="{ row }">
          {{ formatAmount(row.amount) }}
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="支付方式" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryForm.pageNum"
        v-model:page-size="queryForm.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :pager-count="7"
        background
        :locale="zhCn.el.pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="交易类型" prop="tradeType">
          <el-input v-model="formData.tradeType" />
        </el-form-item>
        <el-form-item label="交易对手" prop="counterparty">
          <el-input v-model="formData.counterparty" />
        </el-form-item>
        <el-form-item label="产品" prop="product">
          <el-input v-model="formData.product" />
        </el-form-item>
        <el-form-item label="方向" prop="direction">
          <el-select v-model="formData.direction" placeholder="请选择">
            <el-option label="收入" value="IN" />
            <el-option label="支出" value="OUT" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="formData.amount" :precision="2" :step="0.1" />
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-input v-model="formData.paymentMethod" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" v-model="formData.remarks" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { tradeApi } from '@/api/trade'
import type { TradeRecord, TradeRecordQuery } from '@/types/trade'
import { DIRECTION_OPTIONS, STATUS_MAP, PAYMENT_METHOD_OPTIONS } from '@/constants/trade'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const loading = ref(false)
const tableData = ref<TradeRecord[]>([])
const total = ref(0)
const dateRange = ref<[string, string]>(['', ''])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

const queryForm = ref<TradeRecordQuery>({
  pageNum: 1,
  pageSize: 10
})

const formData = ref<TradeRecord>({})

const formRules = {
  tradeType: [{ required: true, message: '请输入交易类型', trigger: 'blur' }],
  counterparty: [{ required: true, message: '请输入交易对手', trigger: 'blur' }],
  direction: [{ required: true, message: '请选择方向', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await tradeApi.queryPage(queryForm.value)
    tableData.value = res.records || []
    total.value = res.total || 0
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理日期范围变化
const handleDateChange = (val: [string, string]) => {
  queryForm.value.startTime = val?.[0]
  queryForm.value.endTime = val?.[1]
}

// 查询
const handleQuery = () => {
  queryForm.value.pageNum = 1
  loadData()
}

// 重置查询
const resetQuery = () => {
  queryForm.value = {
    pageNum: 1,
    pageSize: 10,
    tradeType: undefined,
    counterparty: undefined,
    direction: undefined,
    paymentMethod: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    startTime: undefined,
    endTime: undefined
  }
  dateRange.value = ['', '']
  loadData()
}

// 处理新增
const handleAdd = () => {
  dialogTitle.value = '新增交易记录'
  formData.value = {}
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: TradeRecord) => {
  dialogTitle.value = '编辑交易记录'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 处理删除
const handleDelete = async (row: TradeRecord) => {
  try {
    await ElMessageBox.confirm('确认删除该记录吗？', '提示', {
      type: 'warning'
    })
    await tradeApi.delete(row.id!)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.value.id) {
          await tradeApi.update(formData.value)
          ElMessage.success('更新成功')
        } else {
          await tradeApi.add(formData.value)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) {
        console.error('保存失败:', error)
      }
    }
  })
}

// 处理对话框关闭
const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  queryForm.value.pageSize = val
  loadData()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  queryForm.value.pageNum = val
  loadData()
}

// 格式化金额
const formatAmount = (amount: number) => {
  return amount?.toFixed(2)
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  return STATUS_MAP[status]?.type || 'info'
}

const getStatusLabel = (status: string) => {
  return STATUS_MAP[status]?.label || status
}

// 处理导出
const handleExport = async () => {
  try {
    loading.value = true
    const res = await tradeApi.exportExcel(queryForm.value)
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `交易记录${new Date().toLocaleDateString()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.trade-list {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
}

.query-form {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.mx-2 {
  margin: 0 8px;
}

.el-input-number {
  width: 150px;
}

.el-table :deep(.el-table__cell) {
  text-align: center;
}

.el-table :deep(.amount-column) {
  text-align: right;
}
</style> 