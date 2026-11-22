import { post } from '@/utils/request'
import type { Dish } from '@campus-food/shared'

/**
 * AI 推荐菜品
 * @param query 用户的自然语言查询
 */
export function getAIRecommendation(query: string) {
  return post<Dish[]>('/user/ai-recommend', { query })
}
