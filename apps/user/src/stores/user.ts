import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@campus-food/shared'
import { TOKEN_KEY } from '@campus-food/shared'
import { setStorage, getStorage, removeStorage } from '@/utils/storage'
import { login as loginApi, getProfile } from '@/api'

/**
 * 用户状态管理 Store
 * 管理用户登录状态、token 和用户信息
 */
export const useUserStore = defineStore('user', () => {
  // 从本地存储初始化 token
  const token = ref<string>(getStorage<string>(TOKEN_KEY) || '')
  // 用户信息
  const userInfo = ref<User | null>(null)

  /**
   * 用户登录
   * @param studentId 学号
   * @param password 密码
   * @returns 返回 token 和用户信息
   */
  async function login(studentId: string, password: string) {
    const { data } = await loginApi({ studentId, password })
    // 保存 token 和用户信息到状态
    token.value = data.data.token
    userInfo.value = data.data.user
    // 持久化 token 到本地存储
    setStorage(TOKEN_KEY, data.data.token)
    return data.data
  }

  /**
   * 获取用户信息
   * 用于页面刷新后恢复用户信息
   */
  async function fetchUserInfo() {
    const { data } = await getProfile()
    userInfo.value = data.data
    return data.data
  }

  /**
   * 登出
   * 清除 token 和用户信息
   */
  function logout() {
    token.value = ''
    userInfo.value = null
    removeStorage(TOKEN_KEY)
  }

  /**
   * 检查是否已登录
   * @returns boolean
   */
  const isLoggedIn = () => !!token.value

  return {
    token,
    userInfo,
    login,
    fetchUserInfo,
    logout,
    isLoggedIn,
  }
})
