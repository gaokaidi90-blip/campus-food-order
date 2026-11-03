<script setup lang="ts">
import type { Order } from '@campus-food/shared'
import { OrderStatusLabel } from '@campus-food/shared'

interface Props {
  order: Order
}

defineProps<Props>()

const emit = defineEmits<{
  click: [order: Order]
}>()

/**
 * 格式化日期时间
 */
function formatDateTime(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <div class="order-card" @click="emit('click', order)">
    <div class="order-header">
      <div class="order-info">
        <span class="order-no">订单号：{{ order.orderNo }}</span>
        <van-tag :type="order.status === 'cancelled' ? 'default' : 'primary'">
          {{ OrderStatusLabel[order.status] }}
        </van-tag>
      </div>
      <div class="order-time">{{ formatDateTime(order.createdAt) }}</div>
    </div>

    <div class="order-items">
      <div
        v-for="item in order.items"
        :key="item.id"
        class="order-item"
      >
        <van-image :src="item.dishImage" fit="cover" class="item-image" />
        <div class="item-info">
          <div class="item-name">{{ item.dishName }}</div>
          <div class="item-meta">
            <span class="item-price">¥{{ item.price }}</span>
            <span class="item-quantity">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="order-footer">
      <div class="order-total">
        合计：<span class="total-amount">¥{{ order.totalAmount }}</span>
      </div>
      <van-icon name="arrow" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.order-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:active {
    background: #f7f8fa;
  }
}

.order-header {
  margin-bottom: 12px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.order-no {
  font-size: 14px;
  color: #646566;
}

.order-time {
  font-size: 12px;
  color: #969799;
}

.order-items {
  border-top: 1px solid #ebedf0;
  border-bottom: 1px solid #ebedf0;
  padding: 12px 0;
  margin-bottom: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  flex-shrink: 0;
  margin-right: 12px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60px;
}

.item-name {
  font-size: 14px;
  color: #323233;
  margin-bottom: 4px;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: 14px;
  color: #ee0a24;
  font-weight: bold;
}

.item-quantity {
  font-size: 13px;
  color: #969799;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total {
  font-size: 14px;
  color: #646566;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #ee0a24;
  margin-left: 4px;
}
</style>
