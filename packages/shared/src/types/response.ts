/**
 * 统一响应结构
 */
export interface Res<T> {
  code: number
  message: string
  data: T
}

/**
 * 分页响应结构
 */
export interface PageRes<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
