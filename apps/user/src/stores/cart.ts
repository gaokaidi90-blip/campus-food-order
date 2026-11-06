import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@campus-food/shared'
import { getCart, addCart, updateCart, deleteCart, clearCart } from '@/api'

/**
 * 购物车状态管理 Store
 * 管理购物车数据和相关操作
 */
export const useCartStore = defineStore('cart', () => {
  // 购物车列表
  const cartItems = ref<CartItem[]>([])

  /**
   * 计算购物车总数量
   */
  const totalCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  /**
   * 计算购物车总价格
   */
  const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => {
      const price = item.dish?.price || 0
      return sum + price * item.quantity
    }, 0)
  })

  /**
   * 获取购物车列表
   */
  async function fetchCart() {
    const { data } = await getCart()
    cartItems.value = data.data
    return data.data
  }

  /**
   * 添加到购物车
   * @param dishId 菜品 ID
   * @param canteenId 食堂 ID
   * @param quantity 数量
   */
  async function addToCart(dishId: string, canteenId: string, quantity: number) {
    await addCart({ dishId, canteenId, quantity })
    await fetchCart() // 重新获取购物车
  }

  /**
   * 更新购物车项数量
   * @param id 购物车项 ID
   * @param quantity 新数量
   */
  async function updateCartItem(id: string, quantity: number) {
    await updateCart(id, { quantity })
    await fetchCart()
  }

  /**
   * 删除购物车项
   * @param id 购物车项 ID
   */
  async function removeCartItem(id: string) {
    await deleteCart(id)
    await fetchCart()
  }

  /**
   * 清空购物车
   */
  async function clearAllCart() {
    await clearCart()
    cartItems.value = []
  }

  return {
    cartItems,
    totalCount,
    totalPrice,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearAllCart,
  }
})
