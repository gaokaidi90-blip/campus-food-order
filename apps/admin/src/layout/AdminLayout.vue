<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

// 侧边栏折叠状态
const isCollapse = ref(false)

/**
 * 切换侧边栏折叠状态
 */
function toggleCollapse() {
  isCollapse.value = !isCollapse.value
}

/**
 * 退出登录
 */
function handleLogout() {
  adminStore.logout()
  window.location.href = 'http://localhost:3000/login?redirect=admin'
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">
        <span v-if="!isCollapse">管理后台</span>
        <span v-else>后台</span>
      </div>

      <el-menu
        :collapse="isCollapse"
        :default-active="$route.path"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><i-ep-odometer /></el-icon>
          <template #title>数据看板</template>
        </el-menu-item>

        <el-menu-item v-if="adminStore.isSuperAdmin" index="/canteen">
          <el-icon><i-ep-shop /></el-icon>
          <template #title>食堂管理</template>
        </el-menu-item>

        <el-menu-item index="/category">
          <el-icon><i-ep-menu /></el-icon>
          <template #title>分类管理</template>
        </el-menu-item>

        <el-menu-item index="/dish">
          <el-icon><i-ep-food /></el-icon>
          <template #title>菜品管理</template>
        </el-menu-item>

        <el-menu-item index="/order">
          <el-icon><i-ep-list /></el-icon>
          <template #title>订单管理</template>
        </el-menu-item>

        <el-menu-item index="/user">
          <el-icon><i-ep-user /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <i-ep-fold v-if="!isCollapse" />
            <i-ep-expand v-else />
          </el-icon>
        </div>

        <div class="header-right">
          <el-dropdown @command="handleLogout">
            <span class="user-info">
            <i-ep-user />
              <span>{{ adminStore.adminInfo?.name || '管理员' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
  transition: width 0.3s;
}

.logo {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #2b3a4b;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  color: #5a5e66;

  &:hover {
    color: #409eff;
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f7fa;
  }

  .el-icon {
    margin-right: 8px;
  }
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
