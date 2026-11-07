<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getDashboardStats,
  getOrderTrend,
  getRevenueTrend,
  getOrderStatusDistribution,
  getTopDishes,
  getCanteenComparison,
} from '@/api'
import type {
  DashboardStats,
  TrendData,
  StatusDistribution,
  DishRank,
  CanteenStats,
} from '@/api'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '@/stores/admin'
import OrderTrendChart from './components/OrderTrendChart.vue'
import RevenueTrendChart from './components/RevenueTrendChart.vue'
import StatusPieChart from './components/StatusPieChart.vue'
import DishRankChart from './components/DishRankChart.vue'
import CanteenCompareChart from './components/CanteenCompareChart.vue'

const adminStore = useAdminStore()

// 统计数据
const stats = ref<DashboardStats>({
  totalOrders: 0,
  todayOrders: 0,
  totalRevenue: 0,
  todayRevenue: 0,
})

// 图表数据
const orderTrendData = ref<TrendData[]>([])
const revenueTrendData = ref<TrendData[]>([])
const statusData = ref<StatusDistribution[]>([])
const dishRankData = ref<DishRank[]>([])
const canteenData = ref<CanteenStats[]>([])

const loading = ref(false)

/**
 * 加载基础统计数据
 */
async function loadBasicStats() {
  try {
    const { data } = await getDashboardStats()
    stats.value = data.data
  } catch (error) {
    console.error('加载统计数据失败:', error)
    ElMessage.error('加载统计数据失败')
  }
}

/**
 * 加载所有图表数据
 */
async function loadChartsData() {
  // 订单趋势
  try {
    const { data } = await getOrderTrend(7)
    orderTrendData.value = data.data
  } catch (error) {
    console.error('加载订单趋势失败:', error)
    orderTrendData.value = []
  }

  // 营业额趋势
  try {
    const { data } = await getRevenueTrend(7)
    revenueTrendData.value = data.data
  } catch (error) {
    console.error('加载营业额趋势失败:', error)
    revenueTrendData.value = []
  }

  // 订单状态分布
  try {
    const { data } = await getOrderStatusDistribution()
    statusData.value = data.data
  } catch (error) {
    console.error('加载订单状态分布失败:', error)
    statusData.value = []
  }

  // 热销菜品排行
  try {
    const { data } = await getTopDishes(10)
    dishRankData.value = data.data
  } catch (error) {
    console.error('加载热销菜品失败:', error)
    dishRankData.value = []
  }

  // 食堂对比（仅超级管理员）
  if (adminStore.isSuperAdmin) {
    try {
      const { data } = await getCanteenComparison()
      canteenData.value = data.data
    } catch (error) {
      console.error('加载食堂对比失败:', error)
      canteenData.value = []
    }
  }
}

/**
 * 加载所有数据
 */
async function fetchAllData() {
  loading.value = true

  // 先加载基础统计
  await loadBasicStats()
  loading.value = false

  // 后台加载图表数据
  loadChartsData()
}

/**
 * 刷新数据
 */
function handleRefresh() {
  fetchAllData()
  ElMessage.success('数据刷新中...')
}

onMounted(() => {
  fetchAllData()
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <h2>数据看板</h2>
      <el-button type="primary" :icon="'Refresh'" @click="handleRefresh">
        刷新数据
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" v-loading="loading">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon orders">
              <el-icon><i-ep-list /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-label">总订单数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon today">
              <el-icon><i-ep-calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.todayOrders }}</div>
              <div class="stat-label">今日订单</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon revenue">
              <el-icon><i-ep-money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.totalRevenue.toFixed(2) }}</div>
              <div class="stat-label">总营业额</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon today-revenue">
              <el-icon><i-ep-wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.todayRevenue.toFixed(2) }}</div>
              <div class="stat-label">今日营业额</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 订单趋势 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>订单趋势（近7天）</span>
          </template>
          <OrderTrendChart :data="orderTrendData" />
        </el-card>
      </el-col>

      <!-- 营业额趋势 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>营业额趋势（近7天）</span>
          </template>
          <RevenueTrendChart :data="revenueTrendData" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 订单状态分布 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>订单状态分布</span>
          </template>
          <StatusPieChart :data="statusData" />
        </el-card>
      </el-col>

      <!-- 热销菜品排行 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>热销菜品 Top 10</span>
          </template>
          <DishRankChart :data="dishRankData" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 食堂对比（仅超级管理员） -->
    <el-row v-if="adminStore.isSuperAdmin" :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <span>食堂数据对比</span>
          </template>
          <CanteenCompareChart :data="canteenData" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less" scoped>
.dashboard-container {
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }
  }

  .stat-card {
    display: flex;
    align-items: center;
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;

    .el-icon {
      font-size: 28px;
      color: #fff;
    }

    &.orders {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    &.today {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    &.revenue {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    &.today-revenue {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
  }

  .stat-info {
    flex: 1;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 14px;
    color: #909399;
  }
}
</style>
