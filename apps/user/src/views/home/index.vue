<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Canteen } from '@campus-food/shared'
import { getCanteens } from '@/api'
import { showToast } from 'vant'
import { getCanteenImage } from '@/utils/canteenImage'

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
    <van-nav-bar title="AI校园点餐" fixed>
      <template #right>
        <van-icon name="chat-o" size="20" @click="router.push('/ai-recommend')" />
      </template>
    </van-nav-bar>

    <div class="content">
      <van-pull-refresh v-model="loading" @refresh="fetchCanteens">
        <!-- AI 推荐入口 -->
        <div class="ai-features">
          <div class="feature-card" @click="router.push('/personalized')">
            <div class="feature-icon">
              <van-icon name="fire" color="#ff976a" size="24" />
            </div>
            <div class="feature-content">
              <div class="feature-title">为你推荐</div>
              <div class="feature-desc">基于你的喜好智能推荐</div>
            </div>
            <van-icon name="arrow" class="feature-arrow" />
          </div>
          <div class="feature-card" @click="router.push('/ai-recommend')">
            <div class="feature-icon">
              <van-icon name="chat-o" color="#1989fa" size="24" />
            </div>
            <div class="feature-content">
              <div class="feature-title">AI 找餐</div>
              <div class="feature-desc">告诉 AI 你想吃什么</div>
            </div>
            <van-icon name="arrow" class="feature-arrow" />
          </div>
        </div>

        <div class="canteen-list">
          <div v-for="canteen in canteens" :key="canteen.id" class="canteen-item" @click="handleCanteenClick(canteen)">
            <van-image :src="getCanteenImage(canteen)" fit="cover" class="canteen-image" />
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

.ai-features {
  padding: 12px;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.feature-card {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #f7f8fa;
  border-radius: 10px;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
  margin-left: 10px;
  overflow: hidden;
}

.feature-title {
  font-size: 14px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 2px;
}

.feature-desc {
  font-size: 12px;
  color: #969799;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feature-arrow {
  flex-shrink: 0;
  margin-left: 8px;
  color: #c8c9cc;
  font-size: 14px;
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
