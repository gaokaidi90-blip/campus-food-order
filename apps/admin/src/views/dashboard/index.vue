<script setup lang="ts">
import { ref } from 'vue'

// 临时数据，后续会从 API 获取
const stats = ref({
  totalOrders: 0,
  todayOrders: 0,
  totalRevenue: 0,
  todayRevenue: 0,
})
</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon orders">
              <el-icon><List /></el-icon>
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
              <el-icon><Calendar /></el-icon>
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
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.totalRevenue }}</div>
              <div class="stat-label">总营业额</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon today-revenue">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.todayRevenue }}</div>
              <div class="stat-label">今日营业额</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <span>欢迎使用校园点餐管理系统</span>
          </template>
          <el-empty description="数据统计功能开发中..." />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less" scoped>
.dashboard-container {
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
