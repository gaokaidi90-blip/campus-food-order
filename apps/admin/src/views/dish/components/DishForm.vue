<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createDish, updateDish, getCanteenList, getCategoryList } from '@/api'
import type { Dish, Canteen, Category } from '@campus-food/shared'
import ImageUpload from '@/components/ImageUpload.vue'

interface Props {
  dish: Dish | null
}

interface Emits {
  (e: 'success'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const loading = ref(false)
const canteens = ref<Canteen[]>([])
const categories = ref<Category[]>([])

// 表单数据
const form = ref({
  canteenId: '',
  categoryId: '',
  name: '',
  description: '',
  image: '',
  price: 0,
  originalPrice: 0,
  stock: 100,
  status: 1,
  specifications: '',
})

// 表单验证规则
const rules: FormRules = {
  canteenId: [{ required: true, message: '请选择所属食堂', trigger: 'change' }],
  categoryId: [{ required: true, message: '请选择菜品分类', trigger: 'change' }],
  name: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入菜品描述', trigger: 'blur' }],
  image: [{ required: true, message: '请上传菜品图片', trigger: 'change' }],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: 'number', min: 1, message: '库存必须从1开始', trigger: 'blur' },
  ],
}

/**
 * 加载食堂列表
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
 * 根据选择的食堂过滤
 */
async function loadCategories() {
  if (!form.value.canteenId) {
    categories.value = []
    return
  }

  try {
    const { data } = await getCategoryList({ canteenId: form.value.canteenId })
    categories.value = data.data.list
  } catch (error) {
    ElMessage.error('加载分类列表失败')
  }
}

/**
 * 食堂改变时，清空分类选择并重新加载分类
 */
function handleCanteenChange() {
  form.value.categoryId = ''
  loadCategories()
}

/**
 * 监听 props 变化，回填表单
 */
watch(
  () => props.dish,
  (newVal) => {
    if (newVal) {
      form.value = {
        canteenId: newVal.canteenId,
        categoryId: newVal.categoryId,
        name: newVal.name,
        description: newVal.description,
        image: newVal.image,
        price: newVal.price,
        originalPrice: newVal.originalPrice || 0,
        stock: newVal.stock,
        status: newVal.status,
        specifications: newVal.specifications || '',
      }
      // 加载对应食堂的分类
      loadCategories()
    } else {
      // 新增时重置表单
      formRef.value?.resetFields()
      categories.value = []
    }
  },
  { immediate: true }
)

/**
 * 提交表单
 */
async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    loading.value = true

    // 清理数据：如果原价为0或未填，则不传
    const submitData = { ...form.value }
    if (!submitData.originalPrice || submitData.originalPrice === 0) {
      delete submitData.originalPrice
    }

    if (props.dish) {
      // 编辑
      await updateDish(props.dish.id, submitData)
      ElMessage.success('更新成功')
    } else {
      // 新增
      await createDish(submitData)
      ElMessage.success('创建成功')
    }

    emit('success')
  } catch (error) {
    if (error !== false) {
      ElMessage.error('操作失败')
    }
  } finally {
    loading.value = false
  }
}

/**
 * 取消
 */
function handleCancel() {
  emit('cancel')
}

// 加载食堂列表
loadCanteens()
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="所属食堂" prop="canteenId">
      <el-select
        v-model="form.canteenId"
        placeholder="请选择食堂"
        style="width: 100%"
        @change="handleCanteenChange"
      >
        <el-option
          v-for="canteen in canteens"
          :key="canteen.id"
          :label="canteen.name"
          :value="canteen.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="菜品分类" prop="categoryId">
      <el-select
        v-model="form.categoryId"
        placeholder="请先选择食堂"
        style="width: 100%"
        :disabled="!form.canteenId"
      >
        <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="菜品名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入菜品名称" />
    </el-form-item>

    <el-form-item label="菜品描述" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="请输入菜品描述"
      />
    </el-form-item>

    <el-form-item label="菜品图片" prop="image">
      <ImageUpload v-model="form.image" />
    </el-form-item>

    <el-form-item label="价格" prop="price">
      <el-input-number
        v-model="form.price"
        :min="0.01"
        :precision="2"
        :step="0.1"
        placeholder="请输入价格"
      />
    </el-form-item>

    <el-form-item label="原价">
      <el-input-number
        v-model="form.originalPrice"
        :min="0"
        :precision="2"
        :step="0.1"
        placeholder="选填，用于显示划线价"
      />
    </el-form-item>

    <el-form-item label="库存" prop="stock">
      <el-input-number v-model="form.stock" :min="1" placeholder="请输入库存" />
    </el-form-item>

    <el-form-item label="规格说明">
      <el-input v-model="form.specifications" placeholder="例如：辣度可选、大中小份" />
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio :value="1">上架</el-radio>
        <el-radio :value="0">下架</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        提交
      </el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
