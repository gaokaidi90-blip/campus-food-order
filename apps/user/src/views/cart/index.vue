<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCart } from '@/composables/useCart'
import { useOrder } from '@/composables/useOrder'
import { showToast, showConfirmDialog } from 'vant'
import { getNutritionAnalysis } from '@/api'

const router = useRouter()
const cartStore = useCartStore()
const { updateCartItem, removeCartItem } = useCart()
const { createOrder } = useOrder()

const loading = ref(false)
const checkedIds = ref<string[]>([])
const showNutritionDialog = ref(false)
const nutritionLoading = ref(false)
const nutritionData = ref<any>(null)

/**
 * 计算选中的商品总价
 */
const checkedTotalPrice = computed(() => {
  return cartStore.cartItems
    .filter((item) => checkedIds.value.includes(item.id))
    .reduce((sum, item) => {
      const price = item.dish?.price || 0
      return sum + price * item.quantity
    }, 0)
})

/**
 * 计算选中的商品数量
 */
const checkedCount = computed(() => {
  return checkedIds.value.length
})

/**
 * 全选/取消全选
 */
const isAllChecked = computed({
  get: () => {
    return (
      cartStore.cartItems.length > 0 &&
      checkedIds.value.length === cartStore.cartItems.length
    )
  },
  set: (value: boolean) => {
    if (value) {
      checkedIds.value = cartStore.cartItems.map((item) => item.id)
    } else {
      checkedIds.value = []
    }
  },
})

/**
 * 加载购物车
 */
