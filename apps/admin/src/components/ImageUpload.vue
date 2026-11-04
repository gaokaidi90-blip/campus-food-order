<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const imageUrl = ref(props.modelValue)

// 监听 props 变化
watch(
  () => props.modelValue,
  (newVal) => {
    imageUrl.value = newVal
  }
)

/**
 * 上传前校验
 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 检查文件类型
  const isImage = rawFile.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }

  // 检查文件大小（限制为 2MB）
  const isLt2M = rawFile.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }

  return true
}

/**
 * 处理图片上传（转为 base64）
 */
const handleChange: UploadProps['onChange'] = (uploadFile) => {
  if (uploadFile.raw) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      imageUrl.value = base64
      emit('update:modelValue', base64)
    }
    reader.readAsDataURL(uploadFile.raw)
  }
}
</script>

<template>
  <div class="image-upload">
    <el-upload
      class="upload-container"
      :auto-upload="false"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      accept="image/*"
    >
      <img v-if="imageUrl" :src="imageUrl" class="uploaded-image" />
      <el-icon v-else class="upload-icon">
        <Plus />
      </el-icon>
    </el-upload>
    <div class="upload-tip">支持 jpg、png、gif 格式，大小不超过 2MB</div>
  </div>
</template>

<style lang="less" scoped>
.image-upload {
  .upload-container {
    :deep(.el-upload) {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
      width: 178px;
      height: 178px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  .upload-icon {
    font-size: 28px;
    color: #8c939d;
  }

  .uploaded-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .upload-tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
