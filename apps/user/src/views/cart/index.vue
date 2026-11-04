<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCart } from '@/composables/useCart'
import { useOrder } from '@/composables/useOrder'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const cartStore = useCartStore()
const { updateCartItem, removeCartItem } = useCart()
const { createOrder } = useOrder()

const loading = ref(false)
const checkedIds = ref<string[]>([])

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
</style>
