import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Admin } from '@campus-food/shared'
import { ADMIN_TOKEN_KEY } from '@campus-food/shared'
import { setStorage, getStorage, removeStorage } from '@/utils/storage'
import { login as loginApi } from '@/api'

/**
 * 管理员状态管理
 * 管理管理员登录状态、token 和用户信息
 */
export const useAdminStore = defineStore('admin', () => {
  // 管理员信息
  const adminInfo = ref<Omit<Admin, 'password'> | null>(null)

  /**
   * 是否为超级管理员
   */
  const isSuperAdmin = computed(() => adminInfo.value?.role === 'superadmin')

  /**
   * 当前管理员关联的食堂 ID
   */
  const canteenId = computed(() => adminInfo.value?.canteenId)

  /**
   * 登录
   * @param username 用户名
   * @param password 密码
   */
  async function login(username: string, password: string) {
    const { data } = await loginApi({ username, password })

    // 保存 token 到本地存储
    setStorage(ADMIN_TOKEN_KEY, data.data.token)

    // 保存管理员信息
    adminInfo.value = data.data.admin
  }

  /**
   * 退出登录
   * 清除本地存储的 token 和管理员信息
   */
  function logout() {
    removeStorage(ADMIN_TOKEN_KEY)
    adminInfo.value = null
  }

  /**
   * 检查是否已登录
   * @returns 是否存在有效 token
   */
  function isLoggedIn(): boolean {
    return !!getStorage<string>(ADMIN_TOKEN_KEY)
  }

  return {
    adminInfo,
    isSuperAdmin,
    canteenId,
    login,
    logout,
    isLoggedIn,
  }
})
