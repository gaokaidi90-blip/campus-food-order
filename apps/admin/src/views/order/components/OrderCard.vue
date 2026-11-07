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
    await ElMessageBox.confirm(
      '确认接受此订单并开始制作吗？',
      '确认接单',
      {
        confirmButtonText: '确认接单',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        showClose: false,
        customClass: 'order-confirm-dialog',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button',
      }
    )

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
    await ElMessageBox.confirm(
      '确认该订单已经制作完成并可以取餐了吗？',
      '确认出餐',
      {
        confirmButtonText: '确认出餐',
        cancelButtonText: '取消',
        type: 'success',
        center: true,
        showClose: false,
        customClass: 'order-confirm-dialog',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button',
      }
    )

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
    await ElMessageBox.confirm(
      '取消后将无法恢复，确认要取消此订单吗？',
      '确认取消订单',
      {
        confirmButtonText: '确认取消',
        cancelButtonText: '返回',
        type: 'error',
        center: true,
        showClose: false,
        customClass: 'order-confirm-dialog',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button',
      }
    )

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

<style lang="less">
/* 全局样式 - 优化确认对话框 */
.order-confirm-dialog {
  min-width: 420px !important;
  border-radius: 12px !important;
  padding: 24px !important;
  background-color: #ffffff !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;

  .el-message-box__header {
    padding-bottom: 20px !important;
    background-color: transparent !important;

    .el-message-box__title {
      font-size: 18px !important;
      font-weight: 600 !important;
      color: #303133 !important;
    }
  }

  .el-message-box__content {
    padding: 20px 0 !important;
    background-color: transparent !important;

    .el-message-box__message {
      font-size: 15px !important;
      line-height: 1.6 !important;
      color: #606266 !important;
    }
  }

  .el-message-box__btns {
    padding-top: 24px !important;
    display: flex !important;
    justify-content: center !important;
    gap: 12px !important;
    background-color: transparent !important;

    button {
      min-width: 100px !important;
      height: 40px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      border-radius: 8px !important;
      transition: all 0.3s ease !important;

      &:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }
    }

    .cancel-button {
      background-color: #f5f7fa !important;
      border-color: #dcdfe6 !important;
      color: #606266 !important;

      &:hover {
        background-color: #e9ecef !important;
        border-color: #c0c4cc !important;
      }
    }

    .confirm-button {
      &:hover {
        opacity: 0.9 !important;
      }
    }
  }

  /* 图标样式优化 */
  .el-message-box__status {
    font-size: 28px !important;
    margin-right: 16px !important;
  }
}
</style>
