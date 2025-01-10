import request from '@/utils/request'

export const redisApi = {
  // String 类型
  setVerifyCode(phone: string, code: string): Promise<string> {
    return request.post('/redis/string/verifyCode', null, { params: { phone, code } })
  },

  likeArticle(articleId: string): Promise<number> {
    return request.post('/redis/string/like', null, { params: { articleId } })
  },

  // List 类型
  addOperationLog(userId: string, operation: string): Promise<number> {
    return request.post('/redis/list/opLog', null, { params: { userId, operation } })
  },

  getRecentOperations(userId: string): Promise<any[]> {
    return request.get(`/redis/list/opLog/${userId}`)
  },

  // Hash 类型
  updateUserInfo(userId: string, field: string, value: string): Promise<string> {
    return request.post('/redis/hash/userInfo', null, { params: { userId, field, value } })
  },

  getUserInfo(userId: string): Promise<Record<string, any>> {
    return request.get(`/redis/hash/userInfo/${userId}`)
  },

  // Set 类型
  followUser(userId: string, followIds: string[]): Promise<number> {
    return request.post('/redis/set/follow', null, { params: { userId, followIds } })
  },

  getFollowList(userId: string): Promise<any[]> {
    return request.get(`/redis/set/follow/${userId}`)
  },

  // ZSet 类型
  purchaseProduct(productId: string, quantity: number): Promise<boolean> {
    return request.post('/redis/zset/purchase', null, { params: { productId, quantity } })
  },

  getHotProducts(): Promise<any[]> {
    return request.get('/redis/zset/hotProducts')
  },

  // 分布式锁
  initStock(productId: string, stock: number): Promise<string> {
    return request.post('/redis/lock/init-stock', null, { params: { productId, stock } })
  },

  seckill(productId: string, userId: string): Promise<string> {
    return request.post('/redis/lock/seckill', null, { params: { productId, userId } })
  }
} 