<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { OrderStatus, OrderStatusLabel } from '@campus-food/shared'
import type { Order } from '@campus-food/shared'
import { updateOrderStatus } from '@/api'

interface Props {
  order: Order
}

interface Emits {
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * 获取状态标签类型
 */
function getStatusType(status: OrderStatus) {
  const typeMap = {
    [OrderStatus.PENDING]: 'warning',
    [OrderStatus.ACCEPTED]: 'primary',
    [OrderStatus.READY]: 'success',
    [OrderStatus.CANCELLED]: 'info',
  }
  return typeMap[status] || 'info'
}

/**
 * 接单
 */
async function handleAccept() {
  try {
    await ElMessageBox.confirm('确定接单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await updateOrderStatus(props.order.id, OrderStatus.ACCEPTED)
    ElMessage.success('接单成功')
    emit('refresh')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

/**
 * 出餐
 */
async function handleReady() {
  try {
    await ElMessageBox.confirm('确定已出餐吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await updateOrderStatus(props.order.id, OrderStatus.READY)
    ElMessage.success('出餐成功')
    emit('refresh')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

/**
 * 取消订单
 */
async function handleCancel() {
  try {
    await ElMessageBox.confirm('确定取消订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await updateOrderStatus(props.order.id, OrderStatus.CANCELLED)
    ElMessage.success('订单已取消')
    emit('refresh')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}
</script>

<template>
  <el-card class="order-card" shadow="hover">
    <div class="order-header">
      <div class="order-info">
        <span class="order-no">订单号：{{ order.orderNo }}</span>
        <el-tag :type="getStatusType(order.status)" size="small">
          {{ OrderStatusLabel[order.status] }}
        </el-tag>
      </div>
      <div class="order-time">{{ new Date(order.createdAt).toLocaleString() }}</div>
    </div>

    <el-divider style="margin: 12px 0" />

    <div class="order-content">
      <div class="info-row">
        <span class="label">食堂：</span>
        <span>{{ order.canteen?.name || '-' }}</span>
      </div>
      <div class="info-row">
        <span class="label">收货人：</span>
        <span>{{ order.address?.name }} {{ order.address?.phone }}</span>
      </div>
      <div class="info-row">
        <span class="label">地址：</span>
        <span>{{ order.address?.address }}</span>
      </div>
      <div v-if="order.remark" class="info-row">
        <span class="label">备注：</span>
        <span>{{ order.remark }}</span>
      </div>
    </div>

    <el-divider style="margin: 12px 0" />

    <div class="order-items">
      <div v-for="item in order.items" :key="item.id" class="item">
        <el-image
          :src="item.dishImage"
          style="width: 50px; height: 50px; border-radius: 4px"
          fit="cover"
        />
        <div class="item-info">
          <div class="item-name">{{ item.dishName }}</div>
          <div class="item-detail">
            <span>¥{{ item.price }}</span>
            <span style="margin-left: 10px">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-divider style="margin: 12px 0" />

    <div class="order-footer">
      <div class="total-amount">
        合计：<span style="color: #f56c6c; font-size: 18px; font-weight: bold">¥{{ order.totalAmount }}</span>
      </div>
      <div class="actions">
        <el-button
          v-if="order.status === OrderStatus.PENDING"
          type="primary"
          size="small"
          @click="handleAccept"
        >
          接单
        </el-button>
        <el-button
          v-if="order.status === OrderStatus.ACCEPTED"
          type="success"
          size="small"
          @click="handleReady"
        >
          出餐
        </el-button>
        <el-button
          v-if="order.status === OrderStatus.PENDING || order.status === OrderStatus.ACCEPTED"
          type="danger"
          size="small"
          plain
          @click="handleCancel"
        >
          取消订单
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style lang="less" scoped>
.order-card {
  margin-bottom: 16px;

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .order-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .order-no {
        font-weight: bold;
        font-size: 14px;
      }
    }

    .order-time {
      color: #909399;
      font-size: 12px;
    }
  }

  .order-content {
    .info-row {
      margin-bottom: 8px;
      font-size: 14px;

      .label {
        color: #909399;
        margin-right: 8px;
      }
    }
  }

  .order-items {
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      .item-info {
        margin-left: 10px;
        flex: 1;

        .item-name {
          font-size: 14px;
          margin-bottom: 4px;
        }

        .item-detail {
          color: #909399;
          font-size: 12px;
        }
      }
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .actions {
      display: flex;
      gap: 8px;
    }
  }
}
</style>
