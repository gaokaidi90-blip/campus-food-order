<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createCanteen, updateCanteen } from '@/api'
import type { Canteen } from '@campus-food/shared'

interface Props {
  canteen: Canteen | null
}

interface Emits {
  (e: 'success'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const form = ref({
  name: '',
  description: '',
  location: '',
  businessHours: '',
  image: '',
  status: 'open' as 'open' | 'closed',
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入食堂名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  location: [{ required: true, message: '请输入位置', trigger: 'blur' }],
  businessHours: [{ required: true, message: '请输入营业时间', trigger: 'blur' }],
  image: [{ required: true, message: '请输入图片 URL', trigger: 'blur' }],
}

/**
 * 监听 props 变化，回填表单
 */
watch(
  () => props.canteen,
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        description: newVal.description,
        location: newVal.location,
        businessHours: newVal.businessHours,
        image: newVal.image,
        status: newVal.status,
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

    if (props.canteen) {
      // 编辑
      await updateCanteen(props.canteen.id, form.value)
      ElMessage.success('更新成功')
    } else {
      // 新增
      await createCanteen(form.value)
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
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="食堂名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入食堂名称" />
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="请输入描述"
      />
    </el-form-item>

    <el-form-item label="位置" prop="location">
      <el-input v-model="form.location" placeholder="请输入位置" />
    </el-form-item>

    <el-form-item label="营业时间" prop="businessHours">
      <el-input v-model="form.businessHours" placeholder="例如：07:00 - 20:00" />
    </el-form-item>

    <el-form-item label="图片 URL" prop="image">
      <el-input v-model="form.image" placeholder="请输入图片 URL" />
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio value="open">营业中</el-radio>
        <el-radio value="closed">已关闭</el-radio>
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