async function fetchCart() {
  loading.value = true
  try {
    await cartStore.fetchCart()
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

/**
 * 更新数量
 */
async function handleQuantityChange(id: string, quantity: number) {
  await updateCartItem(id, quantity)
}

/**
 * 删除购物车项
 */
async function handleDelete(id: string) {
  await showConfirmDialog({
    title: '提示',
    message: '确定删除该商品吗？',
  })
  await removeCartItem(id)
  // 从选中列表中移除
  checkedIds.value = checkedIds.value.filter((cId) => cId !== id)
}

/**
 * 结算
 */
async function handleCheckout() {
  if (checkedCount.value === 0) {
    showToast('请选择要结算的商品')
    return
  }

  // 获取选中的购物车项
  const selectedItems = cartStore.cartItems.filter((item) =>
    checkedIds.value.includes(item.id)
  )

  // 检查是否来自同一食堂
  const canteenIds = [...new Set(selectedItems.map((item) => item.canteenId))]
  if (canteenIds.length > 1) {
    showToast('只能选择同一食堂的菜品')
    return
  }

  // 跳转到结算页面
  router.push({
    path: '/checkout',
    query: {
      items: checkedIds.value.join(','),
    },
  })
}

/**
 * 营养分析
 */
async function handleNutritionAnalysis() {
  if (cartStore.cartItems.length === 0) {
    showToast('购物车是空的')
    return
  }

  showNutritionDialog.value = true
  nutritionLoading.value = true
  nutritionData.value = null

  try {
    const dishes = cartStore.cartItems.map((item) => ({
      name: item.dish?.name || '',
      price: item.dish?.price || 0,
      quantity: item.quantity
    }))

    const { data } = await getNutritionAnalysis(dishes)
    nutritionData.value = data.data
  } catch (error) {
    showToast('分析失败，请稍后重试')
    showNutritionDialog.value = false
  } finally {
    nutritionLoading.value = false
  }
}

onMounted(() => {
  fetchCart()
})
</script>

<template>
  <div class="cart-container">
    <van-nav-bar title="购物车" fixed />

    <div class="content">
      <van-pull-refresh v-model="loading" @refresh="fetchCart">
        <van-checkbox-group v-model="checkedIds">
          <van-swipe-cell
            v-for="item in cartStore.cartItems"
            :key="item.id"
            class="cart-item"
          >
            <div class="item-content">
              <van-checkbox :name="item.id" class="item-checkbox" />
              <van-image
                :src="item.dish?.image"
                fit="cover"
                class="item-image"
              />
              <div class="item-info">
                <div class="item-name">{{ item.dish?.name }}</div>
                <div class="item-price">¥{{ item.dish?.price }}</div>
                <van-stepper
                  :model-value="item.quantity"
                  min="1"
                  @change="(val: number) => handleQuantityChange(item.id, val)"
                />
              </div>
            </div>
            <template #right>
              <van-button
                square
                type="danger"
                text="删除"
                class="delete-button"
                @click="handleDelete(item.id)"
              />
            </template>
          </van-swipe-cell>
        </van-checkbox-group>

        <van-empty v-if="!loading && cartStore.cartItems.length === 0" description="购物车是空的" />
      </van-pull-refresh>
    </div>

    <!-- 营养分析悬浮按钮 -->
    <van-floating-bubble
      v-if="cartStore.cartItems.length > 0"
      icon="bar-chart-o"
      @click="handleNutritionAnalysis"
      :style="{ bottom: '120px', right: '20px' }"
    />

    <!-- 营养分析弹窗 -->
    <van-dialog
      v-model:show="showNutritionDialog"
      title="营养分析"
      :show-confirm-button="false"
      close-on-click-overlay
    >
      <div v-if="nutritionLoading" class="nutrition-loading">
        <van-loading size="24px">AI 正在分析...</van-loading>
      </div>
      <div v-else-if="nutritionData" class="nutrition-content">
        <div class="nutrition-summary">
          {{ nutritionData.summary }}
        </div>

        <div class="nutrition-details">
          <div class="detail-item">
            <van-icon name="fire" color="#ff976a" />
            <span class="label">热量：</span>
            <span class="value">{{ nutritionData.details.calories }}</span>
          </div>
          <div class="detail-item">
            <van-icon name="underway" color="#07c160" />
            <span class="label">蛋白质：</span>
            <span class="value">{{ nutritionData.details.protein }}</span>
          </div>
          <div class="detail-item">
            <van-icon name="food" color="#1989fa" />
            <span class="label">碳水：</span>
            <span class="value">{{ nutritionData.details.carbs }}</span>
          </div>
          <div class="detail-item">
            <van-icon name="hot" color="#ee0a24" />
            <span class="label">脂肪：</span>
            <span class="value">{{ nutritionData.details.fat }}</span>
          </div>
          <div class="detail-item">
            <van-icon name="tosend" color="#ff976a" />
            <span class="label">膳食纤维：</span>
            <span class="value">{{ nutritionData.details.fiber }}</span>
          </div>
        </div>

        <div v-if="nutritionData.suggestions?.length > 0" class="nutrition-suggestions">
          <div class="suggestions-title">
            <van-icon name="bulb-o" />
            健康建议
          </div>
          <div
            v-for="(suggestion, index) in nutritionData.suggestions"
            :key="index"
            class="suggestion-item"
          >
            {{ suggestion }}
          </div>
        </div>
      </div>
    </van-dialog>

    <van-submit-bar
      :price="checkedTotalPrice * 100"
      button-text="结算"
      @submit="handleCheckout"
      style="bottom: 50px"
    >
      <van-checkbox v-model="isAllChecked">全选</van-checkbox>
    </van-submit-bar>

    <van-tabbar route>
      <van-tabbar-item icon="wap-home" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/order">订单</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="less" scoped>
.cart-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 100px;
}

.content {
  padding-top: 46px;
  min-height: calc(100vh - 100px);
}

.cart-item {
  margin-bottom: 12px;
  background: #fff;
}

.item-content {
  display: flex;
  align-items: center;
  padding: 12px;
}

.item-checkbox {
  margin-right: 12px;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
  margin-right: 12px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80px;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  font-size: 16px;
  font-weight: bold;
  color: #ee0a24;
  margin-bottom: 8px;
}

.delete-button {
  height: 100%;
}

.nutrition-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.nutrition-content {
  padding: 16px;
}

.nutrition-summary {
  font-size: 15px;
  color: #323233;
  line-height: 24px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
}

.nutrition-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 8px 12px;
  background: #f7f8fa;
  border-radius: 8px;

  .van-icon {
    font-size: 18px;
    margin-right: 8px;
  }

  .label {
    color: #646566;
    font-weight: 500;
  }

  .value {
    color: #323233;
    margin-left: 4px;
  }
}

.nutrition-suggestions {
  padding-top: 16px;
  border-top: 1px solid #ebedf0;
}

.suggestions-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;

  .van-icon {
    color: #ff976a;
    font-size: 18px;
  }
}

.suggestion-item {
  font-size: 14px;
  color: #646566;
  line-height: 24px;
  padding: 8px 12px;
  margin-bottom: 8px;
  background: #fff7f0;
  border-radius: 8px;
  border-left: 3px solid #ff976a;
}
</style>
