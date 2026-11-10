<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCanteenList, deleteCanteen } from '@/api'
import type { Canteen } from '@campus-food/shared'
import CanteenForm from './components/CanteenForm.vue'

const loading = ref(false)
const canteens = ref<Canteen[]>([])
const keyword = ref('')
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

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
    const { data } = await getCanteenList({
      keyword: keyword.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    canteens.value = data.data.list
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
  loadCanteens()
}

/**
 * 页码改变
 */
function handlePageChange(page: number) {
  currentPage.value = page
  loadCanteens()
}

/**
 * 页大小改变
 */
function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
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

/**
 * 刷新列表
 */
function handleRefresh() {
  loadCanteens()
}

/**
 * 计算全局序号
 */
function indexMethod(index: number) {
  return (currentPage.value - 1) * pageSize.value + index + 1
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
        <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
        <el-table-column label="图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              style="width: 60px; height: 60px; border-radius: 4px"
              fit="cover"
              :preview-src-list="row.image ? [row.image] : []"
              :preview-teleported="true"
              :z-index="4000"
            />
          </template>
        </el-table-column>
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

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
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
