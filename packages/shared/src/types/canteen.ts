/**
 * 食堂实体
 */
export interface Canteen {
  id: string
  name: string
  description: string
  image: string
  address: string
  openTime: string
  closeTime: string
  status: number
  createdAt: string
  updatedAt: string
}

/**
 * 创建食堂请求
 */
export interface CreateCanteenReq {
  name: string
  description: string
  image: string
  address: string
  openTime: string
  closeTime: string
}

/**
 * 更新食堂请求
 */
export interface UpdateCanteenReq {
  name?: string
  description?: string
  image?: string
  address?: string
  openTime?: string
  closeTime?: string
  status?: number
}
