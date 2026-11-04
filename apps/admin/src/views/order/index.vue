<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrderList, getCanteenList } from '@/api'
import { OrderStatus, OrderStatusLabel } from '@campus-food/shared'
import type { Order, Canteen } from '@campus-food/shared'
import OrderCard from './components/OrderCard.vue'

const loading = ref(false)
const orders = ref<Order[]>([])
const canteens = ref<Canteen[]>([])
const canteenId = ref('')
const status = ref('')
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 状态选项
const statusOptions = [
  { label: OrderStatusLabel[OrderStatus.PENDING], value: OrderStatus.PENDING },
  { label: OrderStatusLabel[OrderStatus.ACCEPTED], value: OrderStatus.ACCEPTED },
  { label: OrderStatusLabel[OrderStatus.READY], value: OrderStatus.READY },
  { label: OrderStatusLabel[OrderStatus.CANCELLED], value: OrderStatus.CANCELLED },
]

/**
 * 加载食堂列表（用于筛选）
 */
async function loadCanteens() {
  try {
    const { data } = await getCanteenList()
    canteens.value = data.data.list
  } catch (error) {
    ElMessage.error('加载食堂列表失败')
  }
}

/**
 * 加载订单列表
 */
async function loadOrders() {
  loading.value = true
  try {
    const { data } = await getOrderList({
      canteenId: canteenId.value,
      status: status.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    orders.value = data.data.list
    total.value = data.data.total
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索
 */
function handleSearch() {
  currentPage.value = 1
  loadOrders()
}

/**
 * 页码改变
 */
function handlePageChange(page: number) {
  currentPage.value = page
  loadOrders()
}

/**
 * 页大小改变
 */
function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  loadOrders()
}

/**
 * 重置筛选
 */
function handleReset() {
  canteenId.value = ''
  status.value = ''
  currentPage.value = 1
  loadOrders()
}

/**
 * 刷新列表
 */
function handleRefresh() {
  loadOrders()
}

onMounted(() => {
  loadCanteens()
  loadOrders()
})
</script>

<template>
  <div class="order-container">
    <el-card shadow="never" style="margin-bottom: 16px">
      <!-- 搜索栏 -->
      <div class="toolbar">
        <div class="search-bar">
          <el-select
            v-model="canteenId"
            placeholder="选择食堂"
            clearable
            style="width: 200px; margin-right: 10px"
          >
            <el-option
              v-for="canteen in canteens"
              :key="canteen.id"
              :label="canteen.name"
              :value="canteen.id"
            />
          </el-select>

          <el-select
            v-model="status"
            placeholder="选择状态"
            clearable
            style="width: 150px; margin-right: 10px"
          >
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>

          <el-button type="primary" icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </div>

        <el-button icon="Refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </el-card>

    <!-- 订单列表 -->
    <div v-loading="loading" class="order-list">
      <div v-if="orders.length === 0" class="empty">
        <el-empty description="暂无订单" />
      </div>
      <OrderCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @refresh="handleRefresh"
      />
    </div>

    <!-- 分页 -->
    <el-card shadow="never" style="margin-top: 16px">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.order-container {
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search-bar {
      display: flex;
      align-items: center;
    }
  }

  .order-list {
    min-height: 400px;

    .empty {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }
  }
}
</style>
