<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useAuth } from '@/composables/useAuth'
import { adminLogin } from '@/api'
import { setStorage } from '@/utils/storage'
import { ADMIN_TOKEN_KEY } from '@campus-food/shared'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

/**
 * 登录类型：user（学生）或 admin（管理员）
 */
const loginType = ref<'user' | 'admin'>('user')

// 学生登录表单
const studentForm = ref({
  studentId: '',
  password: '',
})

// 管理员登录表单
const adminForm = ref({
  username: '',
  password: '',
})

const loading = ref(false)

/**
 * 处理学生登录
 */
async function handleUserLogin() {
  if (!studentForm.value.studentId) {
    showToast('请输入学号')
    return
  }
  if (!studentForm.value.password) {
    showToast('请输入密码')
    return
  }

  loading.value = true
  const success = await login(studentForm.value.studentId, studentForm.value.password)
  loading.value = false

  if (success) {
    showToast('登录成功')
    router.push('/')
  } else {
    showToast('学号或密码错误')
  }
}

/**
 * 处理管理员登录
 */
async function handleAdminLogin() {
  if (!adminForm.value.username) {
    showToast('请输入用户名')
    return
  }
  if (!adminForm.value.password) {
    showToast('请输入密码')
    return
  }

  loading.value = true
  try {
    // 调用管理员登录 API
    const { data } = await adminLogin({
      username: adminForm.value.username,
      password: adminForm.value.password,
    })

    console.log('管理员登录成功，token:', data.data.token)

    const token = data.data.token

    // 保存管理员 token 到当前域（用户端）
    setStorage(ADMIN_TOKEN_KEY, token)

    console.log('Token 已保存，准备跳转到管理后台')

    showToast('登录成功')

    // 跳转到管理后台，通过 URL 参数传递 token
    // 管理端会从 URL 读取 token 并保存到自己的 localStorage
    setTimeout(() => {
      const targetUrl = `http://localhost:3001/dashboard?token=${encodeURIComponent(token)}`
      console.log('开始跳转到:', targetUrl)
      window.location.href = targetUrl
    }, 500)
  } catch (error) {
    console.error('管理员登录失败:', error)
    showToast('用户名或密码错误')
  } finally {
    loading.value = false
  }
}

/**
 * 提交登录表单
 */
function handleLogin() {
  if (loginType.value === 'user') {
    handleUserLogin()
  } else {
    handleAdminLogin()
  }
}

/**
 * 前往注册页
 */
function goToRegister() {
  router.push('/register')
}

/**
 * 检查 URL 参数，自动切换到管理员登录
 */
onMounted(() => {
  if (route.query.redirect === 'admin') {
    loginType.value = 'admin'
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-header">
      <h1>校园点餐</h1>
      <p>{{ loginType === 'user' ? '欢迎使用学生点餐系统' : '管理后台登录' }}</p>
    </div>

    <!-- 角色切换 Tab -->
    <div class="login-tabs">
      <van-tabs v-model:active="loginType" shrink>
        <van-tab title="学生登录" name="user" />
        <van-tab title="管理员登录" name="admin" />
      </van-tabs>
    </div>

    <!-- 学生登录表单 -->
    <van-form v-if="loginType === 'user'" @submit="handleLogin">
      <van-cell-group inset>
        <van-field
          v-model="studentForm.studentId"
          name="studentId"
          label="学号"
          placeholder="请输入学号"
          :rules="[{ required: true, message: '请输入学号' }]"
        />
        <van-field
          v-model="studentForm.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
      </van-cell-group>

      <div class="login-button">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :loading="loading"
        >
          登录
        </van-button>
        <van-button round block plain @click="goToRegister" class="register-button">
          还没有账号？立即注册
        </van-button>
      </div>

      <div class="login-tip">
        <p>测试账号：2021001</p>
        <p>测试密码：password123</p>
      </div>
    </van-form>

    <!-- 管理员登录表单 -->
    <van-form v-else @submit="handleLogin">
      <van-cell-group inset>
        <van-field
          v-model="adminForm.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />
        <van-field
          v-model="adminForm.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
      </van-cell-group>

      <div class="login-button">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :loading="loading"
        >
          登录
        </van-button>
      </div>

      <div class="login-tip">
        <p>测试账号：admin</p>
        <p>测试密码：admin123</p>
      </div>
    </van-form>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  color: #fff;

  h1 {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    opacity: 0.9;
  }
}

.login-tabs {
  margin-bottom: 20px;

  :deep(.van-tabs__nav) {
    background: transparent;
  }

  :deep(.van-tab) {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
  }

  :deep(.van-tab--active) {
    color: #fff;
    font-weight: bold;
  }

  :deep(.van-tabs__line) {
    background-color: #fff;
  }
}

.login-button {
  margin: 30px 16px 0;

  .register-button {
    margin-top: 12px;
    background-color: transparent !important;
    color: #fff !important;
    border-color: rgba(255, 255, 255, 0.8) !important;

    :deep(.van-button__text) {
      color: #fff !important;
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
  }
}

.login-tip {
  margin-top: 40px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  opacity: 0.8;

  p {
    margin: 4px 0;
  }
}
</style>
