import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

/**
 * 认证相关的组合式函数
 */
export function useAuth() {
  const userStore = useUserStore()
  const router = useRouter()

  /**
   * 登录
   */
  async function login(studentId: string, password: string) {
    try {
      await userStore.login(studentId, password)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  /**
   * 登出
   */
  function logout() {
    userStore.logout()
    router.push('/login')
  }

  /**
   * 检查登录状态
   */
  function checkAuth() {
    return userStore.isLoggedIn()
  }

  return {
    login,
    logout,
    checkAuth,
    userInfo: userStore.userInfo,
  }
}
