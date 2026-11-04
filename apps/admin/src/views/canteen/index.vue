<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCanteenList, deleteCanteen } from '@/api'
import type { Canteen } from '@campus-food/shared'
import CanteenForm from './components/CanteenForm.vue'

const loading = ref(false)
const canteens = ref<Canteen[]>([])
const keyword = ref('')

// 对话框控制
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentCanteen = ref<Canteen | null>(null)

/**
 * 加载食堂列表
 */
async function loadCanteens() {
  loading.value = true
  try {
    const { data } = await getCanteenList({ keyword: keyword.value })
    canteens.value = data.data
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
  loadCanteens()
}

/**
 * 新增食堂
 */
function handleAdd() {
  dialogTitle.value = '新增食堂'
  currentCanteen.value = null
  dialogVisible.value = true
}

/**
 * 编辑食堂
 */
function handleEdit(row: Canteen) {
  dialogTitle.value = '编辑食堂'
  currentCanteen.value = { ...row }
  dialogVisible.value = true
}

/**
 * 删除食堂
 */
async function handleDelete(row: Canteen) {
  try {
    await ElMessageBox.confirm(`确定要删除"${row.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteCanteen(row.id)
    ElMessage.success('删除成功')
    loadCanteens()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 表单提交成功
 */
function handleSuccess() {
  dialogVisible.value = false
  loadCanteens()
}

onMounted(() => {
  loadCanteens()
})
</script>

<template>
  <div class="canteen-container">
    <el-card shadow="never">
      <!-- 搜索栏 -->
      <div class="toolbar">
        <el-input
          v-model="keyword"
          placeholder="搜索食堂名称或描述"
          style="width: 300px"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button icon="Search" @click="handleSearch" />
          </template>
        </el-input>

        <el-button type="primary" icon="Plus" @click="handleAdd">
          新增食堂
        </el-button>
      </div>

      <!-- 食堂列表 -->
      <el-table :data="canteens" :loading="loading" style="width: 100%">
        <el-table-column prop="name" label="食堂名称" width="200" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="location" label="位置" width="200" />
        <el-table-column prop="businessHours" label="营业时间" width="200" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'open'" type="success">营业中</el-tag>
            <el-tag v-else type="info">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <CanteenForm
        :canteen="currentCanteen"
        @success="handleSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.canteen-container {
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
