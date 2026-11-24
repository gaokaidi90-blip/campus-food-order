import { http, HttpResponse } from 'msw'
import type { Res, Dish, AICriteria, AIRecommendRes, Order } from '@campus-food/shared'
import { dishes, orders } from '@campus-food/shared'

/**
 * AI 推荐 handlers
 */
export const aiHandlers = [
  // AI 智能推荐
  http.post('/api/user/ai-recommend', async ({ request }) => {
    const body = (await request.json()) as { query: string }
    const { query } = body

    // 模拟 AI 解析用户查询
    const criteria = parseQuery(query)

    // 根据条件筛选菜品
    let filtered = dishes.filter((d: any) => d.status === 'available')

    // 价格筛选
    if (criteria.maxPrice) {
      filtered = filtered.filter((d: any) => d.price <= criteria.maxPrice!)
    }

    // 关键词筛选
    if (criteria.keywords && criteria.keywords.length > 0) {
      filtered = filtered.filter((d: any) =>
        criteria.keywords!.some(
          (kw) =>
            d.name.includes(kw) ||
            d.description.includes(kw) ||
            d.specifications?.includes(kw)
        )
      )
    }

    // 辣度筛选
    if (criteria.spicy === 'no') {
      filtered = filtered.filter(
        (d: any) => !d.name.includes('辣') && !d.description.includes('辣')
      )
    }

    // 口味筛选
    if (criteria.taste && criteria.taste.length > 0) {
      filtered = filtered.filter((d: any) =>
        criteria.taste!.some(
          (t) => d.name.includes(t) || d.description.includes(t)
        )
      )
    }

    // 按销量排序
    filtered.sort((a: any, b: any) => b.sales - a.sales)

    // 最多返回 20 个
    const result = filtered.slice(0, 20)

    return HttpResponse.json<Res<AIRecommendRes>>({
      code: 200,
      message: 'success',
      data: {
        dishes: result,
        criteria,
        message: `为您找到 ${result.length} 个符合条件的菜品`,
      },
    })
  }),

  // 个性化推荐
  http.get('/api/user/personalized-recommend', ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    // 获取用户历史订单
    const userOrders = orders.filter((o: any) => o.userId === token)

    if (userOrders.length === 0) {
      // 新用户，推荐热门菜品
      const hotDishes = dishes
        .filter((d: any) => d.status === 'available')
        .sort((a: any, b: any) => b.sales - a.sales)
        .slice(0, 10)

      return HttpResponse.json<Res<any>>({
        code: 200,
        message: 'success',
        data: {
          dishes: hotDishes,
          hasHistory: false,
          reason: '您还没有订单记录，为您推荐最受欢迎的菜品',
        },
      })
    }

    // 分析用户偏好
    const preferences = analyzeUserPreferences(userOrders)

    // 基于偏好推荐菜品
    const recommendedDishes = recommendByPreferences(preferences)

    return HttpResponse.json<Res<any>>({
      code: 200,
      message: 'success',
      data: {
        dishes: recommendedDishes,
        hasHistory: true,
        reason: generateRecommendReason(preferences),
        preferences,
      },
    })
  }),

  // 营养分析
  http.post('/api/user/nutrition-analysis', async ({ request }) => {
    const body = (await request.json()) as {
      dishes: Array<{ name: string; price: number; quantity: number }>
    }

    const { dishes: dishList } = body

    // 模拟营养分析
    const totalCalories = dishList.reduce((sum, d) => sum + d.quantity * 150, 0)
    const totalProtein = dishList.reduce((sum, d) => sum + d.quantity * 20, 0)
    const totalCarbs = dishList.reduce((sum, d) => sum + d.quantity * 30, 0)
    const totalFat = dishList.reduce((sum, d) => sum + d.quantity * 10, 0)
    const totalFiber = dishList.reduce((sum, d) => sum + d.quantity * 5, 0)

    // 生成分析摘要
    const summary = generateNutritionSummary(dishList, {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
    })

    // 生成建议
    const suggestions = generateNutritionSuggestions(dishList, {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
    })

    return HttpResponse.json<
      Res<{
        summary: string
        details: {
          calories: string
          protein: string
          carbs: string
          fat: string
          fiber: string
        }
        suggestions: string[]
      }>
    >({
      code: 200,
      message: 'success',
      data: {
        summary,
        details: {
          calories: `${totalCalories} 千卡`,
          protein: `${totalProtein} 克`,
          carbs: `${totalCarbs} 克`,
          fat: `${totalFat} 克`,
          fiber: `${totalFiber} 克`,
        },
        suggestions,
      },
    })
  }),
]

/**
 * 解析用户查询
 */
function parseQuery(query: string): AICriteria {
  const criteria: AICriteria = {}

  // 价格匹配
  const priceMatch = query.match(/(\d+)\s*元/)
  if (priceMatch) {
    criteria.maxPrice = Number.parseInt(priceMatch[1])
  }

  // 辣度匹配
  if (query.includes('不辣') || query.includes('清淡')) {
    criteria.spicy = 'no'
  } else if (query.includes('微辣') || query.includes('中辣')) {
    criteria.spicy = 'light'
  }

  // 口味匹配
  const tastes: string[] = []
  if (query.includes('清淡')) tastes.push('清淡')
  if (query.includes('麻辣')) tastes.push('麻辣')
  if (query.includes('酸辣')) tastes.push('酸辣')
  if (query.includes('香辣')) tastes.push('香辣')
  if (tastes.length) {
    criteria.taste = tastes
  }

  // 关键词提取
  const keywords: string[] = []
  const foodKeywords = [
    '面',
    '饭',
    '粉',
    '汤',
    '面食',
    '米饭',
    '炒饭',
    '盖浇饭',
    '套餐',
    '小吃',
    '早餐',
    '午餐',
    '晚餐',
    '素菜',
    '肉',
    '鱼',
    '鸡',
    '牛',
    '猪',
    '蔬菜',
  ]

  for (const keyword of foodKeywords) {
    if (query.includes(keyword)) {
      keywords.push(keyword)
    }
  }

  if (keywords.length > 0) {
    criteria.keywords = keywords
  }

  return criteria
}

