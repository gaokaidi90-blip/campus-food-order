<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  if (userStore.isLoggedIn() && !userStore.userInfo) {
    userStore.fetchUserInfo()
  }
})
</script>

<template>
  <div class="home-container">
    <h1>首页</h1>
    <p v-if="userStore.userInfo">欢迎，{{ userStore.userInfo.name }}</p>
    <van-button type="primary" @click="$router.push('/login')">
      去登录
    </van-button>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  padding: 20px;
  text-align: center;
}
</style>
