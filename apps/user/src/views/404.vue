<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 返回首页
 */
function goHome() {
  router.replace('/')
}
</script>

<template>
  <div class="not-found-container">
    <van-empty
      image="error"
      description="页面不存在"
    >
      <van-button type="primary" @click="goHome">返回首页</van-button>
    </van-empty>
  </div>
</template>

<style lang="less" scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
}
</style>
