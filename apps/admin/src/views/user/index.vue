<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserList } from '@/api'
import type { User } from '@campus-food/shared'

const loading = ref(false)
const users = ref<User[]>([])
const keyword = ref('')

/**
 * 加载用户列表
 */
async function loadUsers() {
  loading.value = true
  try {
    const { data } = await getUserList({ keyword: keyword.value })
    users.value = data.data
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
  loadUsers()
}

/**
 * 重置筛选
 */
function handleReset() {
  keyword.value = ''
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="user-container">
    <el-card shadow="never">
      <!-- 搜索栏 -->
      <div class="toolbar">
        <div class="search-bar">
          <el-input
            v-model="keyword"
            placeholder="搜索学号、姓名或手机号"
            style="width: 300px; margin-right: 10px"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button icon="Search" @click="handleSearch" />
            </template>
          </el-input>

          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </div>
      </div>

      <!-- 用户列表 -->
      <el-table :data="users" :loading="loading" style="width: 100%">
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar v-if="row.avatar" :src="row.avatar" :size="50" />
            <el-avatar v-else :size="50">{{ row.name.charAt(0) }}</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="studentId" label="学号" width="150" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="createdAt" label="注册时间" width="200">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.user-container {
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .search-bar {
      display: flex;
      align-items: center;
    }
  }
}
</style>