/**
 * 分析用户偏好
 */
function analyzeUserPreferences(userOrders: any[]): any {
  const dishCounts = new Map<string, number>()
  const priceList: number[] = []
  let totalSpent = 0
  const orderCount = userOrders.length

  // 统计订单数据
  for (const order of userOrders) {
    totalSpent += order.totalAmount
    for (const item of order.items) {
      dishCounts.set(item.dishId, (dishCounts.get(item.dishId) || 0) + item.quantity)
      priceList.push(item.price)
    }
  }

  // 计算平均价格
  const avgPrice = priceList.length > 0
    ? priceList.reduce((sum, p) => sum + p, 0) / priceList.length
    : 15

  // 价格区间偏好
  let priceRange: 'low' | 'medium' | 'high' = 'medium'
  if (avgPrice < 15) {
    priceRange = 'low'
  } else if (avgPrice > 25) {
    priceRange = 'high'
  }

  // 最常点的菜品
  const topDishes = Array.from(dishCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([dishId]) => dishId)

  return {
    orderCount,
    totalSpent,
    avgPrice: Math.round(avgPrice * 10) / 10,
    priceRange,
    topDishes,
    avgOrderAmount: Math.round((totalSpent / orderCount) * 10) / 10,
  }
}

/**
 * 基于偏好推荐菜品
 */
function recommendByPreferences(preferences: any): Dish[] {
  const { priceRange, topDishes, avgPrice } = preferences

  // 获取用户常点的菜品
  const userFavoriteDishes = dishes.filter((d: any) => topDishes.includes(d.id))

  // 筛选可用菜品
  let availableDishes = dishes.filter((d: any) => d.status === 'available')

  // 根据价格区间筛选
  if (priceRange === 'low') {
    availableDishes = availableDishes.filter((d: any) => d.price <= avgPrice * 1.2)
  } else if (priceRange === 'high') {
    availableDishes = availableDishes.filter((d: any) => d.price >= avgPrice * 0.8)
  } else {
    availableDishes = availableDishes.filter(
      (d: any) => d.price >= avgPrice * 0.7 && d.price <= avgPrice * 1.3
    )
  }

  // 排除用户已经常点的菜品
  availableDishes = availableDishes.filter((d: any) => !topDishes.includes(d.id))

  // 按销量排序
  availableDishes.sort((a: any, b: any) => b.sales - a.sales)

  // 合并常点菜品和推荐菜品
  const result = [...userFavoriteDishes.slice(0, 3), ...availableDishes.slice(0, 7)]

  return result.slice(0, 10) as Dish[]
}

/**
 * 生成推荐理由
 */
function generateRecommendReason(preferences: any): string {
  const { orderCount, avgPrice, priceRange } = preferences

  const priceRangeText =
    priceRange === 'low' ? '实惠' : priceRange === 'high' ? '品质' : '中等价位'

  return `基于您的 ${orderCount} 次订单记录，您偏好 ${priceRangeText} 菜品（平均 ¥${avgPrice}），为您推荐这些菜品`
}

/**
 * 生成营养摘要
 */
function generateNutritionSummary(
  dishList: Array<{ name: string; quantity: number }>,
  nutrition: any
): string {
  const totalQuantity = dishList.reduce((sum, d) => sum + d.quantity, 0)
  const { calories } = nutrition

  let level = '适中'
  if (calories > 800) {
    level = '偏高'
  } else if (calories < 400) {
    level = '偏低'
  }

  return `您选择了 ${totalQuantity} 份餐品，总热量约 ${calories} 千卡，能量水平${level}，${
    level === '偏高'
      ? '建议搭配蔬菜和清淡汤品'
      : level === '偏低'
        ? '可以适当增加主食或肉类'
        : '营养搭配较为均衡'
  }。`
}

/**
 * 生成营养建议
 */
function generateNutritionSuggestions(
  dishList: Array<{ name: string }>,
  nutrition: any
): string[] {
  const suggestions: string[] = []
  const { calories, protein, carbs, fat, fiber } = nutrition

  // 热量建议
  if (calories > 900) {
    suggestions.push('总热量较高，建议减少高热量食物，增加蔬菜摄入')
  } else if (calories < 400) {
    suggestions.push('总热量偏低，建议增加主食或优质蛋白食物')
  }

  // 蛋白质建议
  if (protein < 20) {
    suggestions.push('蛋白质摄入不足，建议添加鸡蛋、豆制品或肉类')
  } else if (protein > 50) {
    suggestions.push('蛋白质摄入充足，注意搭配蔬菜保持均衡')
  }

  // 碳水建议
  if (carbs > 100) {
    suggestions.push('碳水化合物较高，建议减少主食，增加粗粮')
  }

  // 脂肪建议
  if (fat > 40) {
    suggestions.push('脂肪含量偏高，建议选择清蒸、水煮等烹饪方式')
  }

  // 膳食纤维建议
  if (fiber < 10) {
    suggestions.push('膳食纤维不足，建议多吃蔬菜、粗粮和豆类')
  }

  // 兜底建议
  if (suggestions.length === 0) {
    suggestions.push('营养搭配较为均衡，建议每餐都有蔬菜')
    suggestions.push('保持多样化饮食，每周尝试不同菜品')
  }

  return suggestions
}
