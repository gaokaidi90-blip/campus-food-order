<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { OrderStatus, OrderStatusLabel } from '@campus-food/shared'
import { showToast } from 'vant'
import OrderCard from '@/components/OrderCard.vue'
import type { Order } from '@campus-food/shared'

const router = useRouter()
const orderStore = useOrderStore()

const loading = ref(false)
const activeStatus = ref<OrderStatus | 'all'>('all')

// 状态选项卡
const statusTabs = [
  { key: 'all', label: '全部' },
  { key: OrderStatus.PENDING, label: OrderStatusLabel[OrderStatus.PENDING] },
  { key: OrderStatus.ACCEPTED, label: OrderStatusLabel[OrderStatus.ACCEPTED] },
  { key: OrderStatus.READY, label: OrderStatusLabel[OrderStatus.READY] },
  { key: OrderStatus.CANCELLED, label: OrderStatusLabel[OrderStatus.CANCELLED] },
]

/**
 * 加载订单列表
 */
async function fetchOrders() {
  loading.value = true
  try {
    const status = activeStatus.value === 'all' ? undefined : activeStatus.value
    await orderStore.fetchOrders(status)
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

/**
 * 切换状态
 */
function handleStatusChange() {
  fetchOrders()
}

/**
 * 查看订单详情
 */
function handleOrderClick(order: Order) {
  router.push(`/order/${order.id}`)
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="order-container">
    <van-nav-bar title="我的订单" fixed />

    <div class="content">
      <van-tabs v-model:active="activeStatus" @change="handleStatusChange" sticky :offset-top="46">
        <van-tab
          v-for="tab in statusTabs"
          :key="tab.key"
          :title="tab.label"
          :name="tab.key"
        >
          <van-pull-refresh v-model="loading" @refresh="fetchOrders">
            <div class="order-list">
              <OrderCard
                v-for="order in orderStore.orders"
                :key="order.id"
                :order="order"
                @click="handleOrderClick"
              />
            </div>

            <van-empty
              v-if="!loading && orderStore.orders.length === 0"
              description="暂无订单"
            />
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
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
.order-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 50px;
}

.content {
  padding-top: 46px;
}

.order-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
