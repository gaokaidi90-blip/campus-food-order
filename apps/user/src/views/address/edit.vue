<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Address } from '@campus-food/shared'
import { getAddresses, createAddress, updateAddress } from '@/api'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const addressId = ref(route.query.id as string | undefined)
const isEdit = ref(!!addressId.value)

// 表单数据
const formData = ref({
  name: '',
  phone: '',
  address: '',
  building: '',
  room: '',
  isDefault: 0,
})

/**
 * 加载地址详情（编辑模式）
 */
async function fetchAddressDetail() {
  if (!addressId.value) return

  try {
    const { data } = await getAddresses()
    const address = data.data.find((addr) => addr.id === addressId.value)

    if (address) {
      formData.value = {
        name: address.name,
        phone: address.phone,
        address: address.address,
        building: address.building,
        room: address.room,
        isDefault: address.isDefault,
      }
    }
  } catch (error) {
    showToast('加载失败')
  }
}

/**
 * 提交表单
 */
async function handleSubmit() {
  if (!formData.value.name) {
    showToast('请输入姓名')
    return
  }
  if (!formData.value.phone) {
    showToast('请输入手机号')
    return
  }
  if (!formData.value.address) {
    showToast('请输入详细地址')
    return
  }
  if (!formData.value.building) {
    showToast('请输入楼栋')
    return
  }
  if (!formData.value.room) {
    showToast('请输入房间号')
    return
  }

  loading.value = true
  try {
    if (isEdit.value && addressId.value) {
      // 更新地址
      await updateAddress(addressId.value, formData.value)
      showToast('保存成功')
    } else {
      // 新建地址
      await createAddress(formData.value)
      showToast('新建成功')
    }
    router.back()
  } catch (error) {
    showToast('保存失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEdit.value) {
    fetchAddressDetail()
  }
})
</script>

<template>
  <div class="address-edit-container">
    <van-nav-bar
      :title="isEdit ? '编辑地址' : '新建地址'"
      left-arrow
      @click-left="router.back()"
      fixed
    />

    <div class="content">
      <van-form @submit="handleSubmit">
        <van-cell-group inset>
          <van-field
            v-model="formData.name"
            name="name"
            label="姓名"
            placeholder="请输入收货人姓名"
            :rules="[{ required: true, message: '请输入姓名' }]"
          />
          <van-field
            v-model="formData.phone"
            name="phone"
            type="tel"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '手机号格式错误' },
            ]"
          />
          <van-field
            v-model="formData.address"
            name="address"
            label="详细地址"
            placeholder="如街道、小区等"
            :rules="[{ required: true, message: '请输入详细地址' }]"
          />
          <van-field
            v-model="formData.building"
            name="building"
            label="楼栋"
            placeholder="请输入楼栋"
            :rules="[{ required: true, message: '请输入楼栋' }]"
          />
          <van-field
            v-model="formData.room"
            name="room"
            label="房间号"
            placeholder="请输入房间号"
            :rules="[{ required: true, message: '请输入房间号' }]"
          />
        </van-cell-group>

        <van-cell-group inset>
          <van-cell center title="设为默认地址">
            <template #right-icon>
              <van-switch v-model="formData.isDefault" :active-value="1" :inactive-value="0" />
            </template>
          </van-cell>
        </van-cell-group>

        <div class="submit-button">
          <van-button
            type="primary"
            block
            round
            native-type="submit"
            :loading="loading"
          >
            保存
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.address-edit-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding-top: 46px;
  padding-bottom: 20px;
}

.submit-button {
  margin: 24px 16px;
}
</style>
