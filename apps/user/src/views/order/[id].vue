<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { OrderStatus, OrderStatusLabel } from '@campus-food/shared'
import { cancelOrder } from '@/api'
import { showToast, showDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const loading = ref(false)
const showCancelDialog = ref(false)
const cancelReason = ref('')
const otherReason = ref('')

// 取消原因选项
const cancelReasons = [
  '我不想要了',
  '信息填写错误，重新下单',
  '商家出餐太慢',
  '餐品价格有变动',
  '配送地址选错了',
  '其他原因',
]

/**
 * 加载订单详情
 */
async function fetchOrderDetail() {
  loading.value = true
  try {
    await orderStore.fetchOrderDetail(route.params.id as string)
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

/**
 * 格式化日期时间
 */
function formatDateTime(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/**
 * 处理返回
 */
function handleBack() {
  // 如果是从结算页跳转过来的（刚下单），替换到订单列表页
  // 否则正常返回
  const fromCheckout = route.query.from === 'checkout'
  if (fromCheckout) {
    router.replace('/order')
  } else {
    router.back()
  }
}

/**
 * 取消订单
 */
async function handleCancelOrder() {
  if (!orderStore.currentOrder) return
  cancelReason.value = ''
  otherReason.value = ''
  showCancelDialog.value = true
}

/**
 * 确认取消订单
 */
async function confirmCancelOrder() {
  if (!cancelReason.value) {
    showToast('请选择取消原因')
    return
  }

  // 如果选择了"其他原因"，必须填写具体原因
  if (cancelReason.value === '其他原因' && !otherReason.value.trim()) {
    showToast('请输入取消原因')
    return
  }

  loading.value = true
  try {
    // 如果是其他原因，使用用户输入的内容
    const reason = cancelReason.value === '其他原因' ? otherReason.value.trim() : cancelReason.value
    await cancelOrder(orderStore.currentOrder!.id, reason)
    showToast('订单已取消')
    showCancelDialog.value = false
    // 重新加载订单详情
    await fetchOrderDetail()
  } catch (error) {
    showToast('取消失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<template>
  <div class="order-detail-container">
    <van-nav-bar
      title="订单详情"
      left-arrow
      @click-left="handleBack"
      fixed
    />

    <div class="content">
      <van-loading v-if="loading" class="loading" />

      <template v-else-if="orderStore.currentOrder">
        <!-- 订单状态 -->
        <div class="status-card">
          <van-icon name="checked" size="48" color="#07c160" />
          <div class="status-text">
            {{ OrderStatusLabel[orderStore.currentOrder.status] }}
          </div>
        </div>

        <!-- 收货地址 -->
        <van-cell-group inset title="收货信息">
          <van-cell
            :title="orderStore.currentOrder.address?.name"
            :label="orderStore.currentOrder.address?.address"
            :value="orderStore.currentOrder.address?.phone"
          />
        </van-cell-group>

        <!-- 菜品信息 -->
        <van-cell-group inset title="菜品信息">
          <div class="dish-list">
            <div
              v-for="item in orderStore.currentOrder.items"
              :key="item.id"
              class="dish-item"
            >
              <van-image :src="item.dishImage" fit="cover" class="dish-image" />
              <div class="dish-info">
                <div class="dish-name">{{ item.dishName }}</div>
                <div class="dish-meta">
                  <span class="dish-price">¥{{ item.price }}</span>
                  <span class="dish-quantity">x{{ item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-cell-group>

        <!-- 订单信息 -->
        <van-cell-group inset title="订单信息">
          <van-cell title="订单号" :value="orderStore.currentOrder.orderNo" />
          <van-cell title="食堂" :value="orderStore.currentOrder.canteen?.name" />
          <van-cell
            title="下单时间"
            :value="formatDateTime(orderStore.currentOrder.createdAt)"
          />
          <van-cell
            v-if="orderStore.currentOrder.remark"
            title="备注"
            :value="orderStore.currentOrder.remark"
          />
          <van-cell
            v-if="orderStore.currentOrder.status === 'cancelled' && orderStore.currentOrder.cancelReason"
            title="取消原因"
            :value="orderStore.currentOrder.cancelReason"
          />
          <van-cell
            title="合计"
            :value="`¥${orderStore.currentOrder.totalAmount}`"
            class="total-cell"
          />
        </van-cell-group>

        <!-- 操作按钮 -->
        <div
          v-if="orderStore.currentOrder.status === 'pending' || orderStore.currentOrder.status === 'accepted'"
          class="action-buttons"
        >
          <van-button
            type="warning"
            block
            round
            @click="handleCancelOrder"
          >
            取消订单
          </van-button>
        </div>
      </template>
    </div>

    <!-- 取消订单对话框 -->
    <van-popup
      v-model:show="showCancelDialog"
      position="bottom"
      round
      :style="{ padding: '20px' }"
    >
      <div class="cancel-dialog">
        <div class="cancel-title">请选择取消原因</div>
        <van-radio-group v-model="cancelReason">
          <van-cell-group inset>
            <van-cell
              v-for="reason in cancelReasons"
              :key="reason"
              clickable
              @click="cancelReason = reason"
            >
              <template #title>
                <span>{{ reason }}</span>
              </template>
              <template #right-icon>
                <van-radio :name="reason" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>

        <!-- 其他原因输入框 -->
        <div v-if="cancelReason === '其他原因'" class="other-reason">
          <van-field
            v-model="otherReason"
            type="textarea"
            rows="3"
            maxlength="100"
            placeholder="请输入取消原因（必填）"
            show-word-limit
          />
        </div>

        <div class="cancel-actions">
          <van-button
            block
            round
            @click="showCancelDialog = false"
          >
            我再想想
          </van-button>
          <van-button
            type="danger"
            block
            round
            :loading="loading"
            @click="confirmCancelOrder"
          >
            确认取消
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.order-detail-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding-top: 46px;
  padding-bottom: 20px;
}

.loading {
  padding: 40px 0;
  text-align: center;
}

.status-card {
  background: #fff;
  padding: 32px 16px;
  text-align: center;
  margin-bottom: 12px;
}

.status-text {
  font-size: 18px;
  font-weight: bold;
  color: #323233;
  margin-top: 12px;
}

.dish-list {
  padding: 12px 16px;
}

.dish-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.dish-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  flex-shrink: 0;
  margin-right: 12px;
}

.dish-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60px;
}

.dish-name {
  font-size: 14px;
  color: #323233;
  margin-bottom: 4px;
}

.dish-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-price {
  font-size: 14px;
  color: #ee0a24;
  font-weight: bold;
}

.dish-quantity {
  font-size: 13px;
  color: #969799;
}

.total-cell {
  :deep(.van-cell__value) {
    font-size: 18px;
    font-weight: bold;
    color: #ee0a24;
  }
}

.action-buttons {
  padding: 16px;
}

.cancel-dialog {
  padding: 8px 0;
}

.cancel-title {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
  text-align: center;
  margin-bottom: 16px;
}

.other-reason {
  margin-top: 16px;
}

.cancel-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
</style>
