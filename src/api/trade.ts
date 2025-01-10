import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { TradeRecord, TradeRecordQuery } from '@/types/trade'

interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
}

export const tradeApi = {
  queryPage(data: TradeRecordQuery): Promise<PageResponse<TradeRecord>> {
    return request.post('/trade/page', data)
  },
  
  getById(id: number): Promise<TradeRecord> {
    return request.get(`/trade/${id}`)
  },
  
  add(data: TradeRecord): Promise<any> {
    return request.post('/trade', data)
  },
  
  update(data: TradeRecord): Promise<any> {
    return request.put('/trade', data)
  },
  
  delete(id: number): Promise<any> {
    return request.delete(`/trade/${id}`)
  },
  
  batchDelete(ids: number[]): Promise<any> {
    return request.delete('/trade/batch', { data: ids })
  },
  
  importExcel(file: File): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/trade/import', formData)
  },

  generateTestExcel(): Promise<Blob> {
    return request.get('/trade/generate-test', {
      responseType: 'blob'
    })
  },

  exportExcel(params: TradeRecordQuery): Promise<Blob> {
    return request({
      url: '/trade/export',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  }
} 