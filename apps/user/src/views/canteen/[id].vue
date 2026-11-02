<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Canteen, Category, Dish } from '@campus-food/shared'
import { getCanteenDetail, getDishes } from '@/api'
import { showToast } from 'vant'
import DishCard from '@/components/DishCard.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const canteen = ref<Canteen | null>(null)
const categories = ref<Category[]>([])
const dishes = ref<Dish[]>([])
const activeCategory = ref('')

const filteredDishes = computed(() => {
  if (!activeCategory.value) return dishes.value
  return dishes.value.filter((d) => d.categoryId === activeCategory.value)
})

async function fetchCanteenDetail() {
  loading.value = true
  try {
    const { data } = await getCanteenDetail(route.params.id as string)
    canteen.value = data.data
    categories.value = data.data.categories || []

    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0]?.id || ''
    }
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

async function fetchDishes() {
  try {
    const { data } = await getDishes({ canteenId: route.params.id as string })
    dishes.value = data.data
  } catch (error) {
    showToast('加载菜品失败')
  }
}

function handleDishClick(dish: Dish) {
  router.push(`/dish/${dish.id}`)
}

onMounted(() => {
  fetchCanteenDetail()
  fetchDishes()
})
</script>

<template>
  <div class="canteen-container">
    <van-nav-bar
      :title="canteen?.name || '食堂详情'"
      left-arrow
      @click-left="router.back()"
      fixed
    />

    <div class="content">
      <van-loading v-if="loading" class="loading" />

      <template v-else-if="canteen">
        <div class="canteen-header">
          <van-image :src="canteen.image" fit="cover" class="header-image" />
          <div class="header-info">
            <h2>{{ canteen.name }}</h2>
            <p>{{ canteen.description }}</p>
            <div class="meta">
              <van-tag type="primary">{{ canteen.openTime }} - {{ canteen.closeTime }}</van-tag>
              <span>{{ canteen.address }}</span>
            </div>
          </div>
        </div>

        <van-tabs v-model:active="activeCategory" sticky :offset-top="46">
          <van-tab
            v-for="category in categories"
            :key="category.id"
            :title="category.name"
            :name="category.id"
          >
            <div class="dish-list">
              <DishCard
                v-for="dish in filteredDishes"
                :key="dish.id"
                :dish="dish"
                @click="handleDishClick"
              />
            </div>
          </van-tab>
        </van-tabs>

        <van-empty v-if="filteredDishes.length === 0" description="暂无菜品" />
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.canteen-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding-top: 46px;
}

.loading {
  padding: 40px 0;
  text-align: center;
}

.canteen-header {
  background: #fff;
  padding: 16px;
  margin-bottom: 8px;
}

.header-image {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.header-info {
  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #646566;
    margin-bottom: 12px;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #969799;
  }
}

.dish-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
