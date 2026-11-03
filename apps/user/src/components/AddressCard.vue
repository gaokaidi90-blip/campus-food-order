<script setup lang="ts">
import type { Address } from '@campus-food/shared'

interface Props {
  address: Address
  showActions?: boolean
}

withDefaults(defineProps<Props>(), {
  showActions: true,
})

const emit = defineEmits<{
  edit: [address: Address]
  delete: [address: Address]
  select: [address: Address]
}>()
</script>

<template>
  <div class="address-card" @click="emit('select', address)">
    <div class="address-header">
      <div class="contact">
        <span class="name">{{ address.name }}</span>
        <span class="phone">{{ address.phone }}</span>
      </div>
      <van-tag v-if="address.isDefault === 1" type="danger" size="small">
        默认
      </van-tag>
    </div>

    <div class="address-detail">
      {{ address.address }} {{ address.building }} {{ address.room }}
    </div>

    <div v-if="showActions" class="address-actions" @click.stop>
      <van-button
        size="small"
        type="primary"
        plain
        @click="emit('edit', address)"
      >
        编辑
      </van-button>
      <van-button
        size="small"
        type="danger"
        plain
        @click="emit('delete', address)"
      >
        删除
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.address-card {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:active {
    background: #f7f8fa;
  }
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.contact {
  display: flex;
  align-items: center;
  gap: 12px;
}

.name {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
}

.phone {
  font-size: 14px;
  color: #646566;
}

.address-detail {
  font-size: 14px;
  color: #646566;
  line-height: 1.6;
  margin-bottom: 12px;
}

.address-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
