<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const studentId = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!studentId.value) {
    showToast('请输入学号')
    return
  }
  if (!password.value) {
    showToast('请输入密码')
    return
  }

  loading.value = true
  const success = await login(studentId.value, password.value)
  loading.value = false

  if (success) {
    showToast('登录成功')
    router.push('/')
  } else {
    showToast('学号或密码错误')
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-header">
      <h1>校园点餐</h1>
      <p>欢迎使用学生点餐系统</p>
    </div>

    <van-form @submit="handleLogin">
      <van-cell-group inset>
        <van-field
          v-model="studentId"
          name="studentId"
          label="学号"
          placeholder="请输入学号"
          :rules="[{ required: true, message: '请输入学号' }]"
        />
        <van-field
          v-model="password"
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
    </van-form>

    <div class="login-tip">
      <p>测试账号：2021001</p>
      <p>测试密码：password123</p>
    </div>
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
  margin-bottom: 60px;
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

.login-button {
  margin: 30px 16px 0;
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
