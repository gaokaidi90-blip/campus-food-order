<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { Dish } from '@campus-food/shared'
import { getAIRecommendation } from '@/api'
import DishCard from '@/components/DishCard.vue'

const router = useRouter()
const query = ref('')
const loading = ref(false)
const searched = ref(false)
const dishes = ref<Dish[]>([])

async function handleSearch() {
  const trimmedQuery = query.value.trim()

  if (!trimmedQuery) {
    showToast('请输入查询内容')
    return
  }

  if (trimmedQuery.length > 200) {
    showToast('查询内容过长，请控制在200字以内')
    return
  }

  loading.value = true
  searched.value = true

  try {
    const { data } = await getAIRecommendation(trimmedQuery)
    dishes.value = data.data

    if (dishes.value.length === 0) {
      showToast('没有找到符合条件的菜品')
    }
  } catch (error) {
    console.error('AI 推荐失败:', error)
    showToast('推荐失败，请稍后重试')
    dishes.value = []
  } finally {
    loading.value = false
  }
}

function handleDishClick(dish: Dish) {
  router.push(`/dish/${dish.id}`)
}

function handleQuickTag(text: string) {
  query.value = text
  handleSearch()
}
</script>

<template>
  <div class="ai-recommend-container">
    <!-- 顶部导航 -->
    <van-nav-bar title="AI 找餐" fixed left-arrow @click-left="router.back()" />

    <div class="content">
      <!-- 搜索输入 -->
      <div class="search-wrapper">
        <van-search
          v-model="query"
          placeholder="试试：推荐 20 元以内、不辣、清淡的菜"
          @search="handleSearch"
        />
      </div>

      <!-- 快速标签 -->
      <div v-if="!searched" class="quick-tags">
        <van-tag plain type="primary" size="large" @click="handleQuickTag('推荐不辣的菜')">
          不辣
        </van-tag>
        <van-tag plain type="success" size="large" @click="handleQuickTag('20元以内')">
          实惠
        </van-tag>
        <van-tag plain type="warning" size="large" @click="handleQuickTag('清淡的菜')">
          清淡
        </van-tag>
        <van-tag plain type="danger" size="large" @click="handleQuickTag('便宜又好吃的')">
          好吃
        </van-tag>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-wrapper">
        <van-loading size="24px">AI 正在为您推荐...</van-loading>
      </div>

      <!-- 结果展示 -->
      <div v-else-if="dishes.length > 0" class="result-list">
        <div class="result-header">
          <van-icon name="star-o" />
          找到 {{ dishes.length }} 个菜品
        </div>
        <DishCard
          v-for="dish in dishes"
          :key="dish.id"
          :dish="dish"
          @click="handleDishClick(dish)"
        />
      </div>

      <!-- 空状态 -->
      <van-empty v-else-if="searched" description="没有找到合适的菜品，试试换个说法吧" />

      <!-- 初始状态提示 -->
      <div v-else class="tips">
        <div class="tips-title">💡 试试这样说</div>
        <div class="tips-item">• 推荐 20 元以内、不辣的菜</div>
        <div class="tips-item">• 想吃清淡的</div>
        <div class="tips-item">• 有什么便宜又好吃的</div>
        <div class="tips-item">• 推荐面食</div>
        <div class="tips-divider"></div>
        <div class="tips-note">
          <van-icon name="info-o" />
          AI 会根据您的描述智能推荐菜品
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ai-recommend-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding-top: 46px;
}

.search-wrapper {
  background: #fff;
  padding-bottom: 8px;
}

.quick-tags {
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  background: #fff;
  margin-bottom: 8px;

  .van-tag {
    cursor: pointer;
  }
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
}

.result-list {
  padding: 0 12px 12px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px 4px 12px;
  font-size: 14px;
  color: #646566;
  font-weight: 500;

  .van-icon {
    color: #ff976a;
  }
}

.tips {
  background: #fff;
  margin: 12px;
  padding: 24px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tips-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 16px;
}

.tips-item {
  font-size: 14px;
  color: #646566;
  line-height: 28px;
  padding-left: 4px;
}

.tips-divider {
  height: 1px;
  background: #ebedf0;
  margin: 20px 0;
}

.tips-note {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #969799;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 8px;

  .van-icon {
    flex-shrink: 0;
  }
}
</style>
