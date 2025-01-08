// 交易方向
export const DIRECTION_OPTIONS = [
  { label: '收入', value: 'IN' },
  { label: '支出', value: 'OUT' }
]

// 交易状态
export const STATUS_MAP = {
  SUCCESS: { label: '成功', type: 'success' },
  PENDING: { label: '处理中', type: 'warning' },
  FAILED: { label: '失败', type: 'danger' }
}

// 支付方式
export const PAYMENT_METHOD_OPTIONS = [
  { label: '支付宝', value: 'ALIPAY' },
  { label: '微信', value: 'WECHAT' },
  { label: '银行卡', value: 'BANK_CARD' },
  { label: '现金', value: 'CASH' }
] 