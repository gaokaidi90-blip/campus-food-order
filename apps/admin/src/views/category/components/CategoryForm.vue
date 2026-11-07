<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createCategory, updateCategory, getCanteenList } from '@/api'
import type { Category, Canteen } from '@campus-food/shared'

interface Props {
  category: Category | null
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

// 表单数据
const form = ref({
  canteenId: '',
  name: '',
  sort: 1,
})

// 表单验证规则
const rules: FormRules = {
  canteenId: [{ required: true, message: '请选择所属食堂', trigger: 'change' }],
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
    { type: 'number', min: 1, message: '排序号必须从1开始', trigger: 'blur' },
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
 * 监听 props 变化，回填表单
 */
watch(
  () => props.category,
  (newVal) => {
    if (newVal) {
      form.value = {
        canteenId: newVal.canteenId,
        name: newVal.name,
        sort: newVal.sort,
      }
    } else {
      // 新增时重置表单
      formRef.value?.resetFields()
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

    if (props.category) {
      // 编辑
      await updateCategory(props.category.id, form.value)
      ElMessage.success('更新成功')
    } else {
      // 新增
      await createCategory(form.value)
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
      <el-select v-model="form.canteenId" placeholder="请选择食堂" style="width: 100%">
        <el-option
          v-for="canteen in canteens"
          :key="canteen.id"
          :label="canteen.name"
          :value="canteen.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="分类名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入分类名称" />
    </el-form-item>

    <el-form-item label="排序号" prop="sort">
      <el-input-number v-model="form.sort" :min="0" placeholder="请输入排序号" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        提交
      </el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
