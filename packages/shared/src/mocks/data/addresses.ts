import { loadFromStorage, saveToStorage } from './storage'
import type { Address } from '../../types'

const initialAddresses: Address[] = []

/**
 * 地址数据 (localStorage 持久化)
 */
export let addresses = loadFromStorage('mock_addresses', initialAddresses)

/**
 * 保存地址数据到 localStorage
 */
export function saveAddresses() {
  saveToStorage('mock_addresses', addresses)
}
