<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserProfile } from '@/api'
import { showToast, showConfirmDialog } from 'vant'
import type { User } from '@campus-food/shared'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const userInfo = ref<Omit<User, 'password'> | null>(null)

/**
 * 加载用户信息
 */
async function fetchUserInfo() {
  loading.value = true
  try {
    const { data } = await getUserProfile()
    userInfo.value = data.data
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

/**
 * 退出登录
 * 清除本地 token 并跳转到登录页
 */
async function handleLogout() {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要退出登录吗？',
    })

    // 调用 store 中的退出方法
    userStore.logout()

    // 跳转到登录页
    router.replace('/login')
  } catch {
    // 用户取消退出
  }
}

/**
 * 跳转到订单列表
 */
function goToOrders() {
  router.push('/order')
}

/**
 * 跳转到地址管理
 */
function goToAddress() {
  router.push('/address')
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <div class="profile-container">
    <van-nav-bar title="我的" fixed />

    <div class="content">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <van-skeleton :loading="loading" :row="3">
          <div v-if="userInfo" class="user-info">
            <van-icon name="user-circle-o" class="avatar" />
            <div class="info">
              <div class="name">{{ userInfo.name }}</div>
              <div class="student-id">学号：{{ userInfo.studentId }}</div>
              <div class="phone">手机：{{ userInfo.phone }}</div>
            </div>
          </div>
        </van-skeleton>
      </div>

      <!-- 功能列表 -->
      <van-cell-group inset title="我的服务">
        <van-cell title="我的订单" icon="orders-o" is-link @click="goToOrders" />
        <van-cell title="收货地址" icon="location-o" is-link @click="goToAddress" />
      </van-cell-group>

      <!-- 退出登录 -->
      <div class="logout-wrapper">
        <van-button type="danger" block @click="handleLogout">退出登录</van-button>
      </div>
    </div>

    <van-tabbar route>
      <van-tabbar-item icon="wap-home" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/order">订单</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="less" scoped>
.profile-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 50px;
}

.content {
  padding-top: 46px;
}

.user-card {
  background: #fff;
  padding: 24px 16px;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  font-size: 64px;
  color: #1989fa;
  margin-right: 16px;
}

.info {
  flex: 1;
}

.name {
  font-size: 18px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 8px;
}

.student-id,
.phone {
  font-size: 14px;
  color: #969799;
  margin-bottom: 4px;
}

.logout-wrapper {
  margin-top: 24px;
  padding: 0 16px;
}
</style>
