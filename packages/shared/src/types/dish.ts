/**
 * 菜品实体
 */
export interface Dish {
  id: string
  canteenId: string
  categoryId: string
  name: string
  description: string
  image: string
  price: number
  originalPrice?: number
  stock: number
  sales: number
  status: number
  specifications?: string
  createdAt: string
  updatedAt: string
}

/**
 * 创建菜品请求
 */
export interface CreateDishReq {
  canteenId: string
  categoryId: string
  name: string
  description: string
  image: string
  price: number
  originalPrice?: number
  stock: number
  specifications?: string
}

/**
 * 更新菜品请求
 */
export interface UpdateDishReq {
  categoryId?: string
  name?: string
  description?: string
  image?: string
  price?: number
  originalPrice?: number
  stock?: number
  specifications?: string
}
