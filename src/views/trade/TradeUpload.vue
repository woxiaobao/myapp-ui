<template>
  <div class="upload-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>交易记录导入</span>
          <el-button type="primary" @click="handleDownloadTemplate">下载模板</el-button>
        </div>
      </template>
      <div class="upload-content">
        <el-upload
          class="upload-demo"
          drag
          :action="uploadUrl"
          :headers="headers"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
          accept=".xlsx,.xls"
          :show-file-list="false"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 xlsx/xls 文件
            </div>
          </template>
        </el-upload>

        <!-- 上传进度和结果展示 -->
        <div v-if="uploadInfo.fileName" class="upload-info">
          <div class="file-info">
            <el-icon><document /></el-icon>
            <span>{{ uploadInfo.fileName }}</span>
          </div>
          <el-progress 
            v-if="uploadInfo.status === 'uploading'"
            :percentage="uploadInfo.percentage" 
          />
          <div v-else-if="uploadInfo.status === 'success'" class="success-info">
            <el-icon color="#67C23A"><circle-check /></el-icon>
            <span>上传成功</span>
          </div>
          <div v-else-if="uploadInfo.status === 'error'" class="error-info">
            <el-icon color="#F56C6C"><circle-close /></el-icon>
            <span>{{ uploadInfo.errorMessage || '上传失败' }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Document, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { tradeApi } from '@/api/trade'

const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/trade/import`

const headers = {
  // 如果需要认证信息，在这里添加
}

const uploadInfo = ref({
  fileName: '',
  status: '',
  percentage: 0,
  errorMessage: ''
})

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const res = await tradeApi.generateTestExcel()
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '交易记录导入模板.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载模板失败:', error)
    ElMessage.error('下载模板失败')
  }
}

// 上传前校验
const beforeUpload = (file: File) => {
  const isExcel = /\.(xlsx|xls)$/.test(file.name.toLowerCase())
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件!')
    return false
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  uploadInfo.value = {
    fileName: file.name,
    status: 'uploading',
    percentage: 0,
    errorMessage: ''
  }
  return true
}

// 上传成功回调
const handleSuccess = (response: any) => {
  uploadInfo.value.status = 'success'
  uploadInfo.value.percentage = 100
  ElMessage.success('文件上传成功')
}

// 上传失败回调
const handleError = (error: any) => {
  uploadInfo.value.status = 'error'
  uploadInfo.value.errorMessage = error.message || '上传失败'
  ElMessage.error('文件上传失败')
}
</script>

<style scoped>
.upload-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.upload-demo {
  width: 100%;
  max-width: 500px;
}

.el-upload__text {
  margin-top: 10px;
}

.el-upload__text em {
  color: var(--el-color-primary);
  font-style: normal;
}

.upload-info {
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.success-info,
.error-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.success-info {
  color: var(--el-color-success);
}

.error-info {
  color: var(--el-color-danger);
}

:deep(.el-upload-dragger) {
  width: 100%;
}

:deep(.el-progress) {
  margin-top: 10px;
}
</style> 