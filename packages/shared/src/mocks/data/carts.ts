import { loadFromStorage, saveToStorage } from './storage'
import type { CartItem } from '../../types'

const initialCarts: CartItem[] = []

/**
 * 购物车数据 (localStorage 持久化)
 */
export let carts = loadFromStorage('mock_carts', initialCarts)

/**
 * 保存购物车数据到 localStorage
 */
export function saveCarts() {
  saveToStorage('mock_carts', carts)
}
