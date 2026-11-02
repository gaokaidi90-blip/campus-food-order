<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Canteen } from '@campus-food/shared'
import { getCanteens } from '@/api'
import { showToast } from 'vant'

const router = useRouter()
const loading = ref(false)
const canteens = ref<Canteen[]>([])

async function fetchCanteens() {
  loading.value = true
  try {
    const { data } = await getCanteens()
    canteens.value = data.data
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

function handleCanteenClick(canteen: Canteen) {
  router.push(`/canteen/${canteen.id}`)
}

onMounted(() => {
  fetchCanteens()
})
</script>

<template>
  <div class="home-container">
    <van-nav-bar title="校园点餐" fixed />

    <div class="content">
      <van-pull-refresh v-model="loading" @refresh="fetchCanteens">
        <div class="canteen-list">
          <div
            v-for="canteen in canteens"
            :key="canteen.id"
            class="canteen-item"
            @click="handleCanteenClick(canteen)"
          >
            <van-image :src="canteen.image" fit="cover" class="canteen-image" />
            <div class="canteen-info">
              <div class="canteen-name">{{ canteen.name }}</div>
              <div class="canteen-desc">{{ canteen.description }}</div>
              <div class="canteen-meta">
                <van-tag type="primary" size="small">{{ canteen.openTime }} - {{ canteen.closeTime }}</van-tag>
                <span class="canteen-address">{{ canteen.address }}</span>
              </div>
            </div>
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>

        <van-empty v-if="!loading && canteens.length === 0" description="暂无食堂" />
      </van-pull-refresh>
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
.home-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding-top: 46px;
  padding-bottom: 50px;
  min-height: 100vh;
}

.canteen-list {
  padding: 12px;
}

.canteen-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:active {
    background: #f7f8fa;
  }
}

.canteen-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
}

.canteen-info {
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
}

.canteen-name {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 6px;
}

.canteen-desc {
  font-size: 13px;
  color: #969799;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.canteen-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.canteen-address {
  color: #646566;
}

.arrow-icon {
  color: #c8c9cc;
  font-size: 16px;
  margin-left: 8px;
}
</style>

