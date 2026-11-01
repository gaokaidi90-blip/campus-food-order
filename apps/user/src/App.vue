<script setup lang="ts">
import { RouterView } from 'vue-router'
import 'vant/lib/index.css'
import '@/assets/styles/reset.less'
import '@/assets/styles/variables.less'
</script>

<template>
  <RouterView />
</template>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
