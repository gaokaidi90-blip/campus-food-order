<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Address } from '@campus-food/shared'
import { getAddresses, deleteAddress } from '@/api'
import { showToast, showConfirmDialog } from 'vant'
import AddressCard from '@/components/AddressCard.vue'

const router = useRouter()
const loading = ref(false)
const addresses = ref<Address[]>([])

/**
 * 加载地址列表
 */
async function fetchAddresses() {
  loading.value = true
  try {
    const { data } = await getAddresses()
    addresses.value = data.data
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

/**
 * 新建地址
 */
function handleAdd() {
  router.push('/address/edit')
}

/**
 * 编辑地址
 */
function handleEdit(address: Address) {
  router.push(`/address/edit?id=${address.id}`)
}

/**
 * 删除地址
 */
async function handleDelete(address: Address) {
  await showConfirmDialog({
    title: '提示',
    message: '确定删除该地址吗？',
  })

  try {
    await deleteAddress(address.id)
    showToast('删除成功')
    fetchAddresses()
  } catch (error) {
    showToast('删除失败')
  }
}

onMounted(() => {
  fetchAddresses()
})
</script>

<template>
  <div class="address-container">
    <van-nav-bar title="地址管理" left-arrow @click-left="router.back()" fixed />

    <div class="content">
      <van-pull-refresh v-model="loading" @refresh="fetchAddresses">
        <div class="address-list">
          <AddressCard
            v-for="addr in addresses"
            :key="addr.id"
            :address="addr"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>

        <van-empty
          v-if="!loading && addresses.length === 0"
          description="暂无收货地址"
        />
      </van-pull-refresh>
    </div>

    <div class="footer">
      <van-button type="primary" block round @click="handleAdd">
        新建地址
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.address-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 70px;
}

.content {
  padding-top: 46px;
  min-height: calc(100vh - 70px);
}

.address-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
}
</style>
