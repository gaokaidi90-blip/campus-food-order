/**
 * 菜品分类实体
 */
export interface Category {
  id: string
  canteenId: string
  name: string
  sort: number
  createdAt: string
  updatedAt: string
}

/**
 * 创建分类请求
 */
export interface CreateCategoryReq {
  canteenId: string
  name: string
  sort?: number
}

/**
 * 更新分类请求
 */
export interface UpdateCategoryReq {
  name?: string
  sort?: number
}
