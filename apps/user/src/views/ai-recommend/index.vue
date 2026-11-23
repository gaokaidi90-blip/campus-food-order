<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { Dish, AICriteria } from '@campus-food/shared'
import { getAIRecommendation } from '@/api'
import DishCard from '@/components/DishCard.vue'

const router = useRouter()
const query = ref('')
const loading = ref(false)
const searched = ref(false)
const dishes = ref<Dish[]>([])
const criteria = ref<AICriteria | null>(null)
const showThinking = ref(false)

// 监听输入框变化，清空时重置状态
watch(query, (newVal) => {
  if (!newVal.trim()) {
    searched.value = false
    dishes.value = []
    criteria.value = null
  }
})

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
  showThinking.value = true
  criteria.value = null

  try {
    const { data } = await getAIRecommendation(trimmedQuery)
    criteria.value = data.data.criteria

    // 延迟展示结果，让用户看到思考过程
    await new Promise(resolve => setTimeout(resolve, 800))

    dishes.value = data.data.dishes

    if (dishes.value.length === 0) {
      showToast('没有找到符合条件的菜品')
    }
  } catch (error) {
    console.error('AI 推荐失败:', error)
    showToast('推荐失败，请稍后重试')
    dishes.value = []
    criteria.value = null
  } finally {
    loading.value = false
    showThinking.value = false
  }
}

function handleDishClick(dish: Dish) {
  router.push(`/dish/${dish.id}`)
}

function handleQuickTag(text: string) {
  query.value = text
  handleSearch()
}

// 格式化辣度
function formatSpicy(spicy?: string) {
  const map = {
    no: '不辣',
    light: '微辣/中辣',
    any: '可以辣'
  }
  return spicy && spicy in map ? map[spicy as keyof typeof map] : '无要求'
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

      <!-- AI 思考过程 -->
      <div v-if="criteria && !loading" class="thinking-process">
        <div class="thinking-header">
          <van-icon name="bulb-o" color="#ff976a" />
          <span>AI 分析结果</span>
        </div>

        <div class="thinking-items">
          <div v-if="criteria.maxPrice" class="thinking-item">
            <van-icon name="balance-o" color="#07c160" />
            <span class="label">预算：</span>
            <span class="value">{{ criteria.maxPrice }} 元以内</span>
          </div>

          <div v-if="criteria.keywords && criteria.keywords.length > 0" class="thinking-item">
            <van-icon name="search" color="#1989fa" />
            <span class="label">关键词：</span>
            <span class="value">{{ criteria.keywords.join('、') }}</span>
          </div>

          <div v-if="criteria.spicy && criteria.spicy !== 'any'" class="thinking-item">
            <van-icon name="fire-o" color="#ee0a24" />
            <span class="label">辣度：</span>
            <span class="value">{{ formatSpicy(criteria.spicy) }}</span>
          </div>

          <div v-if="criteria.taste && criteria.taste.length > 0" class="thinking-item">
            <van-icon name="good-job-o" color="#ff976a" />
            <span class="label">口味：</span>
            <span class="value">{{ criteria.taste.join('、') }}</span>
          </div>
        </div>

        <div class="thinking-result">
          <van-icon name="checked" color="#07c160" />
          找到 {{ dishes.length }} 个符合条件的菜品
        </div>
      </div>

      <!-- 结果展示 -->
      <div v-if="!loading && dishes.length > 0" class="result-list">
        <div class="result-header">
          <van-icon name="star-o" />
          推荐菜品
        </div>
        <DishCard
          v-for="dish in dishes"
          :key="dish.id"
          :dish="dish"
          @click="handleDishClick(dish)"
        />
      </div>

      <!-- 空状态 -->
      <van-empty v-else-if="searched && !loading && dishes.length === 0" description="没有找到合适的菜品，试试换个说法吧" />

      <!-- 初始状态提示 -->
      <div v-else-if="!loading" class="tips">
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

.thinking-process {
  background: #fff;
  margin: 12px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.thinking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebedf0;

  .van-icon {
    font-size: 18px;
  }
}

.thinking-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.thinking-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 8px 12px;
  background: #f7f8fa;
  border-radius: 8px;

  .van-icon {
    flex-shrink: 0;
    font-size: 16px;
  }

  .label {
    color: #646566;
    font-weight: 500;
  }

  .value {
    color: #323233;
  }
}

.thinking-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #07c160;

  .van-icon {
    font-size: 16px;
  }
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
