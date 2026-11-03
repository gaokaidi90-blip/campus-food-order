<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const adminStore = useAdminStore()

// 表单引用
const formRef = ref<FormInstance>()

// 登录表单数据
const loginForm = ref({
  username: '',
  password: '',
})

// 加载状态
const loading = ref(false)

// 表单验证规则
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

/**
 * 提交登录表单
 */
async function handleLogin() {
  if (!formRef.value) return

  // 验证表单
  await formRef.value.validate()

  loading.value = true

  try {
    // 调用登录接口
    await adminStore.login(loginForm.value.username, loginForm.value.password)

    ElMessage.success('登录成功')

    // 跳转到首页
    router.replace('/')
  } catch (error) {
    // 错误已在 axios 拦截器中处理
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>校园点餐管理系统</h2>
        <p>Campus Food Order Management</p>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        size="large"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            native-type="submit"
            style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tip">
        <el-text type="info" size="small">
          测试账号：admin / admin123
        </el-text>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  h2 {
    margin: 0 0 8px;
    font-size: 24px;
    color: #303133;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }
}

.login-tip {
  text-align: center;
  margin-top: 16px;
}
</style>
