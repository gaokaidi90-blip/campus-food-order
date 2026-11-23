import type { Dish } from './dish'

/**
 * AI 解析的筛选条件
 */
export interface AICriteria {
  maxPrice?: number
  keywords?: string[]
  spicy?: 'no' | 'light' | 'any'
  taste?: string[]
}

/**
 * AI 推荐响应
 */
export interface AIRecommendRes {
  dishes: Dish[]
  criteria: AICriteria
  message?: string
}
