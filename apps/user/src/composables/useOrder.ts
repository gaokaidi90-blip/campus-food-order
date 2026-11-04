import { useOrderStore } from '@/stores/order'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { CreateOrderReq } from '@campus-food/shared'
import { createOrder as createOrderApi } from '@/api'

/**
 * 订单相关的组合式函数
 * 封装订单常用操作
 */
export function useOrder() {
  const orderStore = useOrderStore()
  const router = useRouter()

  /**
   * 创建订单
   * @param data 订单信息
   */
  async function createOrder(data: CreateOrderReq) {
    try {
      const { data: res } = await createOrderApi(data)
      showToast('下单成功')
      // 跳转到订单详情页，添加 from 参数标识来源
      router.push({
        path: `/order/${res.data.id}`,
        query: { from: 'checkout' }
      })
      return res.data
    } catch (error) {
      showToast('下单失败')
      return null
    }
  }

  return {
    orderStore,
    createOrder,
  }
}
