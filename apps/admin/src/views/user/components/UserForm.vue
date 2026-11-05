<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { updateUser } from '@/api'
import type { User } from '@campus-food/shared'
import ImageUpload from '@/components/ImageUpload.vue'

interface Props {
  user: User | null
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
  phone: '',
  avatar: '',
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
}

/**
 * 监听 props 变化，回填表单
 */
watch(
  () => props.user,
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        phone: newVal.phone,
        avatar: newVal.avatar || '',
      }
    } else {
      // 重置表单
      formRef.value?.resetFields()
    }
  },
  { immediate: true }
)

/**
 * 提交表单
 */
async function handleSubmit() {
  if (!formRef.value || !props.user) return

  try {
    await formRef.value.validate()

    loading.value = true

    await updateUser(props.user.id, form.value)

    ElMessage.success('更新成功')
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
    <el-form-item label="学号">
      <el-input :value="user?.studentId" disabled />
    </el-form-item>

    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" placeholder="请输入姓名" />
    </el-form-item>

    <el-form-item label="手机号" prop="phone">
      <el-input v-model="form.phone" placeholder="请输入手机号" />
    </el-form-item>

    <el-form-item label="头像">
      <ImageUpload v-model="form.avatar" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        保存
      </el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
