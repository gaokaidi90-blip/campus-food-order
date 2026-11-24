<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { Dish } from '@campus-food/shared'
import { getPersonalizedRecommend } from '@/api'
import DishCard from '@/components/DishCard.vue'

const router = useRouter()
const loading = ref(false)
const dishes = ref<Dish[]>([])
const hasHistory = ref(false)
const reason = ref('')
const preferences = ref<any>(null)

async function fetchRecommendations() {
  loading.value = true
  try {
    const { data } = await getPersonalizedRecommend()
    dishes.value = data.data.dishes
    hasHistory.value = data.data.hasHistory
    reason.value = data.data.reason
    preferences.value = data.data.preferences
  } catch (error) {
    console.error('获取推荐失败:', error)
    showToast('获取推荐失败')
  } finally {
    loading.value = false
  }
}

function handleDishClick(dish: Dish) {
  router.push(`/dish/${dish.id}`)
}

onMounted(() => {
  fetchRecommendations()
})
</script>

<template>
  <div class="personalized-container">
    <van-nav-bar title="为你推荐" fixed left-arrow @click-left="router.back()" />

    <div class="content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-wrapper">
        <van-loading size="24px">正在分析您的偏好...</van-loading>
      </div>

      <template v-else>
        <!-- 推荐理由 -->
        <div class="reason-card">
          <div class="reason-header">
            <van-icon name="fire" color="#ff976a" />
            <span>推荐理由</span>
          </div>
          <div class="reason-text">{{ reason }}</div>

          <!-- 用户偏好分析（有历史订单才显示） -->
          <div v-if="hasHistory && preferences" class="preferences">
            <div class="preference-item">
              <span class="label">订单数量：</span>
              <span class="value">{{ preferences.orderCount }} 单</span>
            </div>
            <div class="preference-item">
              <span class="label">平均消费：</span>
              <span class="value">¥{{ preferences.avgOrderAmount }}</span>
            </div>
            <div class="preference-item">
              <span class="label">价格偏好：</span>
              <span class="value">¥{{ preferences.avgPrice }} 左右</span>
            </div>
            <div class="preference-item">
              <span class="label">累计消费：</span>
              <span class="value highlight">¥{{ preferences.totalSpent }}</span>
            </div>
          </div>

          <!-- 新用户提示 -->
          <div v-else class="new-user-tip">
            <van-icon name="info-o" />
            <span>开始点餐后，我们会根据您的喜好推荐更符合您口味的菜品</span>
          </div>
        </div>

        <!-- 推荐菜品列表 -->
        <div v-if="dishes.length > 0" class="dishes-section">
          <div class="section-header">
            <van-icon name="star-o" />
            <span>{{ hasHistory ? '根据您的喜好推荐' : '热门推荐' }}</span>
          </div>
          <DishCard
            v-for="dish in dishes"
            :key="dish.id"
            :dish="dish"
            @click="handleDishClick(dish)"
          />
        </div>

        <!-- 空状态 -->
        <van-empty v-else description="暂无推荐菜品" />
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.personalized-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding-top: 46px;
  padding-bottom: 20px;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
}

.reason-card {
  background: #fff;
  margin: 12px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.reason-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;

  .van-icon {
    font-size: 20px;
  }
}

.reason-text {
  font-size: 14px;
  color: #646566;
  line-height: 22px;
  padding: 12px;
  background: #fff7f0;
  border-radius: 8px;
  border-left: 3px solid #ff976a;
}

.preferences {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebedf0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.preference-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #f7f8fa;
  border-radius: 8px;

  .label {
    font-size: 12px;
    color: #969799;
    margin-bottom: 4px;
  }

  .value {
    font-size: 15px;
    color: #323233;
    font-weight: 600;

    &.highlight {
      color: #ee0a24;
    }
  }
}

.new-user-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
  font-size: 13px;
  color: #646566;

  .van-icon {
    flex-shrink: 0;
    color: #1989fa;
    font-size: 16px;
  }
}

.dishes-section {
  padding: 0 12px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px 4px 12px;
  font-size: 15px;
  color: #323233;
  font-weight: 600;

  .van-icon {
    color: #ff976a;
    font-size: 18px;
  }
}
</style>
