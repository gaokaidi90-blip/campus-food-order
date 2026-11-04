<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategoryList, deleteCategory, getCanteenList } from '@/api'
import type { Category, Canteen } from '@campus-food/shared'
import CategoryForm from './components/CategoryForm.vue'

const loading = ref(false)
const categories = ref<Category[]>([])
const canteens = ref<Canteen[]>([])
const keyword = ref('')
const canteenId = ref('')
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 对话框控制
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentCategory = ref<Category | null>(null)

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
 * 加载分类列表
 */
async function loadCategories() {
  loading.value = true
  try {
    const { data } = await getCategoryList({
      canteenId: canteenId.value,
      keyword: keyword.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    categories.value = data.data.list
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
  loadCategories()
}

/**
 * 重置筛选
 */
function handleReset() {
  keyword.value = ''
  canteenId.value = ''
  currentPage.value = 1
  loadCategories()
}

/**
 * 页码改变
 */
function handlePageChange(page: number) {
  currentPage.value = page
  loadCategories()
}

/**
 * 页大小改变
 */
function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  loadCategories()
}

/**
 * 新增分类
 */
function handleAdd() {
  dialogTitle.value = '新增分类'
  currentCategory.value = null
  dialogVisible.value = true
}

/**
 * 编辑分类
 */
function handleEdit(row: Category) {
  dialogTitle.value = '编辑分类'
  currentCategory.value = { ...row }
  dialogVisible.value = true
}

/**
 * 删除分类
 */
async function handleDelete(row: Category) {
  try {
    await ElMessageBox.confirm(`确定要删除"${row.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    loadCategories()
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
  loadCategories()
}

/**
 * 根据食堂 ID 获取食堂名称
 */
function getCanteenName(id: string) {
  return canteens.value.find((c) => c.id === id)?.name || '-'
}

/**
 * 计算全局序号
 */
function indexMethod(index: number) {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

onMounted(() => {
  loadCanteens()
  loadCategories()
})
</script>

<template>
  <div class="category-container">
    <el-card shadow="never">
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

          <el-input
            v-model="keyword"
            placeholder="搜索分类名称"
            style="width: 200px; margin-right: 10px"
            clearable
            @keyup.enter="handleSearch"
          />

          <el-button type="primary" icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </div>

        <el-button type="primary" icon="Plus" @click="handleAdd">
          新增分类
        </el-button>
      </div>

      <!-- 分类列表 -->
      <el-table :data="categories" :loading="loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
        <el-table-column prop="name" label="分类名称" width="200" />
        <el-table-column label="所属食堂" width="200">
          <template #default="{ row }">
            {{ getCanteenName(row.canteenId) }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序号" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="200">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleString() }}
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
      <CategoryForm
        :category="currentCategory"
        @success="handleSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.category-container {
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
