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
   * Restore the admin identity used for UI permissions from the signed token.
   * The backend remains the authority and validates the token on every API call.
   */
  function restoreFromToken() {
    if (adminInfo.value) return

    const token = getStorage<string>(ADMIN_TOKEN_KEY)
    if (!token) return

    try {
      const payloadPart = token.split('.')[1]
      if (!payloadPart) return

      const base64 = payloadPart
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(payloadPart.length / 4) * 4, '=')
      const payload = JSON.parse(atob(base64)) as {
        type?: string
        adminId?: string
        username?: string
        role?: string
        canteenId?: number | null
      }

      if (
        payload.type !== 'admin' ||
        !payload.adminId ||
        !payload.username ||
        (payload.role !== 'admin' && payload.role !== 'superadmin')
      ) {
        return
      }

      adminInfo.value = {
        id: payload.adminId,
        username: payload.username,
        name: payload.username,
        phone: '',
        role: payload.role,
        canteenId: payload.canteenId ?? null,
        createdAt: '',
        updatedAt: '',
      }
    } catch {
      // Invalid tokens are rejected by protected backend endpoints.
    }
  }

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
    restoreFromToken,
    login,
    logout,
    isLoggedIn,
  }
})
