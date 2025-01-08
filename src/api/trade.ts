import request from '@/utils/request'
import type { TradeRecord, TradeRecordQuery } from '@/types/trade'

export const tradeApi = {
  queryPage(data: TradeRecordQuery) {
    return request.post('/trade/page', data)
  },
  
  getById(id: number) {
    return request.get(`/trade/${id}`)
  },
  
  add(data: TradeRecord) {
    return request.post('/trade', data)
  },
  
  update(data: TradeRecord) {
    return request.put('/trade', data)
  },
  
  delete(id: number) {
    return request.delete(`/trade/${id}`)
  },
  
  batchDelete(ids: number[]) {
    return request.delete('/trade/batch', { data: ids })
  },
  
  importExcel(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/trade/import', formData)
  }
}

// 导出Excel
export const exportExcel = (params: TradeRecordQuery) => {
  return request({
    url: '/trade/export',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
} 