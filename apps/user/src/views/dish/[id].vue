<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Dish } from '@campus-food/shared'
import { getDishDetail } from '@/api'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const dish = ref<Dish | null>(null)
const quantity = ref(1)

async function fetchDishDetail() {
  loading.value = true
  try {
    const { data } = await getDishDetail(route.params.id as string)
    dish.value = data.data
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

function handleAddToCart() {
  showToast('加入购物车成功')
  router.back()
}

onMounted(() => {
  fetchDishDetail()
})
</script>

<template>
  <div class="dish-container">
    <van-nav-bar
      title="菜品详情"
      left-arrow
      @click-left="router.back()"
      fixed
    />

    <div class="content">
      <van-loading v-if="loading" class="loading" />

      <template v-else-if="dish">
        <van-image :src="dish.image" fit="cover" class="dish-image" />

        <div class="dish-detail">
          <div class="dish-header">
            <h2 class="dish-name">{{ dish.name }}</h2>
            <div class="dish-price">
              <span class="current-price">¥{{ dish.price }}</span>
              <span class="original-price" v-if="dish.originalPrice">
                ¥{{ dish.originalPrice }}
              </span>
            </div>
          </div>

          <div class="dish-desc">{{ dish.description }}</div>

          <van-cell-group inset>
            <van-cell title="规格" :value="dish.specifications || '无'" />
            <van-cell title="库存" :value="`剩余 ${dish.stock} 份`" />
            <van-cell title="销量" :value="`已售 ${dish.sales} 份`" />
          </van-cell-group>
        </div>
      </template>
    </div>

    <div class="footer" v-if="dish">
      <van-stepper v-model="quantity" min="1" :max="dish.stock" />
      <van-button type="primary" round block @click="handleAddToCart">
        加入购物车
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dish-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 70px;
}

.content {
  padding-top: 46px;
}

.loading {
  padding: 40px 0;
  text-align: center;
}

.dish-image {
  width: 100%;
  height: 300px;
}

.dish-detail {
  padding: 16px;
}

.dish-header {
  margin-bottom: 16px;
}

.dish-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.dish-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-size: 24px;
  font-weight: bold;
  color: #ee0a24;
}

.original-price {
  font-size: 14px;
  color: #969799;
  text-decoration: line-through;
}

.dish-desc {
  font-size: 14px;
  color: #646566;
  line-height: 1.6;
  margin-bottom: 16px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;

  .van-button {
    flex: 1;
  }
}
</style>
