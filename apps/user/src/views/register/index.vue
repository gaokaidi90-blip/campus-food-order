<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { register } from '@/api'
import { useUserStore } from '@/stores/user'
import { setStorage } from '@/utils/storage'
import { TOKEN_KEY } from '@campus-food/shared'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const form = ref({
  studentId: '',
  name: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)

/**
 * 表单验证
 */
function validateForm(): boolean {
  if (!form.value.studentId) {
    showToast('请输入学号')
    return false
  }

  if (!form.value.name) {
    showToast('请输入姓名')
    return false
  }

  if (!form.value.phone) {
    showToast('请输入手机号')
    return false
  }

  // 验证手机号格式
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(form.value.phone)) {
    showToast('请输入正确的手机号')
    return false
  }

  if (!form.value.password) {
    showToast('请输入密码')
    return false
  }

  if (form.value.password.length < 6) {
    showToast('密码至少 6 位')
    return false
  }

  if (!form.value.confirmPassword) {
    showToast('请确认密码')
    return false
  }

  if (form.value.password !== form.value.confirmPassword) {
    showToast('两次密码不一致')
    return false
  }

  return true
}

/**
 * 处理注册
 */
async function handleRegister() {
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    const { data } = await register({
      studentId: form.value.studentId,
      name: form.value.name,
      phone: form.value.phone,
      password: form.value.password,
    })

    // 保存 token 和用户信息（使用 .value 赋值）
    userStore.token.value = data.data.token
    userStore.userInfo.value = data.data.user
    // 持久化 token 到 localStorage
    setStorage(TOKEN_KEY, data.data.token)

    showToast({ type: 'success', message: '注册成功' })

    // 跳转到首页
    setTimeout(() => {
      router.replace('/')
    }, 1000)
  } catch (err: any) {
    showToast({ type: 'fail', message: err.message || '注册失败' })
  } finally {
    loading.value = false
  }
}

/**
 * 前往登录页
 */
function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="register-page">
    <div class="register-header">
      <h1>用户注册</h1>
      <p>欢迎注册校园外卖点餐系统</p>
    </div>

    <van-form @submit="handleRegister">
      <van-cell-group inset class="register-form">
        <van-field
          v-model="form.studentId"
          name="studentId"
          label="学号"
          placeholder="请输入学号"
          :rules="[{ required: true, message: '请输入学号' }]"
        />
        <van-field
          v-model="form.name"
          name="name"
          label="姓名"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请输入姓名' }]"
        />
        <van-field
          v-model="form.phone"
          name="phone"
          label="手机号"
          type="tel"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请输入手机号' }]"
        />
        <van-field
          v-model="form.password"
          name="password"
          type="password"
          label="密码"
          placeholder="请输入密码（至少6位）"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
        <van-field
          v-model="form.confirmPassword"
          name="confirmPassword"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[{ required: true, message: '请确认密码' }]"
        />
      </van-cell-group>

      <div class="button-group">
        <van-button
          block
          type="primary"
          native-type="submit"
          :loading="loading"
          loading-text="注册中..."
        >
          立即注册
        </van-button>
        <van-button block plain @click="goToLogin"> 已有账号？去登录 </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="less" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 16px;

  .register-header {
    text-align: center;
    margin-bottom: 40px;
    color: #fff;

    h1 {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      opacity: 0.9;
    }
  }

  .register-form {
    background: #fff !important;

    :deep(.van-cell) {
      background: #fff;
    }

    :deep(.van-field__label) {
      color: #323233;
    }

    :deep(.van-field__control) {
      color: #323233;
    }

    :deep(.van-field__control::placeholder) {
      color: #c8c9cc;
    }
  }

  .button-group {
    padding: 16px;

    .van-button {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
