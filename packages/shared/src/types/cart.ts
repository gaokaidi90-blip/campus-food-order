/**
 * 购物车项
 */
export interface CartItem {
  id: string
  userId: string
  dishId: string
  canteenId: string
  quantity: number
  createdAt: string
  updatedAt: string
  dish?: {
    id: string
    name: string
    image: string
    price: number
  }
}

/**
 * 添加购物车请求
 */
export interface AddCartReq {
  dishId: string
  quantity: number
}

/**
 * 更新购物车请求
 */
export interface UpdateCartReq {
  quantity: number
}
