import type { Category } from '@campus-food/shared'
import { get, post, put, del } from '@/utils/request'

/**
 * 获取分类列表
 */
export function getCategoryList(params?: { canteenId?: string; keyword?: string }) {
  return get<Category[]>('/admin/categories', { params })
}

/**
 * 获取分类详情
 */
export function getCategoryDetail(id: string) {
  return get<Category>(`/admin/categories/${id}`)
}

/**
 * 创建分类
 */
export function createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
  return post<Category>('/admin/categories', data)
}

/**
 * 更新分类
 */
export function updateCategory(id: string, data: Partial<Category>) {
  return put<Category>(`/admin/categories/${id}`, data)
}

/**
 * 删除分类
 */
export function deleteCategory(id: string) {
  return del<null>(`/admin/categories/${id}`)
}
