<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDishList, deleteDish, getCanteenList, getCategoryList } from '@/api'
import type { Dish, Canteen, Category } from '@campus-food/shared'
import DishForm from './components/DishForm.vue'

const loading = ref(false)
const dishes = ref<Dish[]>([])
const canteens = ref<Canteen[]>([])
const categories = ref<Category[]>([])
const keyword = ref('')
const canteenId = ref('')
const categoryId = ref('')

// 对话框控制
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentDish = ref<Dish | null>(null)

/**
 * 加载食堂列表（用于筛选）
 */
async function loadCanteens() {
  try {
    const { data } = await getCanteenList()
    canteens.value = data.data
  } catch (error) {
    ElMessage.error('加载食堂列表失败')
  }
}

/**
 * 加载分类列表（用于筛选）
 */
async function loadCategories() {
  try {
    const params = canteenId.value ? { canteenId: canteenId.value } : undefined
    const { data } = await getCategoryList(params)
    categories.value = data.data
  } catch (error) {
    ElMessage.error('加载分类列表失败')
  }
}

/**
 * 食堂改变时，清空分类选择并重新加载分类
 */
function handleCanteenFilterChange() {
  categoryId.value = ''
  loadCategories()
}

/**
 * 加载菜品列表
 */
async function loadDishes() {
  loading.value = true
  try {
    const { data } = await getDishList({
      canteenId: canteenId.value,
      categoryId: categoryId.value,
      keyword: keyword.value,
    })
    dishes.value = data.data
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
  loadDishes()
}

/**
 * 重置筛选
 */
function handleReset() {
  keyword.value = ''
  canteenId.value = ''
  categoryId.value = ''
  loadDishes()
}

/**
 * 新增菜品
 */
function handleAdd() {
  dialogTitle.value = '新增菜品'
  currentDish.value = null
  dialogVisible.value = true
}

/**
 * 编辑菜品
 */
function handleEdit(row: Dish) {
  dialogTitle.value = '编辑菜品'
  currentDish.value = { ...row }
  dialogVisible.value = true
}

/**
 * 删除菜品
 */
async function handleDelete(row: Dish) {
  try {
    await ElMessageBox.confirm(`确定要删除"${row.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteDish(row.id)
    ElMessage.success('删除成功')
    loadDishes()
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
  loadDishes()
}

/**
 * 根据食堂 ID 获取食堂名称
 */
function getCanteenName(id: string) {
  return canteens.value.find((c) => c.id === id)?.name || '-'
}

/**
 * 根据分类 ID 获取分类名称
 */
function getCategoryName(id: string) {
  return categories.value.find((c) => c.id === id)?.name || '-'
}

onMounted(() => {
  loadCanteens()
  loadCategories()
  loadDishes()
})
</script>

<template>
  <div class="dish-container">
    <el-card shadow="never">
      <!-- 搜索栏 -->
      <div class="toolbar">
        <div class="search-bar">
          <el-select
            v-model="canteenId"
            placeholder="选择食堂"
            clearable
            style="width: 180px; margin-right: 10px"
            @change="handleCanteenFilterChange"
          >
            <el-option
              v-for="canteen in canteens"
              :key="canteen.id"
              :label="canteen.name"
              :value="canteen.id"
            />
          </el-select>

          <el-select
            v-model="categoryId"
            placeholder="选择分类"
            clearable
            style="width: 150px; margin-right: 10px"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>

          <el-input
            v-model="keyword"
            placeholder="搜索菜品名称或描述"
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
          新增菜品
        </el-button>
      </div>

      <!-- 菜品列表 -->
      <el-table :data="dishes" :loading="loading" style="width: 100%">
        <el-table-column label="图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              style="width: 60px; height: 60px"
              fit="cover"
              :preview-src-list="[row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column label="所属食堂" width="150">
          <template #default="{ row }">
            {{ getCanteenName(row.canteenId) }}
          </template>
        </el-table-column>
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            {{ getCategoryName(row.categoryId) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜品名称" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="价格" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold">¥{{ row.price }}</span>
            <span v-if="row.originalPrice" style="text-decoration: line-through; margin-left: 5px; color: #909399">
              ¥{{ row.originalPrice }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="sales" label="销量" width="80" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">上架</el-tag>
            <el-tag v-else type="info">下架</el-tag>
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
      <DishForm
        :dish="currentDish"
        @success="handleSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.dish-container {
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
