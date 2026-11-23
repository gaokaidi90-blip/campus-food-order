import { post, get } from '@/utils/request'
import type { AIRecommendRes } from '@campus-food/shared'

/**
 * AI 推荐菜品
 * @param query 用户的自然语言查询
 */
export function getAIRecommendation(query: string) {
  return post<AIRecommendRes>('/user/ai-recommend', { query })
}

/**
 * 个性化推荐
 */
export function getPersonalizedRecommend() {
  return get<{ dishes: any[]; hasHistory: boolean }>('/user/personalized-recommend')
}

/**
 * 营养分析
 * @param dishes 要分析的菜品列表
 */
export function getNutritionAnalysis(dishes: any[]) {
  return post<{
    summary: string
    details: any
    suggestions: string[]
  }>('/user/nutrition-analysis', { dishes })
}
