import { useCartStore } from '@/stores/cart'
import { showToast } from 'vant'

/**
 * 购物车相关的组合式函数
 * 封装购物车常用操作
 */
export function useCart() {
  const cartStore = useCartStore()

  /**
   * 添加到购物车
   * @param dishId 菜品 ID
   * @param quantity 数量
   */
  async function addToCart(dishId: string, quantity: number) {
    try {
      await cartStore.addToCart(dishId, quantity)
      showToast('加入购物车成功')
      return true
    } catch (error) {
      showToast('加入购物车失败')
      return false
    }
  }

  /**
   * 更新购物车项
   * @param id 购物车项 ID
   * @param quantity 新数量
   */
  async function updateCartItem(id: string, quantity: number) {
    try {
      await cartStore.updateCartItem(id, quantity)
      return true
    } catch (error) {
      showToast('更新失败')
      return false
    }
  }

  /**
   * 删除购物车项
   * @param id 购物车项 ID
   */
  async function removeCartItem(id: string) {
    try {
      await cartStore.removeCartItem(id)
      showToast('已删除')
      return true
    } catch (error) {
      showToast('删除失败')
      return false
    }
  }

  return {
    cartStore,
    addToCart,
    updateCartItem,
    removeCartItem,
  }
}
